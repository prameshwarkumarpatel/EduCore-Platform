const Staff = require('../models/staffModel');
const Subject = require('../models/subjectModel');
const SubjectAllocation = require('../models/subjectAllocationModel');
const subjectAllocationService = require('./subjectAllocationService');

function toNumber(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function teacherHoursFromAllocations(count) {
  // Keep a stable approximation for now: one allocation is ~5 hours/week
  return count * 5;
}

async function ensureData() {
  await subjectAllocationService.fetchMeta();
  const teachers = await Staff.find({ roleType: 'Teacher', status: 'Active' })
    .select('assignedClasses assignedSubjects')
    .lean();
  if (!teachers.length) return;

  const allocationAgg = await SubjectAllocation.aggregate([
    { $group: { _id: '$teacher', count: { $sum: 1 } } },
  ]);
  const allocatedTeacherIds = new Set(allocationAgg.filter((x) => x.count > 0).map((x) => String(x._id)));

  const subjects = await Subject.find({}).lean();
  const subjectByName = new Map(subjects.map((s) => [String(s.name || '').toLowerCase(), String(s._id)]));
  const docs = [];

  for (const t of teachers) {
    if (allocatedTeacherIds.has(String(t._id))) continue;
    const classes = Array.isArray(t.assignedClasses) ? t.assignedClasses : [];
    const subNames = Array.isArray(t.assignedSubjects) ? t.assignedSubjects : [];
    for (const className of classes) {
      for (const subjectName of subNames) {
        const sid = subjectByName.get(String(subjectName || '').toLowerCase());
        if (!sid) continue;
        docs.push({
          teacher: t._id,
          subject: sid,
          className: String(className || ''),
          section: 'A',
        });
      }
    }
  }
  if (docs.length) {
    await SubjectAllocation.insertMany(docs, { ordered: false }).catch(() => {});
  }
}

function normalizeFilters(filters = {}) {
  return {
    staffId: filters.staffId || '',
    department: filters.department || '',
    workloadLevel: filters.workloadLevel || '',
  };
}

async function buildRows(filters = {}) {
  await ensureData();
  const f = normalizeFilters(filters);
  const staffQuery = { roleType: 'Teacher', status: 'Active' };
  if (f.staffId) staffQuery._id = f.staffId;
  if (f.department) staffQuery.department = f.department;

  const teachers = await Staff.find(staffQuery).select('name department assignedClasses assignedSubjects').lean();
  const teacherIds = teachers.map((t) => t._id);
  const allocations = await SubjectAllocation.find({ teacher: { $in: teacherIds } })
    .populate('subject')
    .lean();

  const byTeacher = new Map();
  for (const t of teachers) {
    byTeacher.set(String(t._id), {
      id: String(t._id),
      name: t.name || '',
      department: t.department || 'General',
      classes: new Set(),
      subjects: new Set(),
      assignments: [],
    });
  }

  for (const a of allocations) {
    const tid = String(a.teacher);
    const row = byTeacher.get(tid);
    if (!row) continue;
    row.classes.add(`${a.className}/${a.section}`);
    if (a.subject?.name) row.subjects.add(a.subject.name);
    row.assignments.push({
      allocationId: String(a._id),
      subjectId: a.subject?._id ? String(a.subject._id) : '',
      subjectName: a.subject?.name || '',
      className: a.className || '',
      section: a.section || '',
    });
  }

  let rows = Array.from(byTeacher.values()).map((r) => {
    const sourceTeacher = teachers.find((t) => String(t._id) === r.id);
    const fallbackClasses = Array.isArray(sourceTeacher?.assignedClasses) ? sourceTeacher.assignedClasses : [];
    const fallbackSubjects = Array.isArray(sourceTeacher?.assignedSubjects) ? sourceTeacher.assignedSubjects : [];
    for (const c of fallbackClasses) r.classes.add(c);
    for (const s of fallbackSubjects) r.subjects.add(s);

    const classesCount = r.classes.size;
    const subjectsCount = r.subjects.size;
    const totalAllocations = r.assignments.length;
    const teachingHours = totalAllocations
      ? teacherHoursFromAllocations(totalAllocations)
      : (classesCount * 4) + (subjectsCount * 2);
    return {
      id: r.id,
      name: r.name,
      department: r.department,
      classesCount,
      subjectsCount,
      totalAllocations,
      teachingHours,
      assignments: r.assignments,
      tags: [...r.subjects].slice(0, 6),
    };
  });

  const avgHours = rows.length
    ? rows.reduce((sum, r) => sum + r.teachingHours, 0) / rows.length
    : 0;
  const targetHours = Math.max(10, Math.round(avgHours));
  rows = rows.map((r) => {
    const overloadIndex = r.teachingHours - targetHours;
    const workloadLevel = overloadIndex >= 4 ? 'Overloaded' : overloadIndex <= -4 ? 'Underloaded' : 'Balanced';
    return { ...r, targetHours, overloadIndex, workloadLevel };
  });

  if (f.workloadLevel) rows = rows.filter((r) => r.workloadLevel === f.workloadLevel);
  return rows.sort((a, b) => b.teachingHours - a.teachingHours || a.name.localeCompare(b.name));
}

exports.fetchWorkloadData = async (filters = {}) => {
  const rows = await buildRows(filters);
  const totalTeachers = rows.length;
  const totalClasses = rows.reduce((sum, r) => sum + r.classesCount, 0);
  const totalSubjects = rows.reduce((sum, r) => sum + r.subjectsCount, 0);
  const totalHours = rows.reduce((sum, r) => sum + r.teachingHours, 0);
  return {
    summary: {
      totalTeachers,
      totalClasses,
      totalSubjects,
      totalHours,
      avgHours: totalTeachers ? Number((totalHours / totalTeachers).toFixed(1)) : 0,
    },
    items: rows,
  };
};

exports.fetchTeachingHours = async (filters = {}) => {
  const rows = await buildRows(filters);
  return {
    totalHours: rows.reduce((sum, r) => sum + r.teachingHours, 0),
    items: rows.map((r) => ({
      staffId: r.id,
      staffName: r.name,
      department: r.department,
      teachingHours: r.teachingHours,
      targetHours: r.targetHours,
      progressPercent: Math.min(100, Math.round((r.teachingHours / Math.max(r.targetHours, 1)) * 100)),
      workloadLevel: r.workloadLevel,
    })),
  };
};

exports.analyzeWorkload = async (filters = {}) => {
  const rows = await buildRows(filters);
  const overloaded = rows.filter((r) => r.workloadLevel === 'Overloaded');
  const underloaded = rows.filter((r) => r.workloadLevel === 'Underloaded');
  const balanced = rows.filter((r) => r.workloadLevel === 'Balanced');
  return {
    distribution: {
      overloaded: overloaded.length,
      balanced: balanced.length,
      underloaded: underloaded.length,
    },
    warnings: overloaded.map((r) => ({
      staffId: r.id,
      staffName: r.name,
      message: `${r.name} is overloaded by ${r.overloadIndex}h/week`,
    })),
    insights: [
      `${overloaded.length} overloaded staff`,
      `${balanced.length} balanced staff`,
      `${underloaded.length} underloaded staff`,
    ],
  };
};

exports.updateWorkload = async (payload = {}) => {
  const allocationId = (payload?.allocationId ?? '').toString().trim();
  const toStaffId = (payload?.toStaffId ?? '').toString().trim();
  if (!allocationId || !toStaffId) {
    const err = new Error('allocationId and toStaffId are required');
    err.statusCode = 400;
    throw err;
  }

  const targetTeacher = await Staff.findById(toStaffId).lean();
  if (!targetTeacher || targetTeacher.roleType !== 'Teacher' || targetTeacher.status !== 'Active') {
    const err = new Error('Target staff must be an active teacher');
    err.statusCode = 400;
    throw err;
  }

  const row = await SubjectAllocation.findById(allocationId);
  if (!row) {
    const err = new Error('Allocation not found');
    err.statusCode = 404;
    throw err;
  }
  row.teacher = toStaffId;
  await row.save();

  const latest = await SubjectAllocation.findById(allocationId).populate('teacher').populate('subject').lean();
  return {
    updated: true,
    allocation: {
      id: String(latest._id),
      teacherId: latest.teacher?._id ? String(latest.teacher._id) : '',
      teacherName: latest.teacher?.name || '',
      subjectName: latest.subject?.name || '',
      className: latest.className || '',
      section: latest.section || '',
    },
  };
};

exports.generateWorkloadReport = async (filters = {}) => {
  const out = await this.fetchWorkloadData(filters);
  const rows = out.items;
  const csvHeader = 'Staff,Department,Classes,Subjects,Allocations,Hours,Target,Level';
  const csvRows = rows.map((r) =>
    [r.name, r.department, r.classesCount, r.subjectsCount, r.totalAllocations, r.teachingHours, r.targetHours, r.workloadLevel]
      .map((x) => `"${String(x).replace(/"/g, '""')}"`)
      .join(',')
  );
  return {
    generatedAt: new Date().toISOString(),
    summary: out.summary,
    preview: rows.slice(0, 10),
    csv: [csvHeader, ...csvRows].join('\n'),
    reportName: `workload-report-${Date.now()}.csv`,
  };
};

exports.fetchMeta = async () => {
  await ensureData();
  const teachers = await Staff.find({ roleType: 'Teacher', status: 'Active' }).select('name department').sort({ name: 1 }).lean();
  const departments = [...new Set(teachers.map((t) => t.department).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return {
    staff: teachers.map((t) => ({ id: String(t._id), name: t.name || '', department: t.department || '' })),
    departments,
    workloadLevels: ['Overloaded', 'Balanced', 'Underloaded'],
  };
};

exports.toNumber = toNumber;

