const mongoose = require('mongoose');
const DashboardActivity = require('../models/DashboardActivity');
const DashboardNotification = require('../models/DashboardNotification');
const Student = require('../models/Student');
const User = require('../models/User');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

async function ensureSeeds() {
  const notifCount = await DashboardNotification.countDocuments({});
  if (notifCount === 0) {
    await DashboardNotification.insertMany(
      [
        { title: 'System Update Scheduled', message: 'Server maintenance at 12 AM.', type: 'system', isRead: false },
        { title: 'New Leave Request', message: 'Pending approval from Mr. Smith.', type: 'alert', isRead: false },
      ],
      { ordered: false }
    ).catch(() => {});
  }

  const actCount = await DashboardActivity.countDocuments({});
  if (actCount === 0) {
    await DashboardActivity.insertMany(
      [
        { action: 'New student enrolled', subject: 'Converted via Enrollment Records', type: 'student' },
        { action: 'Absentee Alert', subject: 'Class 8-B (sample)', type: 'attendance' },
      ],
      { ordered: false }
    ).catch(() => {});
  }
}

function growthFrom(prev, current) {
  if (!prev || prev <= 0) return '+0%';
  const pct = ((current - prev) / prev) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

exports.calculateStudentCount = async () => {
  if (!isDbConnected()) return { total: 0, growth: '+0%' };
  const total = await Student.countDocuments({});
  // placeholder: growth vs 30 days ago not tracked yet
  return { total, growth: '+0%' };
};

exports.calculateTeacherCount = async () => {
  if (!isDbConnected()) return { total: 0, growth: '+0%' };
  const total = await User.countDocuments({ role: 'Teacher' }).catch(() => 0);
  return { total, growth: '+0%' };
};

exports.calculateRevenueMTD = async () => {
  // fee module not implemented yet; keep dynamic placeholder
  return { total: '$0', growth: '+0%' };
};

exports.calculateAttendance = async () => {
  // attendance module not implemented yet; keep dynamic placeholder
  return { total: '0%', growth: '+0%', isUp: true };
};

exports.getRecentActivities = async () => {
  if (!isDbConnected()) return [];
  await ensureSeeds();
  const rows = await DashboardActivity.find({}).sort({ createdAt: -1 }).limit(20).lean();
  return rows.map((r) => ({
    id: String(r._id),
    action: r.action,
    subject: r.subject,
    time: r.createdAt,
    type: r.type,
  }));
};

exports.getNotifications = async () => {
  if (!isDbConnected()) return [];
  await ensureSeeds();
  const rows = await DashboardNotification.find({}).sort({ createdAt: -1 }).limit(20).lean();
  return rows.map((r) => ({
    id: String(r._id),
    title: r.title,
    message: r.message,
    type: r.type,
    isRead: Boolean(r.isRead),
    createdAt: r.createdAt,
  }));
};

exports.logQuickAction = async ({ actionType, payload } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  await ensureSeeds();
  const map = {
    admission: { action: 'Quick Action: New Admission', type: 'student' },
    id_card: { action: 'Quick Action: Create ID Card', type: 'system' },
    report: { action: 'Quick Action: Generate Report', type: 'academic' },
    circulars: { action: 'Quick Action: View Circulars', type: 'system' },
  };
  const spec = map[actionType] || { action: `Quick Action: ${actionType || 'unknown'}`, type: 'system' };
  const row = await DashboardActivity.create({
    action: spec.action,
    subject: payload?.note || '',
    type: spec.type,
    meta: { actionType, payload: payload || {} },
  });
  return { id: String(row._id) };
};

exports.markNotificationRead = async (id, isRead = true) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const updated = await DashboardNotification.findByIdAndUpdate(id, { isRead: Boolean(isRead) }, { new: true }).lean();
  if (!updated) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }
  return { id: String(updated._id), isRead: Boolean(updated.isRead) };
};
