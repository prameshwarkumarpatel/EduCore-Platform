const Staff = require('../models/staffModel');
const staffService = require('./staffService');

function escRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPublic(row) {
  return {
    id: String(row._id),
    name: row.name || '',
    roleType: row.roleType || 'Teacher',
    department: row.department || '',
    email: row.email || '',
    phone: row.phone || '',
    status: row.status || 'Active',
    assignedClasses: row.assignedClasses || [],
    assignedSubjects: row.assignedSubjects || [],
    createdAt: row.createdAt,
  };
}

async function ensureData() {
  await staffService.fetchStaffStats();
}

exports.fetchStaffList = async ({ search, roleType, department, status } = {}) => {
  await ensureData();
  const q = {};
  if (roleType && ['Teacher', 'NonTeaching'].includes(roleType)) q.roleType = roleType;
  if (department) q.department = department;
  if (status && ['Active', 'Inactive'].includes(status)) q.status = status;
  let rows = await Staff.find(q).sort({ name: 1 }).lean();
  if (search) {
    const re = new RegExp(escRe(String(search).trim()), 'i');
    rows = rows.filter((r) => re.test(r.name || '') || re.test(r.email || '') || re.test(r.phone || ''));
  }
  return rows.map(toPublic);
};

exports.fetchStaffDetails = async (id) => {
  await ensureData();
  const row = await Staff.findById(id).lean();
  if (!row) {
    const err = new Error('Staff not found');
    err.statusCode = 404;
    throw err;
  }
  return toPublic(row);
};

exports.searchStaff = async ({ query }) => {
  return exports.fetchStaffList({ search: query });
};

exports.updateStaff = async (id, payload = {}) => {
  const row = await Staff.findById(id);
  if (!row) {
    const err = new Error('Staff not found');
    err.statusCode = 404;
    throw err;
  }
  const allowed = ['name', 'roleType', 'department', 'email', 'phone', 'status', 'assignedClasses', 'assignedSubjects'];
  for (const k of allowed) {
    if (payload[k] !== undefined) row[k] = payload[k];
  }
  await row.save();
  return toPublic(row.toObject());
};

exports.deleteStaff = async (id) => {
  const row = await Staff.findByIdAndDelete(id);
  if (!row) {
    const err = new Error('Staff not found');
    err.statusCode = 404;
    throw err;
  }
  return { deleted: true, id: String(row._id) };
};

exports.exportStaffData = async (filters = {}) => {
  const rows = await exports.fetchStaffList(filters);
  const header = ['ID', 'Name', 'RoleType', 'Department', 'Email', 'Phone', 'Status', 'CreatedAt'];
  const lines = [header.join(',')];
  for (const r of rows) {
    const vals = [r.id, r.name, r.roleType, r.department, r.email, r.phone, r.status, r.createdAt ? new Date(r.createdAt).toISOString() : '']
      .map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`);
    lines.push(vals.join(','));
  }
  return lines.join('\n');
};

