const mongoose = require('mongoose');
const Staff = require('../models/staffModel');
const StaffAttendance = require('../models/attendanceModel');
const StaffLeave = require('../models/staffLeaveModel');
const AttendanceDayLock = require('../models/attendanceDayLockModel');
const staffService = require('./staffService');

async function ensureData() {
  await staffService.fetchStaffStats?.().catch(() => {});
  const count = await StaffAttendance.countDocuments({});
  if (count > 0) return;
  const staff = await Staff.find({ status: 'Active' }).select('_id').lean();
  if (!staff.length) return;
  const today = new Date();
  const rows = [];
  for (const s of staff) {
    for (let d = 0; d < 14; d += 1) {
      const day = new Date(today);
      day.setDate(today.getDate() - d);
      day.setHours(0, 0, 0, 0);
      const r = Math.random();
      const status = r > 0.9 ? 'Absent' : r > 0.8 ? 'Late' : r > 0.75 ? 'Leave' : 'Present';
      rows.push({ staff: s._id, date: day, status });
    }
  }
  await StaffAttendance.insertMany(rows, { ordered: false }).catch(() => {});
  const leaveCount = await StaffLeave.countDocuments({});
  if (leaveCount === 0 && staff.length >= 3) {
    const start = new Date(today);
    start.setDate(start.getDate() - 5);
    const end = new Date(start);
    end.setDate(end.getDate() + 2);
    await StaffLeave.insertMany([
      { staff: staff[0]._id, startDate: start, endDate: end, reason: 'Personal', status: 'Approved' },
      { staff: staff[1]._id, startDate: start, endDate: end, reason: 'Sick', status: 'Approved' },
    ], { ordered: false }).catch(() => {});
  }
}

