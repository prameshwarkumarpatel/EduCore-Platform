const mongoose = require('mongoose');
const Student = require('../models/Student');
const Parent = require('../models/parentModel');
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

async function ensureSeedDataIfEmpty() {
  assertDbConnected();
  const parentCount = await Parent.countDocuments({});
  if (parentCount > 0) return;

  const students = await Student.find({ status: 'Active' }).lean();
  if (!students.length) return;

  const parentMap = new Map(); // key -> parent doc

  for (const st of students) {
    const g = st.guardian || {};
    const name = (g.name || '').trim();
    const email = (g.email || '').trim();
    const phone = (g.phone || '').trim();
    const relationship = 'Guardian';

    if (!name && !email && !phone) continue;

    const key = email ? `e:${email.toLowerCase()}` : phone ? `p:${phone}` : `n:${name.toLowerCase()}`;

    if (!parentMap.has(key)) {
      parentMap.set(key, {
        name: name || 'Guardian',
        email,
        phone,
        relationship,
        students: [],
      });
    }

    parentMap.get(key).students.push(st._id);
  }

  const parentRows = Array.from(parentMap.values()).map((p) => ({
    ...p,
    students: Array.from(new Set(p.students.map(String))),
  }));

  // Mongoose expects ObjectIds; convert student ids back
  const createdParents = await Parent.insertMany(
    parentRows.map((p) => ({
      name: p.name,
      email: p.email,
      phone: p.phone,
      relationship: p.relationship,
      // In newer Mongoose versions ObjectId is a class (requires `new`)
      students: p.students.map((id) => new mongoose.Types.ObjectId(id)),
    })),
    { ordered: false }
  ).catch(() => []);

  const parentIds = (createdParents || []).map((p) => p._id).filter(Boolean);
  const insertedParents = parentIds.length ? parentIds : await Parent.find({}).select('_id').lean().then((r) => r.map((x) => x._id));

  if (!insertedParents.length) return;

  // Seed communications
  const studentSampleIds = students.slice(0, Math.min(30, students.length)).map((s) => s._id);
  const communications = [];
  const channels = ['SMS', 'Email', 'Push', 'Call'];
  const types = ['Message', 'Call', 'Update'];
  const severities = ['low', 'medium', 'high'];
  const statuses = ['Pending', 'Sent', 'Failed'];
  const messages = [
    'Follow up regarding attendance.',
    'Thanks for updating us.',
    'Reminder: upcoming event.',
    'Update requested for profile details.',
    'Concern raised by teacher.',
    'Leave approval confirmation sent.',
  ];

  for (let i = 0; i < insertedParents.length; i += 1) {
    const parentId = insertedParents[i];
    for (let j = 0; j < 4; j += 1) {
      const st = types[Math.floor(Math.random() * types.length)];
      const status = st === 'Update' ? (Math.random() > 0.55 ? 'Pending' : 'Sent') : statuses[Math.floor(Math.random() * statuses.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const channel = channels[Math.floor(Math.random() * channels.length)];
      const direction = Math.random() > 0.4 ? 'Outgoing' : 'Incoming';
      communications.push({
        parent: parentId,
        student: studentSampleIds[Math.floor(Math.random() * studentSampleIds.length)] || students[0]._id,
        channel,
        type: st,
        direction,
        message: messages[Math.floor(Math.random() * messages.length)],
        status,
        severity,
        meta: { seeded: true },
        sentAt: status === 'Sent' ? new Date(Date.now() - Math.floor(Math.random() * 60) * 60 * 1000) : undefined,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
      });
    }
  }

  await ParentCommunication.insertMany(communications, { ordered: false }).catch(() => {});
}

exports.fetchParentStats = async () => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const totalParents = await Parent.countDocuments({});
  const linkedStudentsCount = await Parent.aggregate([
    { $unwind: '$students' },
    { $group: { _id: null, total: { $addToSet: '$students' } } },
    { $project: { total: { $size: '$total' } } },
  ]).then((r) => r[0]?.total || 0);

  return { totalParents, linkedStudentsCount };
};

exports.fetchLinkedStudents = async () => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();

  const parents = await Parent.find({}).lean();
  if (!parents.length) return [];

  const allStudentIds = parents.flatMap((p) => p.students || []);
  const studentIdsSet = Array.from(new Set(allStudentIds.map(String)));
  const students = studentIdsSet.length
    ? await Student.find({ _id: { $in: studentIdsSet } }).select('name enrollmentId assignedClass assignedSection status').lean()
    : [];

  const byId = new Map(students.map((s) => [String(s._id), s]));

  return parents
    .map((p) => {
      const linked = (p.students || []).map((id) => byId.get(String(id))).filter(Boolean);
      const studentsCount = linked.length;
      return {
        id: String(p._id),
        name: p.name,
        email: p.email || '',
        phone: p.phone || '',
        relationship: p.relationship || 'Guardian',
        studentsCount,
        sampleStudents: linked.slice(0, 3).map((s) => ({
          id: String(s._id),
          enrollmentId: s.enrollmentId || '',
          name: s.name,
          assignedClass: s.assignedClass || '',
          assignedSection: s.assignedSection || '',
        })),
      };
    })
    .sort((a, b) => b.studentsCount - a.studentsCount);
};

