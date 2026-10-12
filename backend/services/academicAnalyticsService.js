const mongoose = require('mongoose');
const ClassModel = require('../models/Class');
const Subject = require('../models/subjectModel');
const Curriculum = require('../models/curriculumModel');
const LessonPlan = require('../models/lessonPlanModel');
const StudyMaterial = require('../models/studyMaterialModel');
const AcademicAssignment = require('../models/academicAssignmentModel');

function assertDb() {
  if (mongoose.connection?.readyState !== 1) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
}

async function seedIfEmpty() {
  assertDb();
  const classCount = await ClassModel.countDocuments({});
  if (classCount === 0) {
    await ClassModel.insertMany(
      [
        { name: 'Grade 6', sections: ['A', 'B', 'C'] },
        { name: 'Grade 7', sections: ['A', 'B'] },
        { name: 'Grade 8', sections: ['A', 'B', 'C', 'D'] },
        { name: 'Grade 9', sections: ['A', 'B'] },
        { name: 'Grade 10', sections: ['A', 'B', 'C'] },
      ],
      { ordered: false }
    ).catch(() => {});
  }

  const subCount = await Subject.countDocuments({});
  if (subCount === 0) {
    const names = ['Math', 'English', 'Science', 'History', 'Physics', 'Chemistry', 'Biology', 'CS'];
    await Subject.insertMany(names.map((name) => ({ name })), { ordered: false }).catch(() => {});
  }

  if ((await Curriculum.countDocuments({})) === 0) {
    await Curriculum.insertMany(
      [
        { title: 'Core Mathematics', gradeOrClass: 'Grade 6-8', totalUnits: 24, completedUnits: 18, status: 'InProgress' },
        { title: 'Science Foundation', gradeOrClass: 'Grade 6-8', totalUnits: 20, completedUnits: 20, status: 'Completed' },
        { title: 'Language Arts', gradeOrClass: 'Grade 9-10', totalUnits: 16, completedUnits: 8, status: 'InProgress' },
      ],
      { ordered: false }
    ).catch(() => {});
  }

  if ((await LessonPlan.countDocuments({})) === 0) {
    const plans = [];
    for (let i = 1; i <= 12; i += 1) {
      plans.push({
        title: `Week ${i} — Integrated lesson`,
        subject: ['Math', 'Science', 'English'][i % 3],
        teacherName: `Teacher ${(i % 5) + 1}`,
        status: i % 4 === 0 ? 'Published' : i % 4 === 1 ? 'Approved' : i % 4 === 2 ? 'Submitted' : 'Draft',
        weekNumber: i,
        plannedDate: new Date(Date.now() + (i - 6) * 7 * 24 * 60 * 60 * 1000),
      });
    }
    await LessonPlan.insertMany(plans, { ordered: false }).catch(() => {});
  }

  if ((await StudyMaterial.countDocuments({})) === 0) {
    const mats = [];
    const subs = ['Math', 'Science', 'English', 'History'];
    for (let i = 0; i < 16; i += 1) {
      mats.push({
        title: `Resource pack ${i + 1}`,
        subject: subs[i % subs.length],
        fileType: ['PDF', 'PPT', 'Video', 'DOC'][i % 4],
        uploadedBy: `Staff ${(i % 6) + 1}`,
        downloads: Math.floor(Math.random() * 200),
      });
    }
    await StudyMaterial.insertMany(mats, { ordered: false }).catch(() => {});
  }

  if ((await AcademicAssignment.countDocuments({})) === 0) {
    const classes = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const assigns = [];
    for (let i = 0; i < 14; i += 1) {
      const total = 28 + (i % 5) * 4;
      const submitted = Math.floor(total * (0.4 + Math.random() * 0.5));
      assigns.push({
        title: `Assignment ${i + 1}: Chapter review`,
        subject: ['Math', 'Science', 'English'][i % 3],
        className: classes[i % classes.length],
        dueDate: new Date(Date.now() + (i - 7) * 24 * 60 * 60 * 1000),
        totalStudents: total,
        submittedCount: submitted,
        status: i % 5 === 0 ? 'Draft' : 'Published',
      });
    }
    await AcademicAssignment.insertMany(assigns, { ordered: false }).catch(() => {});
  }
}

exports.fetchAcademicOverview = async () => {
  await seedIfEmpty();
  const classes = await ClassModel.find({}).lean();
  let totalSections = 0;
  for (const c of classes) totalSections += (c.sections || []).length;
  const subjectCount = await Subject.countDocuments({});

  return {
    totalClasses: classes.length,
    totalSections,
    totalSubjects: subjectCount,
    classesPreview: classes.slice(0, 5).map((c) => ({ name: c.name, sectionCount: (c.sections || []).length })),
  };
};

exports.fetchCurriculumProgress = async () => {
  await seedIfEmpty();
  const rows = await Curriculum.find({}).lean();
  let totalUnits = 0;
  let completedUnits = 0;
  for (const r of rows) {
    totalUnits += r.totalUnits || 0;
    completedUnits += r.completedUnits || 0;
  }
  const percent = totalUnits ? Math.round((completedUnits / totalUnits) * 100) : 0;
  return {
    percentComplete: percent,
    totalUnits,
    completedUnits,
    pendingUnits: Math.max(0, totalUnits - completedUnits),
    items: rows.map((r) => ({
      id: String(r._id),
      title: r.title,
      gradeOrClass: r.gradeOrClass,
      totalUnits: r.totalUnits,
      completedUnits: r.completedUnits,
      status: r.status,
      progressPercent: r.totalUnits ? Math.round((r.completedUnits / r.totalUnits) * 100) : 0,
    })),
  };
};

