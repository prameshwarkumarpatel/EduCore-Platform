const mongoose = require('mongoose');
const Document = require('../models/Document');
const Verification = require('../models/Verification');
const Application = require('../models/Application');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPublicDoc(doc) {
  const obj = doc.toObject ? doc.toObject({ virtuals: false }) : doc;
  const { _id, __v, application, ...rest } = obj;

  const applicantName = application?.applicant?.name || 'Unknown';
  const program = application?.program || '';
  const applicationId = application?._id ? String(application._id) : '';

  return {
    id: String(_id),
    applicationId,
    applicantName,
    program,
    type: rest.type,
    fileName: rest.fileName,
    fileUrl: rest.fileUrl,
    uploadedAt: rest.uploadedAt || rest.createdAt,
    verificationStatus: rest.verificationStatus,
    remarks: rest.remarks,
    verifiedAt: rest.verifiedAt,
  };
}

async function ensurePlaceholdersForExistingApplications() {
  // Backfill for applications created before document placeholders existed.
  const existingCount = await Document.estimatedDocumentCount();
  if (existingCount > 0) return;

  const apps = await Application.find({}).select('_id').limit(200).lean();
  if (!apps.length) return;

  const docs = [];
  for (const app of apps) {
    docs.push(
      { application: app._id, type: 'ID Proof' },
      { application: app._id, type: 'Birth Certificate' },
      { application: app._id, type: 'Previous Marksheet' }
    );
  }
  await Document.insertMany(docs, { ordered: false }).catch(() => {});
}

exports.fetchDocuments = async ({ search, status, type } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  await ensurePlaceholdersForExistingApplications();

  const query = {};
  if (status && ['Pending', 'Verified', 'Rejected'].includes(status)) query.verificationStatus = status;
  if (type) query.type = type;

  const docs = await Document.find(query)
    .sort({ uploadedAt: -1 })
    .populate({
      path: 'application',
      populate: { path: 'applicant' },
    });

  let list = docs.map(toPublicDoc);

  if (search) {
    const re = new RegExp(escapeRegex(search.trim()), 'i');
    list = list.filter(
      (d) =>
        re.test(d.applicantName) ||
        re.test(d.type) ||
        re.test(d.program) ||
        re.test(d.applicationId)
    );
  }

  return list;
};

exports.fetchDocumentDetails = async (id) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const doc = await Document.findById(id).populate({
    path: 'application',
    populate: { path: 'applicant' },
  });
  if (!doc) {
    const err = new Error('Document not found');
    err.statusCode = 404;
    throw err;
  }

  const history = await Verification.find({ document: id }).sort({ createdAt: -1 }).lean();
  return { ...toPublicDoc(doc), history };
};

exports.setStatus = async (id, status, remarks = '') => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  if (!['Pending', 'Verified', 'Rejected'].includes(status)) {
    const err = new Error('Invalid verification status');
    err.statusCode = 400;
    throw err;
  }

  const update = {
    verificationStatus: status,
    remarks: String(remarks || ''),
    verifiedAt: status === 'Pending' ? null : new Date(),
  };

  const updated = await Document.findByIdAndUpdate(id, update, { new: true }).populate({
    path: 'application',
    populate: { path: 'applicant' },
  });

  if (!updated) {
    const err = new Error('Document not found');
    err.statusCode = 404;
    throw err;
  }

  await Verification.create({ document: id, status, remarks: String(remarks || '') }).catch(() => {});
  return toPublicDoc(updated);
};

exports.addRemarks = async (id, remarks) => {
  const doc = await Document.findById(id).populate({
    path: 'application',
    populate: { path: 'applicant' },
  });
  if (!doc) {
    const err = new Error('Document not found');
    err.statusCode = 404;
    throw err;
  }
  doc.remarks = String(remarks || '');
  await doc.save();
  await Verification.create({ document: id, status: doc.verificationStatus, remarks: doc.remarks }).catch(() => {});
  return toPublicDoc(doc);
};

exports.fetchPendingAlerts = async () => {
  await ensurePlaceholdersForExistingApplications();
  const pending = await Document.find({ verificationStatus: 'Pending' })
    .sort({ uploadedAt: -1 })
    .limit(6)
    .populate({ path: 'application', populate: { path: 'applicant' } });
  return pending.map(toPublicDoc);
};

