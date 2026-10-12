const mongoose = require('mongoose');
const Student = require('../models/Student');
const ClassModel = require('../models/Class');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function escRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPublicStudent(s) {
  const obj = s.toObject ? s.toObject({ virtuals: false }) : s;
  return {
    id: String(obj._id),
    enrollmentId: obj.enrollmentId || '',
    name: obj.name,
    email: obj.email || '',
    phone: obj.phone || '',
    dob: obj.dob || null,
    gender: obj.gender || '',
    assignedClass: obj.assignedClass || '',
    assignedSection: obj.assignedSection || '',
    status: obj.status || 'Active',
    photoUrl: obj.photoUrl || '',
    address: obj.address || {},
    guardian: obj.guardian || {},
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

function resolveQuery(idOrEnrollmentId) {
  if (mongoose.Types.ObjectId.isValid(idOrEnrollmentId)) {
    return { _id: idOrEnrollmentId };
  }
  return { enrollmentId: idOrEnrollmentId };
}

exports.fetchStudents = async ({ search, assignedClass, assignedSection, status } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const query = {};
  if (assignedClass) query.assignedClass = assignedClass;
  if (assignedSection) query.assignedSection = assignedSection;
  if (status && ['Active', 'Pending', 'Inactive'].includes(status)) query.status = status;

  let rows = await Student.find(query).sort({ createdAt: -1 }).lean();

  if (search) {
    const re = new RegExp(escRe(String(search).trim()), 'i');
    rows = rows.filter(
      (r) => re.test(r.name || '') || re.test(r.enrollmentId || '') || re.test(r.email || '') || re.test(String(r._id))
    );
  }

  return rows.map((r) => toPublicStudent(r));
};

exports.fetchStudentProfile = async (id) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const s = await Student.findOne(resolveQuery(id));
  if (!s) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  return toPublicStudent(s);
};

exports.fetchFilters = async () => {
  const classes = await ClassModel.find({}).sort({ name: 1 }).lean();
  const classNames = classes.map((c) => c.name);
  const sectionSet = new Set();
  classes.forEach((c) => (c.sections || []).forEach((s) => sectionSet.add(s)));
  const sections = Array.from(sectionSet.values()).sort();
  return { classes: classNames, sections };
};

exports.exportDirectoryCsv = async (filters = {}) => {
  const rows = await exports.fetchStudents(filters);
  const header = ["EnrollmentID", "Name", "Email", "Phone", "Class", "Section", "Status", "CreatedAt"];
  const lines = [header.join(",")];
  for (const r of rows) {
    const vals = [
      r.enrollmentId,
      r.name,
      r.email,
      r.phone,
      r.assignedClass,
      r.assignedSection,
      r.status,
      r.createdAt ? new Date(r.createdAt).toISOString() : "",
    ].map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`);
    lines.push(vals.join(","));
  }
  return lines.join("\n");
};

