const mongoose = require('mongoose');
const Parent = require('../models/parentModel');
const Student = require('../models/Student');
const ParentCommunication = require('../models/communicationModel');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function assertDbConnected() {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
}

function parseDateOrUndef(value) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseToOrUndef(value) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  d.setHours(23, 59, 59, 999);
  return d;
}

async function seedIfEmpty() {
  assertDbConnected();

  const existing = await ParentCommunication.countDocuments({});
  if (existing > 0) return;

  const parents = await Parent.find({}).select('_id name relationship').lean();
  if (!parents.length) return;

  const students = await Student.find({ status: 'Active' })
    .select('_id name enrollmentId assignedClass assignedSection guardian')
    .limit(30)
    .lean();
  if (!students.length) return;

  const channels = ['SMS', 'Email', 'Push', 'Call'];
  const types = ['Message', 'Call', 'Update'];
  const directions = ['Outgoing', 'Incoming'];
  const statuses = ['Pending', 'Sent', 'Failed'];
  const severities = ['low', 'medium', 'high'];
  const messages = [
    'Thanks for updating us.',
    'Reminder: upcoming event.',
    'Update requested for profile details.',
    'Concern raised by teacher.',
    'Leave approval confirmation sent.',
    'Follow up regarding attendance.',
  ];

  const docs = [];
  for (const p of parents.slice(0, 25)) {
    const count = 4;
    for (let i = 0; i < count; i += 1) {
      const st = types[Math.floor(Math.random() * types.length)];
      const ch = channels[Math.floor(Math.random() * channels.length)];
      docs.push({
        parent: p._id,
        student: students[Math.floor(Math.random() * students.length)]._id,
        channel: ch,
        type: st,
        direction: directions[Math.floor(Math.random() * directions.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        meta: { seeded: true },
        sentAt: Math.random() > 0.6 ? new Date(Date.now() - Math.floor(Math.random() * 6) * 60 * 60 * 1000) : undefined,
      });
    }
  }

  await ParentCommunication.insertMany(docs, { ordered: false }).catch(() => {});
}

function buildDateFilter({ from, to }) {
  const gte = parseDateOrUndef(from);
  const lte = parseToOrUndef(to);
  const out = {};
  if (gte) out.$gte = gte;
  if (lte) out.$lte = lte;
  return Object.keys(out).length ? out : undefined;
}

function mapOutDoc(doc) {
  return {
    id: String(doc._id),
    parent: doc.parent ? String(doc.parent) : undefined,
    student: doc.student ? String(doc.student) : undefined,
    channel: doc.channel,
    type: doc.type,
    direction: doc.direction,
    message: doc.message,
    status: doc.status,
    severity: doc.severity,
    sentAt: doc.sentAt,
    createdAt: doc.createdAt,
    meta: doc.meta || {},
  };
}

exports.fetchMessages = async (parentId, { channel, from, to } = {}) => {
  assertDbConnected();
  await seedIfEmpty();

  const q = { parent: parentId, type: 'Message' };
  if (channel) q.channel = channel;

  const dateFilter = buildDateFilter({ from, to });
  if (dateFilter) q.createdAt = dateFilter;

  const rows = await ParentCommunication.find(q).sort({ createdAt: -1 }).lean();
  return rows.map(mapOutDoc);
};

exports.fetchCalls = async (parentId, { from, to, status } = {}) => {
  assertDbConnected();
  await seedIfEmpty();

  const q = { parent: parentId, type: 'Call' };
  if (status) q.status = status;

  const dateFilter = buildDateFilter({ from, to });
  if (dateFilter) q.createdAt = dateFilter;

  const rows = await ParentCommunication.find(q).sort({ createdAt: -1 }).lean();
  return rows.map(mapOutDoc);
};

exports.fetchNotifications = async (parentId, { from, to, severity } = {}) => {
  assertDbConnected();
  await seedIfEmpty();

  const q = { parent: parentId, type: 'Update' };
  if (severity) q.severity = severity;

  const dateFilter = buildDateFilter({ from, to });
  if (dateFilter) q.createdAt = dateFilter;

  const rows = await ParentCommunication.find(q).sort({ createdAt: -1 }).lean();
  return rows.map(mapOutDoc);
};

exports.sendMessageToParent = async (parentId, { channel, message, severity = 'low' } = {}) => {
  assertDbConnected();
  await seedIfEmpty();

  if (!message || !String(message).trim()) {
    const err = new Error('Message is required');
    err.statusCode = 400;
    throw err;
  }

  const channelAllowed = ['SMS', 'Email', 'Push'];
  const ch = channelAllowed.includes(channel) ? channel : 'SMS';

  const doc = await ParentCommunication.create({
    parent: parentId,
    channel: ch,
    type: 'Message',
    direction: 'Outgoing',
    message: String(message).trim(),
    status: 'Sent',
    severity,
    sentAt: new Date(),
    meta: { createdBy: 'frontend', kind: 'manual-send' },
  });

  return mapOutDoc(doc);
};

exports.broadcastMessage = async ({ parentIds, channel, message, severity = 'low' } = {}) => {
  assertDbConnected();
  await seedIfEmpty();

  if (!Array.isArray(parentIds) || !parentIds.length) {
    const err = new Error('At least one recipient parentId is required');
    err.statusCode = 400;
    throw err;
  }
  if (!message || !String(message).trim()) {
    const err = new Error('Message is required');
    err.statusCode = 400;
    throw err;
  }

  const channelAllowed = ['SMS', 'Email', 'Push'];
  const ch = channelAllowed.includes(channel) ? channel : 'SMS';

  const docs = parentIds.map((pid) => ({
    parent: pid,
    channel: ch,
    type: 'Message',
    direction: 'Outgoing',
    message: String(message).trim(),
    status: 'Sent',
    severity,
    sentAt: new Date(),
    meta: { createdBy: 'frontend', kind: 'broadcast' },
  }));

  const inserted = await ParentCommunication.insertMany(docs, { ordered: false }).catch(() => []);
  return Array.isArray(inserted) ? inserted.map(mapOutDoc) : [];
};