exports.fetchRecentActivities = async () => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();

  const rows = await ParentCommunication.find({})
    .sort({ createdAt: -1 })
    .limit(12)
    .populate('parent')
    .populate('student')
    .lean();

  return rows.map((r) => ({
    id: String(r._id),
    type: r.type,
    channel: r.channel,
    direction: r.direction,
    status: r.status,
    message: r.message,
    severity: r.severity,
    sentAt: r.sentAt,
    createdAt: r.createdAt,
    parent: r.parent ? { id: String(r.parent._id), name: r.parent.name } : null,
    student: r.student
      ? { id: String(r.student._id), name: r.student.name, enrollmentId: r.student.enrollmentId || '' }
      : null,
  }));
};

exports.fetchCommunicationSummary = async () => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();

  const agg = await ParentCommunication.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        sent: { $sum: { $cond: [{ $eq: ['$status', 'Sent'] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] } },
      },
    },
  ]);

  const map = Object.fromEntries(agg.map((a) => [a._id, a]));
  return {
    messages: map.Message?.count || 0,
    calls: map.Call?.count || 0,
    updatesPending: await ParentCommunication.countDocuments({ type: 'Update', status: 'Pending' }),
    failed: Object.values(map).reduce((acc, v) => acc + (v?.failed || 0), 0),
  };
};

exports.fetchPendingRequests = async () => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();

  const rows = await ParentCommunication.find({ type: 'Update', status: 'Pending' })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('parent')
    .populate('student')
    .lean();

  return rows.map((r) => ({
    id: String(r._id),
    parent: r.parent ? { id: String(r.parent._id), name: r.parent.name } : null,
    student: r.student ? { id: String(r.student._id), name: r.student.name, enrollmentId: r.student.enrollmentId || '' } : null,
    channel: r.channel,
    severity: r.severity,
    message: r.message,
    createdAt: r.createdAt,
  }));
};

exports.fetchAlerts = async () => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();

  const rows = await ParentCommunication.find({ severity: { $in: ['high', 'medium'] } })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('parent')
    .populate('student')
    .lean();

  return rows.map((r) => ({
    id: String(r._id),
    severity: r.severity,
    status: r.status,
    message: r.message,
    parent: r.parent ? { id: String(r.parent._id), name: r.parent.name } : null,
    student: r.student
      ? { id: String(r.student._id), name: r.student.name, enrollmentId: r.student.enrollmentId || '' }
      : null,
    createdAt: r.createdAt,
  }));
};

