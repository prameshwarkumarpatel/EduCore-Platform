const mongoose = require('mongoose');
const Student = require('../models/Student');
const StudentAttendance = require('../models/StudentAttendance');
const StudentActivity = require('../models/StudentActivity');
const StudentApproval = require('../models/StudentApproval');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function parseRange({ start, end } = {}) {
  const now = new Date();
  const endDate = end ? new Date(end) : now;
  const startDate = start ? new Date(start) : new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    const err = new Error('Invalid date range');
    err.statusCode = 400;
    throw err;
  }
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
}

function daysBetween(startDate, endDate) {
  const days = [];
  const d = new Date(startDate);
  d.setHours(0, 0, 0, 0);
  const last = new Date(endDate);
  last.setHours(0, 0, 0, 0);
  while (d <= last) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

async function ensureSeedData() {
  const studentCount = await Student.countDocuments({});
  if (studentCount === 0) return;

  const activityCount = await StudentActivity.countDocuments({});
  if (activityCount === 0) {
    const some = await Student.find({}).sort({ createdAt: -1 }).limit(10).lean();
    const rows = [];
    for (const s of some) {
      rows.push({
        student: s._id,
        type: 'student',
        action: 'Student record active',
        subject: `${s.name} (${s.assignedClass || '—'}-${s.assignedSection || '—'})`,
        severity: 'low',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 36) * 60 * 60 * 1000),
      });
    }
    await StudentActivity.insertMany(rows, { ordered: false }).catch(() => {});
  }

  const approvalsCount = await StudentApproval.countDocuments({});
  if (approvalsCount === 0) {
    const some = await Student.find({}).limit(8).lean();
    const rows = some.slice(0, 3).map((s, idx) => ({
      student: s._id,
      type: idx % 2 === 0 ? 'Leave' : 'ProfileUpdate',
      status: 'Pending',
      details: idx % 2 === 0 ? { days: 2, reason: 'Medical' } : { field: 'Phone', requested: '+1 (555) 000-0000' },
      requestedAt: new Date(Date.now() - (idx + 2) * 60 * 60 * 1000),
    }));
    await StudentApproval.insertMany(rows, { ordered: false }).catch(() => {});
  }

  // Seed last 14 days attendance for up to 40 students if empty
  const attCount = await StudentAttendance.countDocuments({});
  if (attCount === 0) {
    const students = await Student.find({}).limit(40).lean();
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end.getTime() - 13 * 24 * 60 * 60 * 1000);
    const days = daysBetween(start, end);
    const rows = [];
    for (const s of students) {
      for (const day of days) {
        const present = Math.random() > 0.08; // 92% avg
        rows.push({
          student: s._id,
          date: day,
          status: present ? 'Present' : 'Absent',
        });
      }
    }
    await StudentAttendance.insertMany(rows, { ordered: false }).catch(() => {});
  }
}

async function groupByGradeSection() {
  const students = await Student.find({}).select('assignedClass assignedSection').lean();
  const grades = new Map();
  for (const s of students) {
    const g = s.assignedClass || 'Unassigned';
    const sec = s.assignedSection || '-';
    if (!grades.has(g)) grades.set(g, { grade: g, total: 0, sections: {} });
    const row = grades.get(g);
    row.total += 1;
    row.sections[sec] = (row.sections[sec] || 0) + 1;
  }
  const out = Array.from(grades.values()).sort((a, b) => String(a.grade).localeCompare(String(b.grade)));
  return out;
}

async function attendanceOverview({ startDate, endDate }) {
  const rows = await StudentAttendance.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
  const map = Object.fromEntries(rows.map((r) => [r._id, r.count]));
  const present = map.Present || 0;
  const absent = map.Absent || 0;
  const total = present + absent;
  const avg = total ? Math.round((present / total) * 1000) / 10 : 0; // 1 decimal
  return { averagePct: avg, present, absent, total };
}

