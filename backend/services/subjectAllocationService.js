const Staff = require('../models/staffModel');
const ClassModel = require('../models/Class');
const Subject = require('../models/subjectModel');
const Section = require('../models/sectionModel');
const SubjectAllocation = require('../models/subjectAllocationModel');
const staffService = require('./staffService');

async function seedIfEmpty() {
  await staffService.fetchStaffStats();

  const subjectCount = await Subject.countDocuments({});
  if (subjectCount === 0) {
    const subjects = ['Math', 'English', 'Science', 'History', 'Computer', 'Physics', 'Chemistry', 'Biology'];
    await Subject.insertMany(subjects.map((name) => ({ name })), { ordered: false }).catch(() => {});
  }

  const classes = await ClassModel.find({}).lean();
  if (classes.length) {
    const existingSections = await Section.countDocuments({});
    if (existingSections === 0) {
      const rows = [];
      for (const c of classes) {
        for (const s of c.sections || []) rows.push({ name: s, className: c.name });
      }
      if (rows.length) await Section.insertMany(rows, { ordered: false }).catch(() => {});
    }
  }
}

function toPublic(row) {
  const r = row.toObject ? row.toObject() : row;
  return {
    id: String(r._id),
    teacher: r.teacher ? { id: String(r.teacher._id || r.teacher), name: r.teacher.name || '' } : null,
    subject: r.subject ? { id: String(r.subject._id || r.subject), name: r.subject.name || '' } : null,
    className: r.className || '',
    section: r.section || '',
    createdAt: r.createdAt,
  };
}

exports.fetchAllocations = async ({ teacherId, className, subjectId } = {}) => {
  await seedIfEmpty();
  const q = {};
  if (teacherId) q.teacher = teacherId;
  if (className) q.className = className;
  if (subjectId) q.subject = subjectId;
  const rows = await SubjectAllocation.find(q).sort({ createdAt: -1 }).populate('teacher').populate('subject').lean();
  return rows.map(toPublic);
};

exports.createAllocation = async ({ teacherId, subjectId, className, section } = {}) => {
  await seedIfEmpty();
  if (!teacherId || !subjectId || !className || !section) {
    const err = new Error('teacherId, subjectId, className and section are required');
    err.statusCode = 400;
    throw err;
  }
  const row = await SubjectAllocation.create({ teacher: teacherId, subject: subjectId, className, section });
  return this.fetchAllocationDetails(row._id);
};

exports.fetchAllocationDetails = async (id) => {
  const row = await SubjectAllocation.findById(id).populate('teacher').populate('subject').lean();
  if (!row) {
    const err = new Error('Allocation not found');
    err.statusCode = 404;
    throw err;
  }
  return toPublic(row);
};

exports.updateAllocation = async (id, payload = {}) => {
  const row = await SubjectAllocation.findById(id);
  if (!row) {
    const err = new Error('Allocation not found');
    err.statusCode = 404;
    throw err;
  }
  const allowed = { teacherId: 'teacher', subjectId: 'subject', className: 'className', section: 'section' };
  for (const [k, field] of Object.entries(allowed)) {
    if (payload[k] !== undefined) row[field] = payload[k];
  }
  await row.save();
  return this.fetchAllocationDetails(id);
};

exports.deleteAllocation = async (id) => {
  const row = await SubjectAllocation.findByIdAndDelete(id);
  if (!row) {
    const err = new Error('Allocation not found');
    err.statusCode = 404;
    throw err;
  }
  return { deleted: true, id: String(row._id) };
};

exports.checkConflicts = async ({ teacherId, className, section, subjectId, excludeId } = {}) => {
  await seedIfEmpty();
  const warnings = [];
  if (teacherId && className && section) {
    const sameTeacherClass = await SubjectAllocation.findOne({
      teacher: teacherId,
      className,
      section,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).populate('subject').lean();
    if (sameTeacherClass) {
      warnings.push(`Teacher already assigned for ${className}/${section} (${sameTeacherClass.subject?.name || 'subject'})`);
    }
  }
  if (subjectId && className && section) {
    const sameSubjectClass = await SubjectAllocation.findOne({
      subject: subjectId,
      className,
      section,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).populate('teacher').lean();
    if (sameSubjectClass) {
      warnings.push(`Subject already allocated in ${className}/${section} to ${sameSubjectClass.teacher?.name || 'teacher'}`);
    }
  }
  return { hasConflict: warnings.length > 0, warnings };
};

exports.fetchMeta = async () => {
  await seedIfEmpty();
  const teachers = await Staff.find({ roleType: 'Teacher', status: 'Active' }).select('name').sort({ name: 1 }).lean();
  const subjects = await Subject.find({}).sort({ name: 1 }).lean();
  const classes = await ClassModel.find({}).sort({ name: 1 }).lean();
  return {
    teachers: teachers.map((t) => ({ id: String(t._id), name: t.name || '' })),
    subjects: subjects.map((s) => ({ id: String(s._id), name: s.name || '' })),
    classes: classes.map((c) => ({ name: c.name, sections: c.sections || [] })),
  };
};

exports.fetchTeacherWorkload = async () => {
  await seedIfEmpty();
  const rows = await SubjectAllocation.find({}).populate('teacher').populate('subject').lean();
  const byTeacher = new Map();
  for (const r of rows) {
    const tid = String(r.teacher?._id || '');
    if (!tid) continue;
    if (!byTeacher.has(tid)) byTeacher.set(tid, { teacherId: tid, teacherName: r.teacher?.name || '', subjects: new Set(), classes: new Set(), totalAllocations: 0 });
    const cur = byTeacher.get(tid);
    cur.totalAllocations += 1;
    if (r.subject?.name) cur.subjects.add(r.subject.name);
    cur.classes.add(`${r.className}/${r.section}`);
  }
  return Array.from(byTeacher.values()).map((x) => ({
    teacherId: x.teacherId,
    teacherName: x.teacherName,
    subjectsCount: x.subjects.size,
    classesCount: x.classes.size,
    totalAllocations: x.totalAllocations,
    overloaded: x.totalAllocations >= 6,
  })).sort((a, b) => b.totalAllocations - a.totalAllocations);
};

