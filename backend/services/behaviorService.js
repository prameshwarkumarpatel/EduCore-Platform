const mongoose = require('mongoose');
const Student = require('../models/Student');
const BehaviorIncident = require('../models/behaviorModel');
const ParentNotification = require('../models/notificationModel');

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

function toISODate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  return dt.toISOString();
}

function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function severityRank(s) {
  if (s === 'critical') return 4;
  if (s === 'high') return 3;
  if (s === 'medium') return 2;
  return 1;
}

function statusBadgeCls(sev) {
  const r = severityRank(sev);
  if (r >= 4) return 'critical';
  if (r >= 3) return 'high';
  if (r >= 2) return 'medium';
  return 'low';
}

async function ensureSeedDataIfEmpty() {
  assertDbConnected();
  const count = await BehaviorIncident.countDocuments({});
  if (count > 0) return;

  const students = await Student.find({ status: 'Active' }).limit(30).lean();
  if (!students.length) return;

  const categories = ['Disruption', 'Late Submission', 'Bullying', 'Fighting', 'Detention', 'Cheating', 'Respect Violation'];
  const severities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['Open', 'Resolved'];

  const rows = [];
  const days = 120;
  for (const st of students) {
    const incidentsForStudent = 6 + Math.floor(Math.random() * 5); // ~6-10
    for (let i = 0; i < incidentsForStudent; i += 1) {
      const createdAt = new Date(Date.now() - Math.floor(Math.random() * days) * 24 * 60 * 60 * 1000);
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const status = Math.random() > 0.55 ? 'Open' : 'Resolved';
      const remarks = `Auto-seeded: ${category} (${severity}) for ${st.name}`;
      rows.push({
        student: st._id,
        category,
        severity,
        remarks,
        notes: `Teacher note: review ${category.toLowerCase()}.`,
        status,
        resolvedAt: status === 'Resolved' ? new Date(createdAt.getTime() + (2 + Math.random() * 8) * 24 * 60 * 60 * 1000) : undefined,
        createdAt,
        updatedAt: createdAt,
      });
    }
  }

  await BehaviorIncident.insertMany(rows, { ordered: false }).catch(() => {});
}

function normalizeRange({ start, end } = {}) {
  const now = new Date();
  const startD = start ? new Date(start) : new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
  const endD = end ? new Date(end) : now;
  if (Number.isNaN(startD.getTime()) || Number.isNaN(endD.getTime())) {
    const err = new Error('Invalid date range');
    err.statusCode = 400;
    throw err;
  }
  startD.setHours(0, 0, 0, 0);
  endD.setHours(23, 59, 59, 999);
  return { startD, endD };
}

async function fetchStudents({ search } = {}) {
  assertDbConnected();
  const q = search ? String(search).trim() : '';
  const re = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
  const query = { status: 'Active' };
  const rows = await Student.find(query).sort({ createdAt: -1 }).lean();
  const filtered = !re
    ? rows
    : rows.filter((s) => re.test(s.name || '') || re.test(s.enrollmentId || '') || re.test(s.email || ''));
  return filtered.map((s) => ({
    id: String(s._id),
    enrollmentId: s.enrollmentId || '',
    name: s.name,
    assignedClass: s.assignedClass || '',
    assignedSection: s.assignedSection || '',
  }));
}

function toPublicIncident(r, student) {
  return {
    id: String(r._id),
    student: student
      ? {
          id: String(student._id),
          enrollmentId: student.enrollmentId || '',
          name: student.name,
          assignedClass: student.assignedClass || '',
          assignedSection: student.assignedSection || '',
        }
      : null,
    category: r.category,
    severity: r.severity,
    remarks: r.remarks || '',
    notes: r.notes || '',
    status: r.status,
    resolvedAt: r.resolvedAt,
    createdAt: r.createdAt,
  };
}

async function fetchIncidents({ start, end, severity, studentId } = {}) {
  await ensureSeedDataIfEmpty();
  const { startD, endD } = normalizeRange({ start, end });
  assertDbConnected();

  const query = { createdAt: { $gte: startD, $lte: endD } };
  if (severity && ['low', 'medium', 'high', 'critical'].includes(severity)) query.severity = severity;
  if (studentId) {
    const resolved = resolveQuery(studentId);
    query.student = resolved._id ? resolved._id : undefined;
    if (!resolved._id) {
      // enrollmentId resolution: find matching student ids
      const s = await Student.findOne(resolved).select('_id').lean();
      if (s) query.student = s._id;
      else query.student = null;
    }
  }

  const rows = await BehaviorIncident.find(query)
    .sort({ createdAt: -1 })
    .populate('student')
    .lean();

  return rows.map((r) => toPublicIncident(r, r.student));
}

exports.fetchFilters = async () => {
  assertDbConnected();
  return {
    severities: ['low', 'medium', 'high', 'critical'],
    categories: ['Disruption', 'Late Submission', 'Bullying', 'Fighting', 'Detention', 'Cheating', 'Respect Violation'],
    status: ['Open', 'Resolved'],
  };
};

exports.fetchStudents = async ({ search } = {}) => fetchStudents({ search });

exports.fetchIncidents = async ({ start, end, severity, studentId } = {}) => fetchIncidents({ start, end, severity, studentId });

