const mongoose = require('mongoose');
const Applicant = require('../models/Applicant');
const Application = require('../models/Application');
const Document = require('../models/Document');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

exports.fetchSummary = async ({ from, to } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const range = {};
  if (from || to) {
    range.submittedAt = {};
    if (from) range.submittedAt.$gte = new Date(from);
    if (to) range.submittedAt.$lte = new Date(to);
  }

  const total = await Application.countDocuments(range);
  const byStatusAgg = await Application.aggregate([
    { $match: range },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const byStatus = { Pending: 0, Approved: 0, Rejected: 0 };
  byStatusAgg.forEach((row) => {
    byStatus[row._id] = row.count;
  });

  const recent = await Application.find(range)
    .sort({ submittedAt: -1 })
    .limit(6)
    .populate('applicant')
    .lean();

  const recentApplications = recent.map((a) => ({
    id: String(a._id),
    applicantName: a.applicant?.name || 'Unknown',
    program: a.program,
    status: a.status,
    submittedAt: a.submittedAt,
  }));

  // simple trends: applications per day (last 14 days)
  const since = new Date();
  since.setDate(since.getDate() - 13);

  const trendsAgg = await Application.aggregate([
    { $match: { submittedAt: { $gte: since } } },
    {
      $group: {
        _id: {
          y: { $year: '$submittedAt' },
          m: { $month: '$submittedAt' },
          d: { $dayOfMonth: '$submittedAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
  ]);

  const trends = trendsAgg.map((t) => ({
    date: new Date(t._id.y, t._id.m - 1, t._id.d),
    count: t.count,
  }));

  // notifications: pending approvals
  const pendingCount = byStatus.Pending;
  const notifications = [];
  if (pendingCount > 0) {
    notifications.push({
      id: 'pending-approvals',
      type: 'alert',
      title: 'Pending approvals',
      message: `${pendingCount} application${pendingCount === 1 ? '' : 's'} awaiting decision.`,
    });
  }

  return {
    total,
    byStatus,
    recentApplications,
    trends,
    notifications,
  };
};

exports.createApplication = async ({ name, email, phone, program }) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  if (!name || !email || !program) {
    const err = new Error('Name, email and program are required');
    err.statusCode = 400;
    throw err;
  }

  const applicant = await Applicant.create({
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone || '').trim(),
  });

  const app = await Application.create({
    applicant: applicant._id,
    program: String(program).trim(),
    status: 'Pending',
  });

  // Create required document placeholders for verification workflow
  await Document.insertMany(
    [
      { application: app._id, type: 'ID Proof' },
      { application: app._id, type: 'Birth Certificate' },
      { application: app._id, type: 'Previous Marksheet' },
    ],
    { ordered: false }
  ).catch(() => {});

  return {
    id: String(app._id),
    applicantName: applicant.name,
    program: app.program,
    status: app.status,
    submittedAt: app.submittedAt || app.createdAt,
  };
};

exports.updateApplicationStatus = async (id, status) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const allowed = ['Pending', 'Approved', 'Rejected'];
  if (!allowed.includes(status)) {
    const err = new Error('Invalid status');
    err.statusCode = 400;
    throw err;
  }

  const updated = await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate('applicant');

  if (!updated) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }

  return {
    id: String(updated._id),
    applicantName: updated.applicant?.name || 'Unknown',
    program: updated.program,
    status: updated.status,
    submittedAt: updated.submittedAt || updated.createdAt,
  };
};


