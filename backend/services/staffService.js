const mongoose = require('mongoose');
const Staff = require('../models/staffModel');
const Department = require('../models/departmentModel');
const StaffAttendance = require('../models/attendanceModel');
const StaffPayroll = require('../models/payrollModel');

function assertDbConnected() {
  if (mongoose.connection?.readyState !== 1) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
}

async function seedIfEmpty() {
  assertDbConnected();
  const count = await Staff.countDocuments({});
  if (count > 0) return;

  const departments = ['Mathematics', 'Science', 'Languages', 'Administration', 'Operations', 'Sports'];
  await Department.insertMany(departments.map((name) => ({ name })), { ordered: false }).catch(() => {});

  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'CS', 'PE'];
  const classes = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

  const staffDocs = [];
  for (let i = 1; i <= 24; i += 1) {
    const isTeacher = i <= 16;
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const assignedClasses = isTeacher
      ? Array.from(new Set([classes[Math.floor(Math.random() * classes.length)], classes[Math.floor(Math.random() * classes.length)]])).filter(Boolean)
      : [];
    const assignedSubjects = isTeacher
      ? Array.from(new Set([subjects[Math.floor(Math.random() * subjects.length)], subjects[Math.floor(Math.random() * subjects.length)]])).filter(Boolean)
      : [];
    staffDocs.push({
      name: `Staff ${i}`,
      role: isTeacher ? 'Teacher' : (Math.random() > 0.5 ? 'Admin' : 'Staff'),
      roleType: isTeacher ? 'Teacher' : 'NonTeaching',
      department: dept,
      email: `staff${i}@school.com`,
      phone: `900000${String(i).padStart(4, '0')}`,
      gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
      joiningDate: new Date(Date.now() - Math.floor(Math.random() * 1200) * 24 * 60 * 60 * 1000),
      employeeId: `EMP-${String(1000 + i)}`,
      status: Math.random() > 0.08 ? 'Active' : 'Inactive',
      assignedClasses,
      assignedSubjects,
    });
  }

  const created = await Staff.insertMany(staffDocs, { ordered: false }).catch(() => []);
  const rows = created.length ? created : await Staff.find({}).lean();
  if (!rows.length) return;

  const today = new Date();
  const payrollRows = [];
  const attendanceRows = [];
  for (const s of rows) {
    const basic = s.roleType === 'Teacher' ? 42000 + Math.floor(Math.random() * 18000) : 28000 + Math.floor(Math.random() * 13000);
    payrollRows.push({
      staff: s._id,
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      basicSalary: basic,
      paidAmount: Math.random() > 0.25 ? basic : 0,
      status: Math.random() > 0.25 ? 'Paid' : 'Pending',
    });

    for (let d = 0; d < 7; d += 1) {
      const day = new Date(today);
      day.setDate(today.getDate() - d);
      day.setHours(0, 0, 0, 0);
      const r = Math.random();
      const status = r > 0.88 ? 'Absent' : r > 0.75 ? 'Late' : 'Present';
      attendanceRows.push({ staff: s._id, date: day, status });
    }
  }

  await StaffPayroll.insertMany(payrollRows, { ordered: false }).catch(() => {});
  await StaffAttendance.insertMany(attendanceRows, { ordered: false }).catch(() => {});
}

exports.fetchStaffStats = async () => {
  await seedIfEmpty();
  const totalStaff = await Staff.countDocuments({});
  const teachers = await Staff.countDocuments({ roleType: 'Teacher' });
  const nonTeaching = await Staff.countDocuments({ roleType: 'NonTeaching' });

  const deptAgg = await Staff.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } },
    { $project: { _id: 0, department: '$_id', count: 1 } },
    { $sort: { count: -1, department: 1 } },
  ]);

  return {
    totalStaff,
    teachers,
    nonTeaching,
    teacherRatio: totalStaff ? Number((teachers / totalStaff).toFixed(2)) : 0,
    nonTeachingRatio: totalStaff ? Number((nonTeaching / totalStaff).toFixed(2)) : 0,
    departmentDistribution: deptAgg,
  };
};

exports.fetchWorkload = async () => {
  await seedIfEmpty();
  const rows = await Staff.find({ roleType: 'Teacher', status: 'Active' }).lean();
  const items = rows.map((s) => ({
    id: String(s._id),
    name: s.name,
    department: s.department || '',
    classesCount: Array.isArray(s.assignedClasses) ? s.assignedClasses.length : 0,
    subjectsCount: Array.isArray(s.assignedSubjects) ? s.assignedSubjects.length : 0,
    assignedClasses: s.assignedClasses || [],
    assignedSubjects: s.assignedSubjects || [],
  }));
  const totalClasses = items.reduce((a, b) => a + (b.classesCount || 0), 0);
  const totalSubjects = items.reduce((a, b) => a + (b.subjectsCount || 0), 0);
  return { summary: { totalClasses, totalSubjects }, items };
};

exports.fetchAttendance = async () => {
  await seedIfEmpty();
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const rows = await StaffAttendance.find({ date: { $gte: since } }).lean();
  const total = rows.length || 1;
  const present = rows.filter((r) => r.status === 'Present').length;
  const absent = rows.filter((r) => r.status === 'Absent').length;
  const late = rows.filter((r) => r.status === 'Late').length;

  const daily = {};
  for (const r of rows) {
    const k = new Date(r.date).toISOString().slice(0, 10);
    if (!daily[k]) daily[k] = { date: k, present: 0, absent: 0, late: 0 };
    if (r.status === 'Present') daily[k].present += 1;
    if (r.status === 'Absent') daily[k].absent += 1;
    if (r.status === 'Late') daily[k].late += 1;
  }

  return {
    presentPercent: Number(((present / total) * 100).toFixed(1)),
    present,
    absent,
    late,
    trend: Object.values(daily).sort((a, b) => a.date.localeCompare(b.date)),
  };
};

