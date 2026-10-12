const mongoose = require('mongoose');
const crypto = require('crypto');
const Application = require('../models/Application');
const ClassModel = require('../models/Class');
const ApprovalHistory = require('../models/ApprovalHistory');
const Document = require('../models/Document');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

async function ensureSeedClasses() {
  const count = await ClassModel.countDocuments({});
  if (count > 0) return;
  await ClassModel.insertMany(
    [
      { name: 'Grade 1', sections: ['A', 'B'] },
      { name: 'Grade 2', sections: ['A', 'B'] },
      { name: 'Grade 3', sections: ['A', 'B'] },
      { name: 'Grade 4', sections: ['A', 'B'] },
      { name: 'Grade 5', sections: ['A', 'B'] },
      { name: 'Grade 6', sections: ['A', 'B', 'C'] },
      { name: 'Grade 7', sections: ['A', 'B', 'C'] },
      { name: 'Grade 8', sections: ['A', 'B', 'C'] },
      { name: 'Grade 9', sections: ['A', 'B'] },
      { name: 'Grade 10', sections: ['A', 'B'] },
    ],
    { ordered: false }
  ).catch(() => {});
}

function toPublicApp(app, docsSummary) {
  const obj = app.toObject ? app.toObject({ virtuals: false }) : app;
  const { _id, __v, applicant, ...rest } = obj;
  return {
    id: String(_id),
    applicantName: applicant?.name || 'Unknown',
    applicantEmail: applicant?.email || '',
    applicantPhone: applicant?.phone || '',
    program: rest.program,
    status: rest.status,
    submittedAt: rest.submittedAt || rest.createdAt,
    assignedClass: rest.assignedClass || '',
    assignedSection: rest.assignedSection || '',
    confirmationCode: rest.confirmationCode || '',
    docsSummary,
  };
}

async function getDocsSummary(applicationId) {
  const docs = await Document.find({ application: applicationId }).lean();
  const total = docs.length;
  const verified = docs.filter((d) => d.verificationStatus === 'Verified').length;
  const rejected = docs.filter((d) => d.verificationStatus === 'Rejected').length;
  const pending = docs.filter((d) => d.verificationStatus === 'Pending').length;
  return { total, verified, rejected, pending };
}

exports.fetchApprovalQueue = async ({ search, status } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const query = {};
  // If status is provided, filter by it; otherwise show full queue across statuses.
  if (status && ['Pending', 'Approved', 'Rejected'].includes(status)) query.status = status;

  // Search is handled via applicant populate + filtering after
  const apps = await Application.find(query).sort({ submittedAt: -1 }).populate('applicant').lean();
  let list = apps;
  if (search) {
    const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    list = list.filter((a) => re.test(a.applicant?.name || '') || re.test(a.program || '') || re.test(String(a._id)));
  }

  // attach docs summary (lightweight)
  const out = [];
  for (const a of list.slice(0, 200)) {
    const docsSummary = await getDocsSummary(a._id);
    out.push(
      toPublicApp({ ...a, applicant: a.applicant }, docsSummary)
    );
  }
  return out;
};

exports.fetchApplicationReview = async (id) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const app = await Application.findById(id).populate('applicant');
  if (!app) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }
  const docsSummary = await getDocsSummary(id);
  const docs = await Document.find({ application: id }).sort({ uploadedAt: -1 }).lean();
  return { ...toPublicApp(app, docsSummary), documents: docs };
};

exports.fetchClasses = async () => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  await ensureSeedClasses();
  const list = await ClassModel.find({}).sort({ name: 1 }).lean();
  return list.map((c) => ({ id: String(c._id), name: c.name, sections: c.sections || [] }));
};

exports.assignClassSection = async (id, { assignedClass, assignedSection }) => {
  if (!assignedClass || !assignedSection) {
    const err = new Error('Class and section are required');
    err.statusCode = 400;
    throw err;
  }
  const updated = await Application.findByIdAndUpdate(
    id,
    { assignedClass, assignedSection },
    { new: true }
  ).populate('applicant');
  if (!updated) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }
  await ApprovalHistory.create({
    application: id,
    action: 'ASSIGN',
    status: updated.status,
    meta: { assignedClass, assignedSection },
  }).catch(() => {});
  return toPublicApp(updated, await getDocsSummary(id));
};

exports.approveApplication = async (id, { remarks } = {}) => {
  const app = await Application.findById(id).populate('applicant');
  if (!app) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }
  if (!app.assignedClass || !app.assignedSection) {
    const err = new Error('Assign class and section before approval');
    err.statusCode = 400;
    throw err;
  }
  app.status = 'Approved';
  app.decisionAt = new Date();
  await app.save();
  await ApprovalHistory.create({ application: id, action: 'APPROVE', status: 'Approved', remarks: remarks || '' }).catch(() => {});
  return toPublicApp(app, await getDocsSummary(id));
};

exports.rejectApplication = async (id, { remarks } = {}) => {
  const app = await Application.findById(id).populate('applicant');
  if (!app) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }
  app.status = 'Rejected';
  app.decisionAt = new Date();
  await app.save();
  await ApprovalHistory.create({ application: id, action: 'REJECT', status: 'Rejected', remarks: remarks || '' }).catch(() => {});
  return toPublicApp(app, await getDocsSummary(id));
};

exports.generateConfirmation = async (id) => {
  const app = await Application.findById(id).populate('applicant');
  if (!app) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }
  if (app.status !== 'Approved') {
    const err = new Error('Only approved applications can generate confirmation');
    err.statusCode = 400;
    throw err;
  }
  if (!app.confirmationCode) {
    app.confirmationCode = `ADM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    await app.save();
  }
  const confirmation = {
    confirmationCode: app.confirmationCode,
    applicantName: app.applicant?.name || 'Unknown',
    program: app.program,
    assignedClass: app.assignedClass,
    assignedSection: app.assignedSection,
    issuedAt: new Date().toISOString(),
  };
  await ApprovalHistory.create({ application: id, action: 'CONFIRM', status: app.status, meta: confirmation }).catch(() => {});
  return confirmation;
};

exports.sendNotification = async (id, { channel, message } = {}) => {
  const app = await Application.findById(id).populate('applicant');
  if (!app) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }
  const payload = {
    channel: channel || 'Email',
    to: app.applicant?.email || '',
    message: message || '',
    sentAt: new Date().toISOString(),
  };
  await ApprovalHistory.create({ application: id, action: 'NOTIFY', status: app.status, meta: payload }).catch(() => {});
  return payload;
};

exports.fetchApprovalHistory = async (id) => {
  const rows = await ApprovalHistory.find({ application: id }).sort({ createdAt: -1 }).lean();
  return rows.map((r) => ({
    id: String(r._id),
    action: r.action,
    status: r.status,
    remarks: r.remarks,
    meta: r.meta,
    createdAt: r.createdAt,
  }));
};

