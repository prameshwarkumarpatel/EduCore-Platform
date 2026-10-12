const ClassModel = require('../models/Class');
const Section = require('../models/sectionModel');
const Staff = require('../models/staffModel');
const Student = require('../models/Student');

async function seedIfEmpty() {
  const count = await ClassModel.countDocuments({});
  if (count > 0) return;
  await ClassModel.insertMany(
    [
      { name: 'Grade 1', sections: ['A', 'B'] },
      { name: 'Grade 2', sections: ['A', 'B'] },
      { name: 'Grade 3', sections: ['A', 'B'] },
      { name: 'Grade 4', sections: ['A', 'B'] },
      { name: 'Grade 5', sections: ['A', 'B'] },
    ],
    { ordered: false }
  ).catch(() => {});
}

function toSectionPublic(row) {
  const s = row.toObject ? row.toObject() : row;
  return {
    id: String(s._id),
    name: s.name || '',
    className: s.className || '',
    capacity: Number(s.capacity || 40),
    classTeacher: s.classTeacher
      ? { id: String(s.classTeacher._id || s.classTeacher), name: s.classTeacher.name || '' }
      : null,
    studentCount: Number(s.studentCount || 0),
    availableSeats: Math.max(0, Number(s.capacity || 40) - Number(s.studentCount || 0)),
  };
}

async function sectionStudentCounts() {
  const rows = await Student.aggregate([
    { $match: { status: { $in: ['Active', 'Pending'] } } },
    {
      $group: {
        _id: { className: '$assignedClass', sectionName: '$assignedSection' },
        count: { $sum: 1 },
      },
    },
  ]);
  const map = new Map();
  for (const r of rows) {
    const key = `${r?._id?.className || ''}__${r?._id?.sectionName || ''}`;
    map.set(key, Number(r.count || 0));
  }
  return map;
}

exports.fetchDashboard = async ({ className, sectionName, search } = {}) => {
  await seedIfEmpty();

  const classes = await ClassModel.find({}).sort({ name: 1 }).lean();
  if (await Section.countDocuments({}) === 0) {
    const rows = [];
    for (const c of classes) {
      for (const s of c.sections || []) rows.push({ name: s, className: c.name });
    }
    if (rows.length) await Section.insertMany(rows, { ordered: false }).catch(() => {});
  }

  const sectionQuery = {};
  if (className) sectionQuery.className = className;
  if (sectionName) sectionQuery.name = sectionName;
  if (search) {
    const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    sectionQuery.$or = [{ className: re }, { name: re }];
  }

  const [sectionsRaw, teachers, counts] = await Promise.all([
    Section.find(sectionQuery).sort({ className: 1, name: 1 }).populate('classTeacher', 'name').lean(),
    Staff.find({ roleType: 'Teacher', status: 'Active' }).select('name assignedClasses').sort({ name: 1 }).lean(),
    sectionStudentCounts(),
  ]);

  const sections = sectionsRaw.map((row) =>
    toSectionPublic({
      ...row,
      studentCount: counts.get(`${row.className}__${row.name}`) || 0,
    })
  );

  const classRows = classes.map((c) => {
    const classSections = sections.filter((s) => s.className === c.name);
    return {
      id: String(c._id),
      name: c.name,
      sectionsCount: classSections.length || (c.sections || []).length,
      studentCount: classSections.reduce((sum, s) => sum + s.studentCount, 0),
      active: classSections.length > 0,
    };
  });

  const totals = {
    totalClasses: classRows.length,
    activeClasses: classRows.filter((c) => c.active).length,
    totalSections: sections.length,
    totalStudents: sections.reduce((sum, s) => sum + s.studentCount, 0),
  };

  return {
    overview: totals,
    classes: classRows,
    sections,
    teachers: teachers.map((t) => ({ id: String(t._id), name: t.name || '' })),
  };
};

