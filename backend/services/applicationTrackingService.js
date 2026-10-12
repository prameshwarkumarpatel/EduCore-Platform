const mongoose = require('mongoose');
const Application = require('../models/Application');
const Applicant = require('../models/Applicant');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function toPublicApplication(doc) {
  const obj = doc.toObject ? doc.toObject({ virtuals: false }) : doc;
  const { _id, __v, applicant, ...rest } = obj;
  return {
    id: String(_id),
    applicantName: applicant?.name || 'Unknown',
    applicantEmail: applicant?.email || '',
    program: rest.program,
    status: rest.status,
    submittedAt: rest.submittedAt || rest.createdAt,
  };
}

exports.fetchApplications = async ({ search, status, from, to, sort } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const query = {};
  if (status && ['Pending', 'Approved', 'Rejected'].includes(status)) {
    query.status = status;
  }
  if (from || to) {
    query.submittedAt = {};
    if (from) query.submittedAt.$gte = new Date(from);
    if (to) query.submittedAt.$lte = new Date(to);
  }

  // basic search on applicant name/email or program
  let appDocs;
  if (search) {
    const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const applicants = await Applicant.find({ $or: [{ name: re }, { email: re }] }).select('_id').lean();
    const ids = applicants.map((a) => a._id);
    query.$or = [{ program: re }, { applicant: { $in: ids } }];
  }

  const sortOpt = {};
  if (sort === 'date-asc') sortOpt.submittedAt = 1;
  else if (sort === 'status') sortOpt.status = 1;
  else sortOpt.submittedAt = -1;

  appDocs = await Application.find(query).sort(sortOpt).populate('applicant').lean();
  return appDocs.map((d) => toPublicApplication(d));
};

exports.fetchApplicationDetails = async (id) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const doc = await Application.findById(id).populate('applicant').lean();
  if (!doc) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }
  return toPublicApplication(doc);
};