exports.fetchParentsForDirectory = async ({ search, status } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();

  const query = {};
  if (status === 'Active') {
    query.$or = [{ status: 'Active' }, { status: { $exists: false } }];
  } else if (status === 'Inactive') {
    query.status = 'Inactive';
  }

  let rows = await Parent.find(query).sort({ name: 1 }).lean();
  if (!rows.length) return [];

  const allStudentIds = rows.flatMap((p) => p.students || []);
  const studentIdsSet = Array.from(new Set(allStudentIds.map(String)));
  const students =
    studentIdsSet.length
      ? await Student.find({ _id: { $in: studentIdsSet } }).select('name enrollmentId assignedClass assignedSection').lean()
      : [];
  const byId = new Map(students.map((s) => [String(s._id), s]));

  if (search) {
    const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    rows = rows.filter(
      (p) =>
        re.test(p.name || '') ||
        re.test(p.email || '') ||
        re.test(p.phone || '') ||
        re.test(String(p._id))
    );
  }

  return rows.map((p) => {
    const linked = (p.students || []).map((id) => byId.get(String(id))).filter(Boolean);
    return {
      id: String(p._id),
      name: p.name,
      email: p.email || '',
      phone: p.phone || '',
      relationship: p.relationship || 'Guardian',
      status: p.status || 'Active',
      studentsCount: linked.length,
      createdAt: p.createdAt,
      sampleStudents: linked.slice(0, 5).map((s) => ({
        id: String(s._id),
        name: s.name,
        enrollmentId: s.enrollmentId || '',
        assignedClass: s.assignedClass || '',
        assignedSection: s.assignedSection || '',
      })),
    };
  });
};

exports.fetchParentDetails = async (id) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();

  const p = await Parent.findById(id).lean();
  if (!p) {
    const err = new Error('Parent not found');
    err.statusCode = 404;
    throw err;
  }

  const linkedStudentsService = require('./linkedStudentsService');
  const linkedStudents = await linkedStudentsService.fetchLinkedStudents(id);

  return {
    id: String(p._id),
    name: p.name,
    email: p.email || '',
    phone: p.phone || '',
    relationship: p.relationship || 'Guardian',
    status: p.status || 'Active',
    photoUrl: p.photoUrl || '',
    address: p.address || { street: '', city: '', state: '', zip: '', country: '' },
    linkedStudents,
  };
};

exports.updateParentProfile = async (id, payload) => {
  assertDbConnected();
  const p = await Parent.findById(id);
  if (!p) {
    const err = new Error('Parent not found');
    err.statusCode = 404;
    throw err;
  }
  const allowed = ['name', 'email', 'phone', 'relationship', 'status', 'photoUrl', 'address'];
  for (const key of allowed) {
    if (payload[key] !== undefined) {
      if (key === 'address' && typeof payload[key] === 'object') {
        p.address = { ...(p.address || {}), ...payload.address };
      } else {
        p[key] = payload[key];
      }
    }
  }
  await p.save();
  return exports.fetchParentDetails(id);
};

exports.exportParentDirectoryCsv = async ({ search, status } = {}) => {
  const rows = await exports.fetchParentsForDirectory({ search, status });
  const header = ['ID', 'Name', 'Email', 'Phone', 'Relationship', 'Status', 'LinkedStudents', 'CreatedAt'];
  const lines = [header.join(',')];
  for (const r of rows) {
    const vals = [
      r.id,
      r.name,
      r.email,
      r.phone,
      r.relationship,
      r.status,
      r.studentsCount ?? 0,
      r.createdAt ? new Date(r.createdAt).toISOString() : '',
    ].map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`);
    lines.push(vals.join(','));
  }
  return lines.join('\n');
};

exports.deleteParent = async (id) => {
  assertDbConnected();
  const p = await Parent.findByIdAndDelete(id);
  if (!p) {
    const err = new Error('Parent not found');
    err.statusCode = 404;
    throw err;
  }
  return { deleted: true, id: String(p._id) };
};

exports.searchParents = async ({ query } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();

  const q = (query || '').trim();
  if (!q) return [];

  const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const rows = await Parent.find({
    $or: [{ name: re }, { email: re }, { phone: re }],
  })
    .limit(8)
    .lean();

  return rows.map((p) => ({
    id: String(p._id),
    name: p.name,
    email: p.email || '',
    phone: p.phone || '',
    relationship: p.relationship || 'Guardian',
    studentsCount: Array.isArray(p.students) ? p.students.length : 0,
  }));
};

