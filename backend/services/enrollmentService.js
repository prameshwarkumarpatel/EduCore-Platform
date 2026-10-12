const mongoose = require('mongoose');
const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Application = require('../models/Application');
const ClassModel = require('../models/Class');

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function makeEnrollmentId() {
  return `ENR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
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

function toPublicEnrollment(row) {
  const e = row.toObject ? row.toObject({ virtuals: false }) : row;
  return {
    id: String(e._id),
    enrollmentId: e.enrollmentId,
    status: e.status,
    enrolledAt: e.enrolledAt || e.createdAt,
    assignedClass: e.assignedClass,
    assignedSection: e.assignedSection,
    student: e.student
      ? {
          id: String(e.student._id || e.student.id),
          name: e.student.name,
          email: e.student.email,
          phone: e.student.phone,
        }
      : null,
    applicationId: e.application ? String(e.application._id || e.application) : '',
  };
}

exports.fetchEnrolledStudents = async ({ search, assignedClass, assignedSection, status } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const query = {};
  if (status && ['Pending', 'Enrolled', 'Inactive'].includes(status)) query.status = status;
  if (assignedClass) query.assignedClass = assignedClass;
  if (assignedSection) query.assignedSection = assignedSection;

  let rows = await Enrollment.find(query)
    .sort({ enrolledAt: -1 })
    .populate('student')
    .lean();

  if (search) {
    const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    rows = rows.filter((r) => re.test(r.enrollmentId) || re.test(r.student?.name || '') || re.test(r.student?.email || ''));
  }

  return rows.map((r) => ({
    id: String(r._id),
    enrollmentId: r.enrollmentId,
    status: r.status,
    enrolledAt: r.enrolledAt || r.createdAt,
    assignedClass: r.assignedClass,
    assignedSection: r.assignedSection,
    student: r.student
      ? { id: String(r.student._id), name: r.student.name, email: r.student.email, phone: r.student.phone }
      : null,
    applicationId: r.application ? String(r.application) : '',
  }));
};

exports.generateEnrollmentId = async () => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  let id = makeEnrollmentId();
  // ensure uniqueness
  // eslint-disable-next-line no-constant-condition
  while (await Enrollment.exists({ enrollmentId: id })) {
    id = makeEnrollmentId();
  }
  return { enrollmentId: id };
};

exports.convertApplicationToStudent = async (applicationId) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const already = await Enrollment.exists({ application: applicationId });
  if (already) {
    const err = new Error('Application already converted to enrollment');
    err.statusCode = 409;
    throw err;
  }

  const app = await Application.findById(applicationId).populate('applicant');
  if (!app) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }
  if (app.status !== 'Approved') {
    const err = new Error('Only approved applications can be converted');
    err.statusCode = 400;
    throw err;
  }
  if (!app.assignedClass || !app.assignedSection) {
    const err = new Error('Assign class and section in Approval before converting');
    err.statusCode = 400;
    throw err;
  }

  const { enrollmentId } = await exports.generateEnrollmentId();

  const student = await Student.create({
    name: app.applicant?.name || 'Unknown',
    email: app.applicant?.email || '',
    phone: app.applicant?.phone || '',
    enrollmentId,
    assignedClass: app.assignedClass,
    assignedSection: app.assignedSection,
    application: app._id,
  });

  const enrollment = await Enrollment.create({
    student: student._id,
    application: app._id,
    enrollmentId,
    assignedClass: app.assignedClass,
    assignedSection: app.assignedSection,
    status: 'Enrolled',
  });

  return toPublicEnrollment({ ...enrollment.toObject(), student, application: app._id });
};

exports.assignClassSection = async (enrollmentId, { assignedClass, assignedSection } = {}) => {
  if (!assignedClass || !assignedSection) {
    const err = new Error('Class and section are required');
    err.statusCode = 400;
    throw err;
  }

  const updated = await Enrollment.findByIdAndUpdate(
    enrollmentId,
    { assignedClass, assignedSection },
    { new: true }
  ).populate('student');

  if (!updated) {
    const err = new Error('Enrollment not found');
    err.statusCode = 404;
    throw err;
  }

  await Student.findByIdAndUpdate(updated.student?._id, { assignedClass, assignedSection }).catch(() => {});

  return toPublicEnrollment(updated);
};

exports.fetchClasses = async () => {
  await ensureSeedClasses();
  const list = await ClassModel.find({}).sort({ name: 1 }).lean();
  return list.map((c) => ({ id: String(c._id), name: c.name, sections: c.sections || [] }));
};

exports.exportEnrollmentData = async (filters = {}) => {
  const rows = await exports.fetchEnrolledStudents(filters);
  const header = ["EnrollmentID", "StudentName", "Email", "Phone", "Class", "Section", "Status", "EnrolledAt"];
  const lines = [header.join(",")];
  for (const r of rows) {
    const vals = [
      r.enrollmentId,
      r.student?.name || "",
      r.student?.email || "",
      r.student?.phone || "",
      r.assignedClass || "",
      r.assignedSection || "",
      r.status || "",
      r.enrolledAt ? new Date(r.enrolledAt).toISOString() : "",
    ].map((v) => `"${String(v).replaceAll('"', '""')}"`);
    lines.push(vals.join(","));
  }
  return lines.join("\n");
};