async function attendanceTrend({ startDate, endDate }) {
  const rows = await StudentAttendance.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return rows.map((r) => {
    const total = r.present + r.absent;
    const pct = total ? Math.round((r.present / total) * 1000) / 10 : 0;
    return { date: r._id, pct };
  });
}

async function recentActivities({ startDate, endDate }) {
  const rows = await StudentActivity.find({ createdAt: { $gte: startDate, $lte: endDate } })
    .sort({ createdAt: -1 })
    .limit(15)
    .populate('student')
    .lean();
  return rows.map((r) => ({
    id: String(r._id),
    type: r.type,
    action: r.action,
    subject: r.subject || r.student?.name || '',
    severity: r.severity,
    createdAt: r.createdAt,
    student: r.student ? { id: String(r.student._id), name: r.student.name, enrollmentId: r.student.enrollmentId } : null,
  }));
}

async function pendingApprovals() {
  const rows = await StudentApproval.find({ status: 'Pending' })
    .sort({ requestedAt: -1 })
    .limit(10)
    .populate('student')
    .lean();
  return rows.map((r) => ({
    id: String(r._id),
    type: r.type,
    status: r.status,
    requestedAt: r.requestedAt,
    details: r.details || {},
    student: r.student ? { id: String(r.student._id), name: r.student.name, assignedClass: r.student.assignedClass, assignedSection: r.student.assignedSection } : null,
  }));
}

async function alerts({ startDate, endDate }) {
  // Low attendance per student in range
  const rows = await StudentAttendance.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: '$student',
        present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
      },
    },
  ]);
  const low = rows
    .map((r) => {
      const total = r.present + r.absent;
      const pct = total ? (r.present / total) * 100 : 0;
      return { studentId: r._id, pct: Math.round(pct * 10) / 10, total };
    })
    .filter((r) => r.total >= 5 && r.pct < 75)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 8);

  const ids = low.map((x) => x.studentId);
  const students = ids.length ? await Student.find({ _id: { $in: ids } }).lean() : [];
  const byId = new Map(students.map((s) => [String(s._id), s]));

  const attendanceAlerts = low.map((x) => {
    const s = byId.get(String(x.studentId));
    return {
      id: `low-att-${String(x.studentId)}`,
      type: 'LowAttendance',
      severity: x.pct < 60 ? 'high' : x.pct < 70 ? 'medium' : 'low',
      title: 'Low Attendance',
      message: `${s?.name || 'Student'} attendance is ${x.pct}% in selected range.`,
      student: s ? { id: String(s._id), name: s.name, assignedClass: s.assignedClass, assignedSection: s.assignedSection } : null,
      pct: x.pct,
    };
  });

  // Discipline alerts from activities (high severity)
  const discipline = await StudentActivity.find({ type: 'discipline', severity: { $in: ['medium', 'high'] } })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('student')
    .lean();
  const disciplineAlerts = discipline.map((r) => ({
    id: String(r._id),
    type: 'Discipline',
    severity: r.severity,
    title: 'Discipline Case',
    message: r.action,
    student: r.student ? { id: String(r.student._id), name: r.student.name, assignedClass: r.student.assignedClass, assignedSection: r.student.assignedSection } : null,
    createdAt: r.createdAt,
  }));

  return [...attendanceAlerts, ...disciplineAlerts].slice(0, 10);
}

exports.fetchDashboard = async ({ start, end } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const { startDate, endDate } = parseRange({ start, end });
  await ensureSeedData();

  const [totalStudents, gradeDist, att, trend, acts, approvals, alertsList] = await Promise.all([
    Student.countDocuments({}),
    groupByGradeSection(),
    attendanceOverview({ startDate, endDate }),
    attendanceTrend({ startDate, endDate }),
    recentActivities({ startDate, endDate }),
    pendingApprovals(),
    alerts({ startDate, endDate }),
  ]);

  return {
    range: { start: startDate.toISOString(), end: endDate.toISOString() },
    totalStudents,
    gradeDistribution: gradeDist,
    attendance: { ...att, trend },
    recentActivities: acts,
    pendingApprovals: approvals,
    alerts: alertsList,
  };
};