function parseDate(s, fallback) {
  if (!s) return fallback;
  if (typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.trim())) {
    const [y, m, d] = s.trim().split('-').map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

async function isDayLocked(day) {
  const d = startOfDay(day);
  const lock = await AttendanceDayLock.findOne({ date: d }).lean();
  return !!lock;
}

exports.markAttendance = async (payload = {}) => {
  await ensureData();
  const { date, records = [], lockDay = true } = payload;
  const day = startOfDay(parseDate(date, new Date()));
  if (!records.length) {
    const err = new Error('records array is required');
    err.statusCode = 400;
    throw err;
  }
  const locked = await isDayLocked(day);
  if (locked) {
    const err = new Error('Attendance is locked for this date');
    err.statusCode = 403;
    throw err;
  }
  const staffIds = [...new Set(records.map((r) => r.staffId).filter(Boolean))];
  const staff = await Staff.find({ _id: { $in: staffIds }, status: 'Active' }).lean();
  const allowedIds = new Set(staff.map((s) => String(s._id)));
  const valid = ['Present', 'Absent', 'Late', 'Leave'];
  for (const r of records) {
    const sid = String(r.staffId || '');
    if (!allowedIds.has(sid)) continue;
    const status = valid.includes(r.status) ? r.status : 'Present';
    const staffObjId = mongoose.Types.ObjectId.isValid(sid) ? new mongoose.Types.ObjectId(sid) : sid;
    await StaffAttendance.findOneAndUpdate(
      { staff: staffObjId, date: day },
      { $set: { staff: staffObjId, date: day, status } },
      { upsert: true, new: true }
    );
  }
  if (lockDay) {
    await AttendanceDayLock.findOneAndUpdate(
      { date: day },
      { $set: { date: day, lockedAt: new Date() } },
      { upsert: true }
    );
  }
  return { saved: true, locked: lockDay, date: day.toISOString().slice(0, 10), count: records.length };
};

exports.fetchDailyAttendance = async (filters = {}) => {
  await ensureData();
  const day = startOfDay(parseDate(filters.date, new Date()));
  const dayEnd = endOfDay(day);
  const staffQuery = { status: 'Active' };
  if (filters.staffId) staffQuery._id = filters.staffId;
  if (filters.department) staffQuery.department = filters.department;

  const staff = await Staff.find(staffQuery).select('name department').sort({ name: 1 }).lean();
  const staffIds = staff.map((s) => s._id);
  const rows = await StaffAttendance.find({
    staff: { $in: staffIds },
    date: { $gte: day, $lte: dayEnd },
  }).lean();
  const byStaff = new Map(rows.map((r) => [String(r.staff), r.status]));

  const locked = await isDayLocked(day);
  const result = staff.map((s) => ({
    id: String(s._id),
    staffId: String(s._id),
    staffName: s.name || '',
    department: s.department || '',
    status: byStaff.get(String(s._id)) || 'Unmarked',
  }));
  return { date: day.toISOString().slice(0, 10), items: result, isLocked: locked };
};

exports.fetchMonthlyAttendance = async (filters = {}) => {
  await ensureData();
  const month = parseInt(filters.month, 10) || new Date().getMonth() + 1;
  const year = parseInt(filters.year, 10) || new Date().getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const staffQuery = { status: 'Active' };
  if (filters.staffId) staffQuery._id = filters.staffId;
  if (filters.department) staffQuery.department = filters.department;

  const staff = await Staff.find(staffQuery).select('name department').sort({ name: 1 }).lean();
  const staffIds = staff.map((s) => s._id);
  const rows = await StaffAttendance.find({
    staff: { $in: staffIds },
    date: { $gte: start, $lte: end },
  }).lean();

  const byStaff = new Map();
  for (const r of rows) {
    const sid = String(r.staff);
    if (!byStaff.has(sid)) byStaff.set(sid, { present: 0, absent: 0, late: 0, leave: 0, total: 0 });
    const cur = byStaff.get(sid);
    cur.total += 1;
    if (r.status === 'Present') cur.present += 1;
    if (r.status === 'Absent') cur.absent += 1;
    if (r.status === 'Late') cur.late += 1;
    if (r.status === 'Leave') cur.leave += 1;
  }

  const result = staff.map((s) => {
    const sid = String(s._id);
    const stats = byStaff.get(sid) || { present: 0, absent: 0, late: 0, leave: 0, total: 0 };
    const pct = stats.total ? Math.round((stats.present / stats.total) * 100) : 0;
    return {
      id: sid,
      staffId: sid,
      staffName: s.name || '',
      department: s.department || '',
      ...stats,
      attendancePercent: pct,
    };
  });
  return { month, year, items: result };
};

exports.generateAttendanceReport = async (filters = {}) => {
  await ensureData();
  const month = parseInt(filters.month, 10) || new Date().getMonth() + 1;
  const year = parseInt(filters.year, 10) || new Date().getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  const staffQuery = { status: 'Active' };
  if (filters.staffId) staffQuery._id = filters.staffId;
  if (filters.department) staffQuery.department = filters.department;

  const staff = await Staff.find(staffQuery).select('name department').sort({ name: 1 }).lean();
  const staffIds = staff.map((s) => s._id);
  const staffMap = new Map(staff.map((s) => [String(s._id), s]));

  const rows = await StaffAttendance.find({
    staff: { $in: staffIds },
    date: { $gte: start, $lte: end },
  }).sort({ date: 1, staff: 1 }).lean();

  const header = 'Staff ID,Staff Name,Department,Date,Status';
  const csvRows = rows.map((r) => {
    const s = staffMap.get(String(r.staff));
    const dateStr = new Date(r.date).toISOString().slice(0, 10);
    return [String(r.staff), s?.name || '', s?.department || '', dateStr, r.status || 'Present']
      .map((x) => `"${String(x).replace(/"/g, '""')}"`)
      .join(',');
  });

  const summaryHeader = 'Staff Name,Department,Present,Absent,Late,Leave,Total,Attendance %';
  const byStaff = new Map();
  for (const r of rows) {
    const sid = String(r.staff);
    if (!byStaff.has(sid)) byStaff.set(sid, { present: 0, absent: 0, late: 0, leave: 0, total: 0 });
    const cur = byStaff.get(sid);
    cur.total += 1;
    if (r.status === 'Present') cur.present += 1;
    if (r.status === 'Absent') cur.absent += 1;
    if (r.status === 'Late') cur.late += 1;
    if (r.status === 'Leave') cur.leave += 1;
  }
  const summaryRows = staff.map((s) => {
    const sid = String(s._id);
    const stats = byStaff.get(sid) || { present: 0, absent: 0, late: 0, leave: 0, total: 0 };
    const pct = stats.total ? Math.round((stats.present / stats.total) * 100) : 0;
    return [s.name || '', s.department || '', stats.present, stats.absent, stats.late, stats.leave, stats.total, pct]
      .map((x) => `"${String(x).replace(/"/g, '""')}"`)
      .join(',');
  });

  const csv = [header, ...csvRows, '', 'Summary', summaryHeader, ...summaryRows].join('\n');
  return {
    generatedAt: new Date().toISOString(),
    month,
    year,
    csv,
    reportName: `staff-attendance-${year}-${String(month).padStart(2, '0')}.csv`,
    preview: rows.slice(0, 20).map((r) => {
      const s = staffMap.get(String(r.staff));
      return { staffName: s?.name, department: s?.department, date: new Date(r.date).toISOString().slice(0, 10), status: r.status };
    }),
  };
};

exports.fetchLeaveData = async (filters = {}) => {
  await ensureData();
  const staffQuery = { status: 'Active' };
  if (filters.staffId) staffQuery._id = filters.staffId;
  const staff = await Staff.find(staffQuery).select('name department').lean();
  const staffIds = staff.map((s) => s._id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = parseDate(filters.startDate, new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000));
  const end = parseDate(filters.endDate, new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000));
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const leaves = await StaffLeave.find({
    staff: { $in: staffIds },
    status: 'Approved',
    startDate: { $lte: end },
    endDate: { $gte: start },
  }).populate('staff').sort({ startDate: -1 }).lean();

  return {
    items: leaves.map((l) => ({
      id: String(l._id),
      staffId: l.staff?._id ? String(l.staff._id) : '',
      staffName: l.staff?.name || '',
      department: l.staff?.department || '',
      startDate: l.startDate,
      endDate: l.endDate,
      reason: l.reason || '',
      status: l.status || 'Approved',
    })),
  };
};

