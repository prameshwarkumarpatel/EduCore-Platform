const mongoose = require('mongoose');
const Student = require('../models/Student');
const LeaveRequest = require('../models/leaveModel');
const LeaveNotification = require('../models/leaveNotificationModel');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function assertDbConnected() {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
}

function resolveQuery(idOrEnrollmentId) {
  if (mongoose.Types.ObjectId.isValid(idOrEnrollmentId)) return { _id: idOrEnrollmentId };
  return { enrollmentId: idOrEnrollmentId };
}

function normalizeDay(d) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function clampRange(start, end) {
  const s = normalizeDay(start);
  const e = normalizeDay(end);
  if (e < s) return { start: e, end: s };
  return { start: s, end: e };
}

function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function ensureSeedDataIfEmpty() {
  assertDbConnected();
  const count = await LeaveRequest.countDocuments({});
  if (count > 0) return;

  const students = await Student.find({ status: 'Active' }).limit(25).lean();
  if (!students.length) return;

  const reasons = ['Fever', 'Medical appointment', 'Family function', 'Sick day', 'Travel'],
    statuses = ['Pending', 'Approved', 'Rejected'];

  const rows = [];
  const daysBack = 180;
  for (const st of students) {
    const n = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i += 1) {
      const offset = Math.floor(Math.random() * daysBack);
      const start = new Date(Date.now() - offset * 24 * 60 * 60 * 1000);
      const len = Math.random() > 0.75 ? 2 : 1;
      const end = new Date(start.getTime() + (len - 1) * 24 * 60 * 60 * 1000);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      const createdAt = new Date(start.getTime() - Math.floor(Math.random() * 8) * 24 * 60 * 60 * 1000);

      rows.push({
        student: st._id,
        startDate: start,
        endDate: end,
        reason,
        status,
        decisionNotes: status === 'Pending' ? '' : status === 'Approved' ? 'Approved by admin.' : 'Rejected by admin.',
        approvedAt: status === 'Approved' ? new Date(end.getTime() + Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000) : undefined,
        rejectedAt: status === 'Rejected' ? new Date(end.getTime() + Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000) : undefined,
        createdAt,
        updatedAt: createdAt,
      });
    }
  }

  await LeaveRequest.insertMany(rows, { ordered: false }).catch(() => {});
}

function rangeFromQuery({ start, end } = {}) {
  const now = new Date();
  const s = start ? new Date(start) : new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
  const e = end ? new Date(end) : now;
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return { startD: null, endD: null };
  const startD = normalizeDay(s);
  const endD = new Date(normalizeDay(e).getTime() + 24 * 60 * 60 * 1000 - 1);
  return { startD, endD };
}

async function fetchStudents({ search } = {}) {
  assertDbConnected();
  const q = search ? String(search).trim() : '';
  const re = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
  const rows = await Student.find({ status: 'Active' }).sort({ createdAt: -1 }).lean();
  const filtered = !re
    ? rows
    : rows.filter((s) => re.test(s.name || '') || re.test(s.enrollmentId || '') || re.test(s.email || ''));
  return filtered.map((s) => ({
    id: String(s._id),
    enrollmentId: s.enrollmentId || '',
    name: s.name,
  }));
}

function toPublicLeave(r, student) {
  return {
    id: String(r._id),
    student: student
      ? { id: String(student._id), name: student.name, enrollmentId: student.enrollmentId || '' }
      : { id: '', name: '', enrollmentId: '' },
    startDate: r.startDate,
    endDate: r.endDate,
    reason: r.reason,
    status: r.status,
    decisionNotes: r.decisionNotes || '',
    approvedAt: r.approvedAt,
    rejectedAt: r.rejectedAt,
    createdAt: r.createdAt,
  };
}

exports.fetchFilters = async () => {
  assertDbConnected();
  return {
    statuses: ['Pending', 'Approved', 'Rejected'],
  };
};

exports.fetchStudents = fetchStudents;

