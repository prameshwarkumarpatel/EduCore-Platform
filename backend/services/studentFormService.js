const mongoose = require('mongoose');
const crypto = require('crypto');
const Student = require('../models/Student');
const ClassModel = require('../models/Class');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function resolveQuery(idOrEnrollmentId) {
  if (mongoose.Types.ObjectId.isValid(idOrEnrollmentId)) {
    return { _id: idOrEnrollmentId };
  }
  return { enrollmentId: idOrEnrollmentId };
}

function escRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function generateEnrollmentId() {
  let id = `STU-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  // eslint-disable-next-line no-constant-condition
  while (await Student.exists({ enrollmentId: id })) {
    id = `STU-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }
  return id;
}

function normalizePayload(payload = {}) {
  const out = { ...payload };
  if (out.dob) {
    const d = new Date(out.dob);
    out.dob = Number.isNaN(d.getTime()) ? undefined : d;
  }
  return out;
}

function validate(payload = {}, { mode } = {}) {
  const errors = {};
  if (!payload.name || !String(payload.name).trim()) errors.name = 'Name is required';
  if (mode === 'confirm') {
    if (!payload.assignedClass) errors.assignedClass = 'Grade/Class is required';
    if (!payload.assignedSection) errors.assignedSection = 'Section is required';
  }
  return errors;
}

function toPublic(s) {
  const obj = s.toObject ? s.toObject({ virtuals: false }) : s;
  return {
    id: String(obj._id),
    enrollmentId: obj.enrollmentId || '',
    name: obj.name,
    dob: obj.dob || null,
    gender: obj.gender || '',
    email: obj.email || '',
    phone: obj.phone || '',
    address: obj.address || {},
    guardian: obj.guardian || {},
    assignedClass: obj.assignedClass || '',
    assignedSection: obj.assignedSection || '',
    status: obj.status || 'Active',
    photoUrl: obj.photoUrl || '',
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

exports.fetchClasses = async () => {
  const list = await ClassModel.find({}).sort({ name: 1 }).lean();
  return list.map((c) => ({ id: String(c._id), name: c.name, sections: c.sections || [] }));
};

exports.fetchStudentDetails = async (id) => {
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
  return toPublic(s);
};

exports.createStudent = async ({ payload, mode } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const normalized = normalizePayload(payload || {});
  const errors = validate(normalized, { mode });
  if (Object.keys(errors).length) {
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.details = errors;
    throw err;
  }

  const enrollmentId = normalized.enrollmentId || (await generateEnrollmentId());
  const status = mode === 'draft' ? 'Pending' : (normalized.status || 'Active');

  const created = await Student.create({
    ...normalized,
    enrollmentId,
    status: mode === 'confirm' ? 'Active' : status,
  });
  return toPublic(created);
};

exports.updateStudent = async (id, { payload, mode } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const normalized = normalizePayload(payload || {});
  const errors = validate(normalized, { mode });
  if (Object.keys(errors).length) {
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.details = errors;
    throw err;
  }

  if (mode === 'draft') normalized.status = 'Pending';
  if (mode === 'confirm') normalized.status = 'Active';

  const updated = await Student.findOneAndUpdate(resolveQuery(id), { $set: normalized }, { new: true });
  if (!updated) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  return toPublic(updated);
};

exports.uploadProfilePhoto = async (id, { dataUrl } = {}) => {
  if (!dataUrl || typeof dataUrl !== 'string') {
    const err = new Error('dataUrl is required');
    err.statusCode = 400;
    throw err;
  }
  if (dataUrl.length > 2_000_000) {
    const err = new Error('Image too large');
    err.statusCode = 413;
    throw err;
  }
  const updated = await Student.findOneAndUpdate(resolveQuery(id), { $set: { photoUrl: dataUrl } }, { new: true });
  if (!updated) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  return toPublic(updated);
};

exports.validateStudentForm = async ({ payload, mode } = {}) => {
  const normalized = normalizePayload(payload || {});
  const errors = validate(normalized, { mode });
  return { ok: Object.keys(errors).length === 0, errors };
};