exports.fetchPayrollSummary = async () => {
  await seedIfEmpty();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const rows = await StaffPayroll.find({ month, year }).populate('staff').lean();

  const totalSalary = rows.reduce((a, r) => a + (r.basicSalary || 0), 0);
  const totalPaid = rows.reduce((a, r) => a + (r.paidAmount || 0), 0);
  const paidCount = rows.filter((r) => r.status === 'Paid').length;
  const pendingCount = rows.filter((r) => r.status === 'Pending').length;

  return {
    month,
    year,
    totalSalary,
    totalPaid,
    totalPending: Math.max(totalSalary - totalPaid, 0),
    paidCount,
    pendingCount,
    items: rows.slice(0, 10).map((r) => ({
      id: String(r._id),
      staffName: r.staff?.name || '—',
      basicSalary: r.basicSalary || 0,
      paidAmount: r.paidAmount || 0,
      status: r.status || 'Pending',
    })),
  };
};

exports.fetchActivities = async () => {
  await seedIfEmpty();
  const attendance = await StaffAttendance.find({}).sort({ createdAt: -1 }).limit(8).populate('staff').lean();
  return attendance.map((a) => ({
    id: String(a._id),
    title: `${a.staff?.name || 'Staff'} marked ${a.status}`,
    detail: `${a.staff?.department || ''} • ${new Date(a.date).toLocaleDateString()}`,
    createdAt: a.createdAt,
  }));
};

exports.fetchPendingTasks = async () => {
  await seedIfEmpty();
  const pendingPayroll = await StaffPayroll.find({ status: 'Pending' }).limit(8).populate('staff').lean();
  return pendingPayroll.map((p) => ({
    id: String(p._id),
    title: `Payroll pending: ${p.staff?.name || 'Staff'}`,
    detail: `Amount: ${p.basicSalary || 0}`,
    priority: 'medium',
    createdAt: p.createdAt,
  }));
};

exports.fetchDepartments = async () => {
  await seedIfEmpty();
  const rows = await Department.find({}).sort({ name: 1 }).lean();
  return rows.map((d) => d.name).filter(Boolean);
};

exports.createStaff = async (payload = {}) => {
  await seedIfEmpty();
  const role = ['Teacher', 'Admin', 'Staff'].includes(payload.role) ? payload.role : 'Teacher';
  const roleType = role === 'Teacher' ? 'Teacher' : 'NonTeaching';
  const doc = await Staff.create({
    name: payload.name || 'New Staff',
    role,
    roleType,
    department: payload.department || '',
    email: payload.email || '',
    phone: payload.phone || '',
    dob: payload.dob || undefined,
    gender: payload.gender || '',
    joiningDate: payload.joiningDate || undefined,
    employeeId: payload.employeeId || '',
    photoUrl: payload.photoUrl || '',
    status: payload.status || 'Active',
    assignedClasses: Array.isArray(payload.assignedClasses) ? payload.assignedClasses : [],
    assignedSubjects: Array.isArray(payload.assignedSubjects) ? payload.assignedSubjects : [],
  });
  return {
    id: String(doc._id),
    name: doc.name,
    role: doc.role,
    roleType: doc.roleType,
    department: doc.department || '',
    email: doc.email || '',
    phone: doc.phone || '',
    dob: doc.dob,
    gender: doc.gender || '',
    joiningDate: doc.joiningDate,
    employeeId: doc.employeeId || '',
    photoUrl: doc.photoUrl || '',
    status: doc.status || 'Active',
  };
};

exports.updateStaffRecord = async (id, payload = {}) => {
  const row = await Staff.findById(id);
  if (!row) {
    const err = new Error('Staff not found');
    err.statusCode = 404;
    throw err;
  }
  const role = payload.role && ['Teacher', 'Admin', 'Staff'].includes(payload.role) ? payload.role : row.role;
  if (role) {
    row.role = role;
    row.roleType = role === 'Teacher' ? 'Teacher' : 'NonTeaching';
  }
  const allowed = ['name', 'department', 'email', 'phone', 'dob', 'gender', 'joiningDate', 'employeeId', 'status', 'assignedClasses', 'assignedSubjects', 'photoUrl'];
  for (const k of allowed) {
    if (payload[k] !== undefined) row[k] = payload[k];
  }
  await row.save();
  return {
    id: String(row._id),
    name: row.name,
    role: row.role,
    roleType: row.roleType,
    department: row.department || '',
    email: row.email || '',
    phone: row.phone || '',
    dob: row.dob,
    gender: row.gender || '',
    joiningDate: row.joiningDate,
    employeeId: row.employeeId || '',
    photoUrl: row.photoUrl || '',
    status: row.status || 'Active',
  };
};

exports.uploadProfilePhoto = async (id, dataUrl) => {
  const row = await Staff.findById(id);
  if (!row) {
    const err = new Error('Staff not found');
    err.statusCode = 404;
    throw err;
  }
  if (!dataUrl || !String(dataUrl).startsWith('data:image/')) {
    const err = new Error('Invalid profile photo payload');
    err.statusCode = 400;
    throw err;
  }
  row.photoUrl = String(dataUrl);
  await row.save();
  return { id: String(row._id), photoUrl: row.photoUrl };
};