exports.fetchLeaveRequests = async ({ start, end, status, studentId } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const { startD, endD } = rangeFromQuery({ start, end });

  const query = {};
  if (startD && endD) {
    query.startDate = { $lte: endD };
    query.endDate = { $gte: startD };
  }
  if (status && ['Pending', 'Approved', 'Rejected'].includes(status)) query.status = status;
  if (studentId) {
    const resolved = resolveQuery(studentId);
    // if enrollmentId, map to _id
    if (resolved.enrollmentId) {
      const s = await Student.findOne(resolved).select('_id').lean();
      if (s) query.student = s._id;
      else query.student = null;
    } else {
      query.student = resolved._id;
    }
  }

  const rows = await LeaveRequest.find(query).sort({ createdAt: -1 }).populate('student').lean();
  return rows.map((r) => toPublicLeave(r, r.student));
};

exports.fetchLeaveHistory = async ({ studentId, start, end } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();

  const { startD, endD } = rangeFromQuery({ start, end });
  const query = {};
  if (studentId) {
    const resolved = resolveQuery(studentId);
    if (resolved.enrollmentId) {
      const s = await Student.findOne(resolved).select('_id').lean();
      if (s) query.student = s._id;
    } else {
      query.student = resolved._id;
    }
  }
  if (startD && endD) {
    query.startDate = { $lte: endD };
    query.endDate = { $gte: startD };
  }

  const rows = await LeaveRequest.find(query).sort({ startDate: 1 }).populate('student').lean();
  return rows.map((r) => toPublicLeave(r, r.student));
};

exports.submitLeaveRequest = async ({ studentId, startDate, endDate, reason } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();

  if (!studentId) {
    const err = new Error('studentId is required');
    err.statusCode = 400;
    throw err;
  }
  if (!startDate || !endDate) {
    const err = new Error('startDate and endDate are required');
    err.statusCode = 400;
    throw err;
  }
  if (!reason) {
    const err = new Error('reason is required');
    err.statusCode = 400;
    throw err;
  }

  const resolved = resolveQuery(studentId);
  const student = await Student.findOne(resolved).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  const { start, end } = clampRange(startDate, endDate);

  const row = await LeaveRequest.create({
    student: student._id,
    startDate: start,
    endDate: end,
    reason,
    status: 'Pending',
    decisionNotes: '',
  });

  return toPublicLeave(row.toObject ? row.toObject() : row, { _id: student._id, name: student.name, enrollmentId: student.enrollmentId });
};

async function decideLeave({ requestId, status, decisionNotes } = {}) {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const row = await LeaveRequest.findById(requestId).populate('student').lean();
  if (!row) {
    const err = new Error('Leave request not found');
    err.statusCode = 404;
    throw err;
  }
  if (row.status !== 'Pending') return { updated: false };

  const updates = {
    status,
    decisionNotes: decisionNotes || '',
    approvedAt: status === 'Approved' ? new Date() : undefined,
    rejectedAt: status === 'Rejected' ? new Date() : undefined,
  };

  await LeaveRequest.updateOne({ _id: row._id }, { $set: updates }).catch(() => {});

  const updated = await LeaveRequest.findById(requestId).populate('student').lean();
  const student = updated?.student;

  const message =
    status === 'Approved'
      ? `Leave Approved: ${updated.startDate.toISOString().slice(0, 10)} to ${updated.endDate.toISOString().slice(0, 10)}. Reason: ${updated.reason}`
      : `Leave Rejected: ${updated.startDate.toISOString().slice(0, 10)} to ${updated.endDate.toISOString().slice(0, 10)}. Reason: ${updated.reason}`;

  await LeaveNotification.create({
    student: student?._id,
    leaveRequest: updated._id,
    channel: 'SMS',
    message,
    status: 'Sent',
    sentAt: new Date(),
    meta: { decisionNotes: decisionNotes || '' },
  }).catch(() => {});

  return { updated: true, leave: toPublicLeave(updated, student) };
}

exports.approveLeave = async ({ requestId, decisionNotes } = {}) => decideLeave({ requestId, status: 'Approved', decisionNotes });
exports.rejectLeave = async ({ requestId, decisionNotes } = {}) => decideLeave({ requestId, status: 'Rejected', decisionNotes });

