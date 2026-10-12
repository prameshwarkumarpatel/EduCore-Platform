const mongoose = require('mongoose');
const Student = require('../models/Student');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function resolveQuery(idOrEnrollmentId) {
  if (mongoose.Types.ObjectId.isValid(idOrEnrollmentId)) {
    return { _id: idOrEnrollmentId };
  }
  return { enrollmentId: idOrEnrollmentId };
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
    extracurricular: obj.extracurricular || {},
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

exports.fetchProfile = async (id) => {
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

exports.updateProfile = async (id, payload = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const normalized = { ...payload };
  if (normalized.dob) {
    const d = new Date(normalized.dob);
    normalized.dob = Number.isNaN(d.getTime()) ? undefined : d;
  }
  const updated = await Student.findOneAndUpdate(resolveQuery(id), { $set: normalized }, { new: true });
  if (!updated) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  return toPublic(updated);
};

exports.uploadPhoto = async (id, dataUrl) => {
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
