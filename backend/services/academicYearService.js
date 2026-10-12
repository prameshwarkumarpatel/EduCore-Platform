const mongoose = require('mongoose');
const AcademicYear = require('../models/AcademicYear');
const Semester = require('../models/Semester');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function toPublicYear(doc, semesters = []) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject({ virtuals: false }) : doc;
  const { _id, __v, ...rest } = obj;
  return {
    id: String(_id),
    ...rest,
    semesters: semesters.map((s) => {
      const { _id: sid, __v: _v, academicYear, ...restSem } = s.toObject ? s.toObject({ virtuals: false }) : s;
      return { id: String(sid), ...restSem };
    }),
  };
}

exports.listAcademicYears = async ({ search } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const query = {};
  if (search) {
    const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.year = re;
  }

  const docs = await AcademicYear.find(query).sort({ startDate: -1 }).lean();
  return docs.map((d) => {
    const { _id, __v, ...rest } = d;
    return { id: String(_id), ...rest };
  });
};

exports.getAcademicYearById = async (id) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const yearDoc = await AcademicYear.findById(id);
  if (!yearDoc) {
    const err = new Error('Academic year not found');
    err.statusCode = 404;
    throw err;
  }
  const sems = await Semester.find({ academicYear: id }).sort({ order: 1, startDate: 1 });
  return toPublicYear(yearDoc, sems);
};

exports.createAcademicYear = async (payload = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const year = String(payload.year || '').trim();
  const startDate = payload.startDate ? new Date(payload.startDate) : null;
  const endDate = payload.endDate ? new Date(payload.endDate) : null;

  if (!year || !startDate || !endDate) {
    const err = new Error('Year, start date, and end date are required');
    err.statusCode = 400;
    throw err;
  }
  if (startDate >= endDate) {
    const err = new Error('Start date must be before end date');
    err.statusCode = 400;
    throw err;
  }

  const exists = await AcademicYear.exists({ year });
  if (exists) {
    const err = new Error('Academic year already exists');
    err.statusCode = 409;
    throw err;
  }

  const yearDoc = await AcademicYear.create({
    year,
    startDate,
    endDate,
    status: 'Upcoming',
    isActive: Boolean(payload.isActive),
    metadata: { notes: payload.metadata?.notes || '' },
  });

  let sems = [];
  if (Array.isArray(payload.semesters) && payload.semesters.length) {
    const items = payload.semesters.map((s, idx) => ({
      academicYear: yearDoc._id,
      name: s.name || `Term ${idx + 1}`,
      startDate: s.startDate ? new Date(s.startDate) : startDate,
      endDate: s.endDate ? new Date(s.endDate) : endDate,
      order: s.order ?? idx + 1,
    }));
    sems = await Semester.insertMany(items);
  }

  return toPublicYear(yearDoc, sems);
};

exports.updateAcademicYear = async (id, payload = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const update = {};

  if (payload.year != null) {
    update.year = String(payload.year).trim();
  }
  if (payload.startDate != null) {
    update.startDate = new Date(payload.startDate);
  }
  if (payload.endDate != null) {
    update.endDate = new Date(payload.endDate);
  }
  if (payload.metadata != null) {
    update.metadata = { notes: payload.metadata.notes || '' };
  }

  if (update.year) {
    const dupe = await AcademicYear.exists({ _id: { $ne: id }, year: update.year });
    if (dupe) {
      const err = new Error('Academic year already exists');
      err.statusCode = 409;
      throw err;
    }
  }

  const doc = await AcademicYear.findById(id);
  if (!doc) {
    const err = new Error('Academic year not found');
    err.statusCode = 404;
    throw err;
  }

  if (update.startDate && update.endDate && update.startDate >= update.endDate) {
    const err = new Error('Start date must be before end date');
    err.statusCode = 400;
    throw err;
  }

  Object.assign(doc, update);
  await doc.save();
  const sems = await Semester.find({ academicYear: id }).sort({ order: 1, startDate: 1 });
  return toPublicYear(doc, sems);
};

exports.configureSemesters = async (id, semesters = []) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const yearDoc = await AcademicYear.findById(id);
  if (!yearDoc) {
    const err = new Error('Academic year not found');
    err.statusCode = 404;
    throw err;
  }

  await Semester.deleteMany({ academicYear: id });

  const items = (semesters || []).map((s, idx) => ({
    academicYear: id,
    name: s.name || `Term ${idx + 1}`,
    startDate: s.startDate ? new Date(s.startDate) : yearDoc.startDate,
    endDate: s.endDate ? new Date(s.endDate) : yearDoc.endDate,
    order: s.order ?? idx + 1,
  }));
  const sems = items.length ? await Semester.insertMany(items) : [];
  return toPublicYear(yearDoc, sems);
};

exports.deleteAcademicYear = async (id) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const deleted = await AcademicYear.findByIdAndDelete(id);
  if (!deleted) {
    const err = new Error('Academic year not found');
    err.statusCode = 404;
    throw err;
  }
  await Semester.deleteMany({ academicYear: id }).catch(() => {});
  return { success: true };
};

exports.toggleAcademicYearStatus = async (id, isActive) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  if (isActive) {
    await AcademicYear.updateMany({}, { isActive: false });
  }

  const updated = await AcademicYear.findByIdAndUpdate(
    id,
    { isActive: Boolean(isActive), status: isActive ? 'Ongoing' : 'Completed' },
    { new: true }
  );
  if (!updated) {
    const err = new Error('Academic year not found');
    err.statusCode = 404;
    throw err;
  }
  const sems = await Semester.find({ academicYear: id }).sort({ order: 1, startDate: 1 });
  return toPublicYear(updated, sems);
};