exports.fetchLessonPlanningStats = async () => {
  await seedIfEmpty();
  const byStatus = await LessonPlan.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(byStatus.map((x) => [x._id, x.count]));
  const total = Object.values(map).reduce((a, b) => a + b, 0);
  const published = map.Published || 0;
  return {
    total,
    byStatus: map,
    completionRate: total ? Math.round((published / total) * 100) : 0,
    recent: (await LessonPlan.find({}).sort({ updatedAt: -1 }).limit(8).lean()).map((p) => ({
      id: String(p._id),
      title: p.title,
      subject: p.subject,
      teacherName: p.teacherName,
      status: p.status,
      weekNumber: p.weekNumber,
    })),
  };
};

exports.fetchHomeworkStatus = async () => {
  await seedIfEmpty();
  const rows = await AcademicAssignment.find({ status: 'Published' }).lean();
  let pending = 0;
  let totalStudents = 0;
  let submitted = 0;
  for (const r of rows) {
    totalStudents += r.totalStudents || 0;
    submitted += r.submittedCount || 0;
    const rem = (r.totalStudents || 0) - (r.submittedCount || 0);
    if (rem > 0) pending += 1;
  }
  const completionPct = totalStudents ? Math.round((submitted / totalStudents) * 100) : 0;
  return {
    pendingAssignments: pending,
    totalAssignments: rows.length,
    completionPercent: completionPct,
    submittedTotal: submitted,
    expectedTotal: totalStudents,
    items: rows.slice(0, 10).map((a) => ({
      id: String(a._id),
      title: a.title,
      subject: a.subject,
      className: a.className,
      dueDate: a.dueDate,
      submittedCount: a.submittedCount,
      totalStudents: a.totalStudents,
      pending: Math.max(0, (a.totalStudents || 0) - (a.submittedCount || 0)),
    })),
  };
};

exports.fetchStudyMaterialSummary = async () => {
  await seedIfEmpty();
  const total = await StudyMaterial.countDocuments({});
  const bySubject = await StudyMaterial.aggregate([
    { $group: { _id: '$subject', count: { $sum: 1 }, downloads: { $sum: '$downloads' } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);
  return {
    totalMaterials: total,
    bySubject: bySubject.map((x) => ({ subject: x._id || 'General', count: x.count, downloads: x.downloads || 0 })),
    recent: (await StudyMaterial.find({}).sort({ createdAt: -1 }).limit(6).lean()).map((m) => ({
      id: String(m._id),
      title: m.title,
      subject: m.subject,
      fileType: m.fileType,
      downloads: m.downloads,
    })),
  };
};

exports.fetchAcademicActivities = async () => {
  await seedIfEmpty();
  const mats = await StudyMaterial.find({}).sort({ createdAt: -1 }).limit(4).lean();
  const assigns = await AcademicAssignment.find({}).sort({ updatedAt: -1 }).limit(4).lean();
  const currs = await Curriculum.find({}).sort({ updatedAt: -1 }).limit(3).lean();
  const activities = [];
  for (const m of mats) {
    activities.push({
      id: `mat-${m._id}`,
      type: 'material',
      title: `Study material uploaded: ${m.title}`,
      detail: `${m.subject} · ${m.fileType}`,
      createdAt: m.createdAt,
    });
  }
  for (const a of assigns) {
    activities.push({
      id: `asg-${a._id}`,
      type: 'assignment',
      title: `Assignment updated: ${a.title}`,
      detail: `${a.className} · ${a.subject}`,
      createdAt: a.updatedAt || a.createdAt,
    });
  }
  for (const c of currs) {
    activities.push({
      id: `cur-${c._id}`,
      type: 'curriculum',
      title: `Curriculum: ${c.title}`,
      detail: `${c.status} · ${c.completedUnits}/${c.totalUnits} units`,
      createdAt: c.updatedAt || c.createdAt,
    });
  }
  activities.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
  return activities.slice(0, 12);
};

exports.fetchPerformanceInsights = async () => {
  await seedIfEmpty();
  const homework = await exports.fetchHomeworkStatus();
  const curriculum = await exports.fetchCurriculumProgress();
  const lesson = await exports.fetchLessonPlanningStats();
  const bySubject = await AcademicAssignment.aggregate([
    { $match: { status: 'Published' } },
    {
      $group: {
        _id: '$subject',
        avgSubmit: { $avg: { $cond: [{ $gt: ['$totalStudents', 0] }, { $divide: ['$submittedCount', '$totalStudents'] }, 0] } },
        count: { $sum: 1 },
      },
    },
    { $sort: { avgSubmit: -1 } },
    { $limit: 6 },
  ]);
  return {
    headline: `Curriculum ${curriculum.percentComplete}% complete · Homework submission ${homework.completionPercent}%`,
    homeworkCompletionPercent: homework.completionPercent,
    curriculumPercent: curriculum.percentComplete,
    lessonPublishedPercent: lesson.completionRate,
    subjectPerformance: bySubject.map((x) => ({
      subject: x._id || '—',
      submissionRate: Math.round((x.avgSubmit || 0) * 100),
      assignmentCount: x.count,
    })),
  };
};