exports.fetchNotifications = async ({ studentId } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const query = {};
  if (studentId) {
    const resolved = resolveQuery(studentId);
    if (resolved.enrollmentId) {
      const s = await Student.findOne(resolved).select('_id').lean();
      if (s) query.student = s._id;
      else query.student = null;
    } else {
      query.student = resolved._id;
    }
  }
  const rows = await LeaveNotification.find(query).sort({ createdAt: -1 }).lean();
  return rows.map((n) => ({
    id: String(n._id),
    studentId: n.student ? String(n.student) : null,
    leaveRequestId: n.leaveRequest ? String(n.leaveRequest) : null,
    channel: n.channel,
    status: n.status,
    message: n.message,
    sentAt: n.sentAt,
    createdAt: n.createdAt,
  }));
};

exports.notifyParent = async ({ studentId, leaveRequestId, channel = 'SMS', message } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  if (!studentId) {
    const err = new Error('studentId is required');
    err.statusCode = 400;
    throw err;
  }
  if (!leaveRequestId) {
    const err = new Error('leaveRequestId is required');
    err.statusCode = 400;
    throw err;
  }

  const resolved = resolveQuery(studentId);
  const student = await Student.findOne(resolved).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  const leave = await LeaveRequest.findById(leaveRequestId).lean().catch(() => null);
  if (!leave) {
    const err = new Error('Leave request not found');
    err.statusCode = 404;
    throw err;
  }

  const msg =
    message ||
    `Leave update: ${leave.startDate?.toISOString().slice(0, 10)} to ${leave.endDate?.toISOString().slice(0, 10)} (${leave.status}).`;

  const notif = await LeaveNotification.create({
    student: student._id,
    leaveRequest: leave._id,
    channel,
    message: msg,
    status: 'Sent',
    sentAt: new Date(),
  }).catch(() => null);

  return {
    id: notif?._id ? String(notif._id) : '',
    status: notif?.status || 'Sent',
  };
};

exports.generateLeaveReport = async ({ start, end, status, studentId } = {}) => {
  const list = await exports.fetchLeaveRequests({ start, end, status, studentId });
  const reportNo = `LEAV-${Math.floor(1000 + Math.random() * 9000)}`;
  const studentName = list[0]?.student?.name || 'All Students';
  const rangeText = `${start || '—'} to ${end || '—'}`;

  const rowsHtml = list
    .slice(0, 60)
    .map((l) => {
      const s = l.startDate ? new Date(l.startDate).toISOString().slice(0, 10) : '';
      const e = l.endDate ? new Date(l.endDate).toISOString().slice(0, 10) : '';
      return `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(l.student?.enrollmentId || '')}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(l.student?.name || '')}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(s)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(e)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(l.reason || '')}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(l.status || '')}</td>
      </tr>`;
    })
    .join('');

  const content = `
    <div style="font-family:Arial, sans-serif;padding:18px;">
      <h2 style="margin:0 0 8px;">Leave Report</h2>
      <p style="margin:0 0 14px;color:#444;">
        Report No: <b>${escHtml(reportNo)}</b> &nbsp; | &nbsp; Student: <b>${escHtml(studentName)}</b> &nbsp; | &nbsp; Range: <b>${escHtml(rangeText)}</b>
      </p>
      <div style="border:1px solid #ddd;border-radius:12px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#fafafa;">
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">Enrollment</th>
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">Student</th>
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">Start</th>
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">End</th>
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">Reason</th>
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colSpan="6" style="padding:16px 8px;color:#777;">No leave records found.</td></tr>'}
          </tbody>
        </table>
      </div>
      <p style="margin-top:14px;color:#666;font-size:12px;">Generated automatically by SMS ERP.</p>
    </div>
  `;

  return { reportNo, content, total: list.length };
};

exports.exportLeaveReportCsv = async ({ start, end, status, studentId } = {}) => {
  const list = await exports.fetchLeaveRequests({ start, end, status, studentId });
  const header = ['EnrollmentID', 'StudentName', 'StartDate', 'EndDate', 'Reason', 'Status'];
  const lines = [header.join(',')];
  for (const l of list) {
    const s = l.startDate ? new Date(l.startDate).toISOString().slice(0, 10) : '';
    const e = l.endDate ? new Date(l.endDate).toISOString().slice(0, 10) : '';
    const vals = [l.student?.enrollmentId || '', l.student?.name || '', s, e, l.reason || '', l.status || ''].map((v) =>
      `"${String(v).replaceAll('"', '""')}"`
    );
    lines.push(vals.join(','));
  }
  return lines.join('\n');
};