exports.createClass = async ({ name } = {}) => {
  if (!name || !String(name).trim()) {
    const err = new Error('Class name is required');
    err.statusCode = 400;
    throw err;
  }
  const row = await ClassModel.create({ name: String(name).trim(), sections: [] });
  return { id: String(row._id), name: row.name };
};

exports.updateClass = async (id, { name } = {}) => {
  const row = await ClassModel.findById(id);
  if (!row) {
    const err = new Error('Class not found');
    err.statusCode = 404;
    throw err;
  }
  if (name && String(name).trim()) {
    const oldName = row.name;
    row.name = String(name).trim();
    await row.save();
    if (oldName !== row.name) {
      await Section.updateMany({ className: oldName }, { className: row.name });
      await Student.updateMany({ assignedClass: oldName }, { assignedClass: row.name });
    }
  }
  return { id: String(row._id), name: row.name };
};

exports.deleteClass = async (id) => {
  const row = await ClassModel.findByIdAndDelete(id);
  if (!row) {
    const err = new Error('Class not found');
    err.statusCode = 404;
    throw err;
  }
  await Section.deleteMany({ className: row.name });
  return { deleted: true, id: String(row._id) };
};

exports.createSection = async ({ className, name, capacity } = {}) => {
  if (!className || !name) {
    const err = new Error('className and name are required');
    err.statusCode = 400;
    throw err;
  }
  const cls = await ClassModel.findOne({ name: className });
  if (!cls) {
    const err = new Error('Class not found');
    err.statusCode = 404;
    throw err;
  }
  const row = await Section.create({ className, name, capacity: Number(capacity || 40) });
  if (!cls.sections.includes(name)) {
    cls.sections.push(name);
    await cls.save();
  }
  return toSectionPublic(row);
};

exports.updateSection = async (id, payload = {}) => {
  const row = await Section.findById(id);
  if (!row) {
    const err = new Error('Section not found');
    err.statusCode = 404;
    throw err;
  }
  if (payload.name !== undefined) row.name = String(payload.name || '').trim() || row.name;
  if (payload.capacity !== undefined) row.capacity = Number(payload.capacity || row.capacity);
  await row.save();
  return this.fetchSection(id);
};

exports.fetchSection = async (id) => {
  const counts = await sectionStudentCounts();
  const row = await Section.findById(id).populate('classTeacher', 'name').lean();
  if (!row) {
    const err = new Error('Section not found');
    err.statusCode = 404;
    throw err;
  }
  return toSectionPublic({ ...row, studentCount: counts.get(`${row.className}__${row.name}`) || 0 });
};

exports.deleteSection = async (id) => {
  const row = await Section.findByIdAndDelete(id);
  if (!row) {
    const err = new Error('Section not found');
    err.statusCode = 404;
    throw err;
  }
  await ClassModel.updateOne({ name: row.className }, { $pull: { sections: row.name } }).catch(() => {});
  return { deleted: true, id: String(row._id) };
};

exports.assignClassTeacher = async ({ sectionId, teacherId } = {}) => {
  if (!sectionId || !teacherId) {
    const err = new Error('sectionId and teacherId are required');
    err.statusCode = 400;
    throw err;
  }
  const teacher = await Staff.findById(teacherId).lean();
  if (!teacher) {
    const err = new Error('Teacher not found');
    err.statusCode = 404;
    throw err;
  }
  const row = await Section.findByIdAndUpdate(sectionId, { classTeacher: teacherId }, { new: true });
  if (!row) {
    const err = new Error('Section not found');
    err.statusCode = 404;
    throw err;
  }
  return this.fetchSection(sectionId);
};

exports.updateSectionCapacity = async ({ sectionId, capacity } = {}) => {
  if (!sectionId || capacity === undefined) {
    const err = new Error('sectionId and capacity are required');
    err.statusCode = 400;
    throw err;
  }
  const row = await Section.findByIdAndUpdate(sectionId, { capacity: Number(capacity) }, { new: true });
  if (!row) {
    const err = new Error('Section not found');
    err.statusCode = 404;
    throw err;
  }
  return this.fetchSection(sectionId);
};
