const Department = require('../models/departmentModel');
const Staff = require('../models/staffModel');
const staffService = require('./staffService');

function toPublic(dep) {
  const d = dep.toObject ? dep.toObject() : dep;
  const head = d.head && typeof d.head === 'object'
    ? { id: String(d.head._id), name: d.head.name || '' }
    : d.head
      ? { id: String(d.head), name: '' }
      : null;
  const staff = Array.isArray(d.staff) ? d.staff.map((s) => (
    s && typeof s === 'object'
      ? { id: String(s._id), name: s.name || '', role: s.role || '', roleType: s.roleType || '', email: s.email || '', phone: s.phone || '' }
      : { id: String(s), name: '', role: '', roleType: '', email: '', phone: '' }
  )) : [];
  return {
    id: String(d._id),
    name: d.name || '',
    head,
    staff,
    staffCount: staff.length,
    createdAt: d.createdAt,
  };
}

async function ensureData() {
  await staffService.fetchStaffStats();
}

exports.fetchDepartments = async ({ search } = {}) => {
  await ensureData();
  let rows = await Department.find({}).sort({ name: 1 }).populate('head').populate('staff').lean();
  if (search) {
    const re = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    rows = rows.filter((r) => re.test(r.name || '') || re.test(r.head?.name || ''));
  }
  return rows.map(toPublic);
};

exports.fetchDepartmentDetails = async (id) => {
  await ensureData();
  const row = await Department.findById(id).populate('head').populate('staff').lean();
  if (!row) {
    const err = new Error('Department not found');
    err.statusCode = 404;
    throw err;
  }
  return toPublic(row);
};

exports.createDepartment = async ({ name, headId } = {}) => {
  await ensureData();
  if (!name || !String(name).trim()) {
    const err = new Error('Department name is required');
    err.statusCode = 400;
    throw err;
  }
  const payload = { name: String(name).trim() };
  if (headId) payload.head = headId;
  const row = await Department.create(payload);
  return exports.fetchDepartmentDetails(row._id);
};

exports.updateDepartment = async (id, { name, headId } = {}) => {
  const row = await Department.findById(id);
  if (!row) {
    const err = new Error('Department not found');
    err.statusCode = 404;
    throw err;
  }
  if (name !== undefined) row.name = String(name).trim();
  if (headId !== undefined) row.head = headId || null;
  await row.save();
  return exports.fetchDepartmentDetails(id);
};

exports.deleteDepartment = async (id) => {
  const row = await Department.findByIdAndDelete(id);
  if (!row) {
    const err = new Error('Department not found');
    err.statusCode = 404;
    throw err;
  }
  return { deleted: true, id: String(row._id) };
};

exports.assignStaffToDepartment = async (id, { staffIds } = {}) => {
  const row = await Department.findById(id);
  if (!row) {
    const err = new Error('Department not found');
    err.statusCode = 404;
    throw err;
  }
  const ids = Array.isArray(staffIds) ? Array.from(new Set(staffIds.filter(Boolean).map(String))) : [];
  const staffRows = ids.length ? await Staff.find({ _id: { $in: ids } }).lean() : [];
  row.staff = staffRows.map((s) => s._id);
  await row.save();

  // Keep staff.department in sync
  await Staff.updateMany({ _id: { $in: staffRows.map((s) => s._id) } }, { $set: { department: row.name } });
  return exports.fetchDepartmentDetails(id);
};

exports.fetchStaffForAssignment = async () => {
  await ensureData();
  const rows = await Staff.find({ status: 'Active' }).sort({ name: 1 }).lean();
  return rows.map((s) => ({
    id: String(s._id),
    name: s.name || '',
    role: s.role || '',
    roleType: s.roleType || '',
    department: s.department || '',
  }));
};