exports.fetchBehaviorHistory = async ({ studentId, start, end } = {}) => {
  const list = await fetchIncidents({ studentId, start, end });
  return {
    studentId,
    incidents: list.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  };
};

exports.logIncident = async ({ studentId, category, severity, remarks, notes, notifyParent } = {}) => {
  assertDbConnected();
  if (!studentId) {
    const err = new Error('studentId is required');
    err.statusCode = 400;
    throw err;
  }
  if (!category) {
    const err = new Error('category is required');
    err.statusCode = 400;
    throw err;
  }
  if (!severity || !['low', 'medium', 'high', 'critical'].includes(severity)) {
    const err = new Error('severity is required');
    err.statusCode = 400;
    throw err;
  }

  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  await ensureSeedDataIfEmpty();

  const incident = await BehaviorIncident.create({
    student: student._id,
    category,
    severity,
    remarks: remarks || '',
    notes: notes || '',
    status: 'Open',
  });

  let notification = null;
  if (notifyParent) {
    const message = `Behavior alert: ${category} (${severity}). Remarks: ${remarks || '—'}`;
    notification = await ParentNotification.create({
      student: student._id,
      incident: incident._id,
      channel: 'SMS',
      message,
      status: 'Sent',
      sentAt: new Date(),
    });
  }

  const out = toPublicIncident(incident, student);
  return { incident: out, notification: notification ? { id: String(notification._id), status: notification.status } : null };
};

exports.fetchNotifications = async ({ studentId } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const query = {};
  if (studentId) {
    const resolved = resolveQuery(studentId);
    const s = await Student.findOne(resolved).select('_id').lean();
    if (!s) return [];
    query.student = s._id;
  }
  const rows = await ParentNotification.find(query).sort({ createdAt: -1 }).lean();
  return rows.map((n) => ({
    id: String(n._id),
    studentId: n.student ? String(n.student) : null,
    incidentId: n.incident ? String(n.incident) : null,
    channel: n.channel,
    status: n.status,
    message: n.message,
    sentAt: n.sentAt,
    createdAt: n.createdAt,
  }));
};

exports.notifyParent = async ({ studentId, incidentId, channel, message } = {}) => {
  assertDbConnected();
  if (!studentId) {
    const err = new Error('studentId is required');
    err.statusCode = 400;
    throw err;
  }
  const student = await Student.findOne(resolveQuery(studentId)).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  let incident = null;
  if (incidentId) {
    incident = await BehaviorIncident.findById(incidentId).lean().catch(() => null);
  }

  const notif = await ParentNotification.create({
    student: student._id,
    incident: incident ? incident._id : undefined,
    channel: channel || 'SMS',
    message: message || 'Parent notification: behavior incident logged.',
    status: 'Sent',
    sentAt: new Date(),
  });

  return {
    id: String(notif._id),
    status: notif.status,
  };
};

exports.generateBehaviorReport = async ({ start, end, severity, studentId } = {}) => {
  const incidents = await fetchIncidents({ start, end, severity, studentId });
  const dateRange = `${start || '—'} to ${end || '—'}`;
  const studentName = incidents[0]?.student?.name || 'All students';
  const reportNo = `BHV-${Math.floor(1000 + Math.random() * 9000)}`;

  const rows = incidents
    .slice(0, 50)
    .map(
      (i) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(i.student?.enrollmentId || '')}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(i.student?.name || '')}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(i.category)}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(i.severity)}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(i.status)}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escHtml(i.remarks)}</td>
        </tr>
      `
    )
    .join('');

  const content = `
    <div style="font-family:Arial, sans-serif;padding:18px;">
      <h2 style="margin:0 0 8px;">Behavior & Discipline Report</h2>
      <p style="margin:0 0 14px;color:#444;">Report No: <b>${escHtml(reportNo)}</b> &nbsp; | &nbsp; Student: <b>${escHtml(
        studentName
      )}</b> &nbsp; | &nbsp; Range: <b>${escHtml(dateRange)}</b></p>
      <div style="border:1px solid #ddd;border-radius:12px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#fafafa;">
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">Enrollment</th>
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">Student</th>
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">Category</th>
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">Severity</th>
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">Status</th>
              <th align="left" style="padding:10px 8px;border-bottom:1px solid #eee;">Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="6" style="padding:16px 8px;color:#777;">No incidents found.</td></tr>`}
          </tbody>
        </table>
      </div>
      <p style="margin-top:14px;color:#666;font-size:12px;">Generated automatically by SMS ERP.</p>
    </div>
  `;

  return {
    reportNo,
    content,
    total: incidents.length,
  };
};

exports.exportBehaviorReportCsv = async ({ start, end, severity, studentId } = {}) => {
  const incidents = await fetchIncidents({ start, end, severity, studentId });
  const header = ['StudentEnrollmentId', 'StudentName', 'Category', 'Severity', 'Status', 'Remarks', 'CreatedAt'];
  const lines = [header.join(',')];
  for (const i of incidents) {
    const vals = [
      i.student?.enrollmentId || '',
      i.student?.name || '',
      i.category || '',
      i.severity || '',
      i.status || '',
      i.remarks || '',
      i.createdAt ? new Date(i.createdAt).toISOString() : '',
    ].map((v) => `"${String(v).replaceAll('"', '""')}"`);
    lines.push(vals.join(','));
  }
  return lines.join('\n');
};

