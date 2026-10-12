const mongoose = require('mongoose');
const Parent = require('../models/parentModel');
const Student = require('../models/Student');
const Relationship = require('../models/relationshipModel');

function assertDbConnected() {
  if (mongoose.connection?.readyState !== 1) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
}

/** Ensure existing parent.students have Relationship records (backward compatibility) */
async function ensureRelationshipsForParent(parentId) {
  const p = await Parent.findById(parentId).lean();
  if (!p || !(p.students || []).length) return;

  for (const studentId of p.students) {
    const exists = await Relationship.findOne({ parent: parentId, student: studentId });
    if (!exists) {
      await Relationship.create({
        parent: parentId,
        student: studentId,
        relationshipType: p.relationship || 'Guardian',
      }).catch(() => {});
    }
  }
}

/** Fetch linked students for a parent with relationship types */
exports.fetchLinkedStudents = async (parentId) => {
  assertDbConnected();
  await ensureRelationshipsForParent(parentId);

  const relations = await Relationship.find({ parent: parentId })
    .populate('student', 'name enrollmentId assignedClass assignedSection status photoUrl')
    .lean();

  return relations.map((r) => {
    const s = r.student;
    if (!s) return null;
    return {
      id: String(s._id),
      name: s.name || '',
      enrollmentId: s.enrollmentId || '',
      assignedClass: s.assignedClass || '',
      assignedSection: s.assignedSection || '',
      status: s.status || 'Active',
      photoUrl: s.photoUrl || '',
      relationshipType: r.relationshipType || 'Guardian',
    };
  }).filter(Boolean);
};

/** Link a student to a parent */
exports.linkStudent = async (parentId, { studentId, relationshipType }) => {
  assertDbConnected();

  const parent = await Parent.findById(parentId);
  if (!parent) {
    const err = new Error('Parent not found');
    err.statusCode = 404;
    throw err;
  }

  const student = await Student.findById(studentId);
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  const type = ['Father', 'Mother', 'Guardian'].includes(relationshipType)
    ? relationshipType
    : 'Guardian';

  const existing = await Relationship.findOne({ parent: parentId, student: studentId });
  if (existing) {
    existing.relationshipType = type;
    await existing.save();
    return exports.fetchLinkedStudents(parentId);
  }

  const studentIdStr = String(studentId);
  if (!parent.students.some((id) => String(id) === studentIdStr)) {
    parent.students.push(studentId);
    await parent.save();
  }

  await Relationship.create({ parent: parentId, student: studentId, relationshipType: type });
  return exports.fetchLinkedStudents(parentId);
};

/** Unlink a student from a parent */
exports.unlinkStudent = async (parentId, studentId) => {
  assertDbConnected();

  const parent = await Parent.findById(parentId);
  if (!parent) {
    const err = new Error('Parent not found');
    err.statusCode = 404;
    throw err;
  }

  const sid = String(studentId);
  parent.students = (parent.students || []).filter((id) => String(id) !== sid);
  await parent.save();

  await Relationship.deleteOne({ parent: parentId, student: studentId });
  return exports.fetchLinkedStudents(parentId);
};

/** Update relationship type for a link */
exports.updateRelationshipType = async (parentId, studentId, relationshipType) => {
  assertDbConnected();

  const type = ['Father', 'Mother', 'Guardian'].includes(relationshipType)
    ? relationshipType
    : 'Guardian';

  const rel = await Relationship.findOneAndUpdate(
    { parent: parentId, student: studentId },
    { relationshipType: type },
    { new: true }
  );

  if (!rel) {
    const err = new Error('Link not found');
    err.statusCode = 404;
    throw err;
  }

  return exports.fetchLinkedStudents(parentId);
};

/** Fetch student details (for preview) */
exports.fetchStudentDetails = async (studentId) => {
  assertDbConnected();
  const s = await Student.findById(studentId).lean();
  if (!s) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }
  return {
    id: String(s._id),
    name: s.name || '',
    enrollmentId: s.enrollmentId || '',
    assignedClass: s.assignedClass || '',
    assignedSection: s.assignedSection || '',
    status: s.status || 'Active',
    email: s.email || '',
    phone: s.phone || '',
    photoUrl: s.photoUrl || '',
    dob: s.dob,
    gender: s.gender || '',
    address: s.address || {},
  };
};

/** Search students for linking (exclude already linked) */
exports.searchStudentsForLinking = async (parentId, { search, class: cls, section }) => {
  assertDbConnected();

  const relations = await Relationship.find({ parent: parentId }).select('student').lean();
  const linkedIds = new Set(relations.map((r) => String(r.student)));

  const query = { _id: { $nin: Array.from(linkedIds).map((id) => new mongoose.Types.ObjectId(id)) } };
  if (cls) query.assignedClass = cls;
  if (section) query.assignedSection = section;

  let rows = await Student.find(query).select('name enrollmentId assignedClass assignedSection status').sort({ name: 1 }).lean();

  if (search && String(search).trim()) {
    const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    rows = rows.filter(
      (r) =>
        re.test(r.name || '') ||
        re.test(r.enrollmentId || '') ||
        re.test(String(r._id))
    );
  }

  return rows.slice(0, 50).map((r) => ({
    id: String(r._id),
    name: r.name || '',
    enrollmentId: r.enrollmentId || '',
    assignedClass: r.assignedClass || '',
    assignedSection: r.assignedSection || '',
    status: r.status || 'Active',
  }));
};