exports.fetchAbsenteeAlerts = async (filters = {}) => {
  await ensureData();
  const threshold = Math.max(1, parseInt(filters.threshold, 10) || 3);
  const month = parseInt(filters.month, 10) || new Date().getMonth() + 1;
  const year = parseInt(filters.year, 10) || new Date().getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const agg = await StaffAttendance.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: '$staff', absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } } } },
    { $match: { absent: { $gte: threshold } } },
    { $lookup: { from: 'staff', localField: '_id', foreignField: '_id', as: 'staffDoc' } },
    { $unwind: { path: '$staffDoc', preserveNullAndEmptyArrays: true } },
    { $project: { staffId: '$_id', staffName: '$staffDoc.name', department: '$staffDoc.department', absent: 1, _id: 0 } },
  ]);

  return {
    month,
    year,
    threshold,
    items: agg.map((a) => ({
      staffId: String(a.staffId),
      staffName: a.staffName || '',
      department: a.department || '',
      absentDays: a.absent,
      message: `${a.staffName || 'Staff'} has ${a.absent} absent day(s) this month`,
    })),
  };
};

exports.fetchMeta = async () => {
  await ensureData();
  const staff = await Staff.find({ status: 'Active' }).select('name department').sort({ name: 1 }).lean();
  const departments = [...new Set(staff.map((s) => s.department).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return {
    staff: staff.map((s) => ({ id: String(s._id), name: s.name || '', department: s.department || '' })),
    departments,
    statuses: ['Present', 'Absent', 'Late', 'Leave'],
  };
};
