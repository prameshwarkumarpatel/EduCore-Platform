const mongoose = require('mongoose');
const crypto = require('crypto');
const Student = require('../models/Student');
const AcademicRecord = require('../models/AcademicRecord');
const AcademicSubjectGrade = require('../models/AcademicSubjectGrade');
const Transcript = require('../models/Transcript');

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

function resolveQuery(idOrEnrollmentId) {
  if (mongoose.Types.ObjectId.isValid(idOrEnrollmentId)) return { _id: idOrEnrollmentId };
  return { enrollmentId: idOrEnrollmentId };
}

function gradeFromMarks(pct) {
  if (pct >= 85) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 55) return 'C';
  if (pct >= 45) return 'D';
  return 'F';
}

function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeIsoDate(d) {
  try {
    return new Date(d).toISOString();
  } catch {
    return '';
  }
}

async function ensureSeedData() {
  assertDbConnected();
  const recCount = await AcademicRecord.countDocuments({});
  if (recCount > 0) return;

  const students = await Student.find({}).limit(20).lean();
  if (!students.length) return;

  const subjectPool = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'];
  const years = ['2024-2025', '2025-2026'];

  const recordRows = [];
  const subjectRows = [];

  for (const st of students) {
    const sid = st._id;
    const classHint = st.assignedClass || 'Grade ?';
    const base = 62 + Math.floor(Math.random() * 20); // 62-81
    for (const y of years) {
      for (const term of ['Semester 1', 'Semester 2']) {
        const gpa = Math.round(((base + (term === 'Semester 2' ? 3 : 0)) / 100) * 4 * 10) / 10; // approx
        const recordId = new mongoose.Types.ObjectId();
        recordRows.push({
          _id: recordId,
          student: sid,
          academicYear: y,
          term,
          gpa: Number.isFinite(gpa) ? Math.max(0, Math.min(4, gpa)) : 2.5,
          notes: `${classHint} performance snapshot`,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
        });

        for (const subj of subjectPool) {
          const wobble = Math.floor(Math.random() * 18) - 6; // -6..+11
          const marks = Math.max(20, Math.min(100, base + wobble + (subj === 'Mathematics' ? 2 : 0) + (term === 'Semester 2' ? 3 : 0)));
          const pct = marks;
          const grade = gradeFromMarks(pct);
          subjectRows.push({
            record: recordId,
            subject: subj,
            marks,
            percentage: pct,
            grade,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
          });
        }
      }
    }
  }

  // insert with explicit ids (so subject rows link correctly)
  await AcademicRecord.insertMany(recordRows, { ordered: false }).catch(() => {});
  await AcademicSubjectGrade.insertMany(subjectRows, { ordered: false }).catch(() => {});
}

function toTrends(records) {
  // records sorted newest->oldest; convert to oldest->newest for chart
  const sorted = [...records].sort((a, b) => String(a.academicYear).localeCompare(String(b.academicYear)));
  return sorted.map((r) => ({ key: `${r.academicYear} • ${r.term}`, gpa: r.gpa }));
}

async function fetchStudentWithRecords(studentId, { start, end } = {}) {
  const queryStudent = resolveQuery(studentId);
  const student = await Student.findOne(queryStudent).lean();
  if (!student) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    throw err;
  }

  const recQuery = { student: student._id };
  if (start || end) {
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;
    if (startDate && !Number.isNaN(startDate.getTime())) recQuery.createdAt = { ...(recQuery.createdAt || {}), $gte: startDate };
    if (endDate && !Number.isNaN(endDate.getTime())) recQuery.createdAt = { ...(recQuery.createdAt || {}), $lte: endDate };
  }

  const records = await AcademicRecord.find(recQuery).sort({ createdAt: -1 }).lean();
  const recordIds = records.map((r) => r._id);
  const subjects = recordIds.length
    ? await AcademicSubjectGrade.find({ record: { $in: recordIds } }).lean()
    : [];

  const subjectsByRecord = new Map();
  for (const s of subjects) {
    const key = String(s.record);
    if (!subjectsByRecord.has(key)) subjectsByRecord.set(key, []);
    subjectsByRecord.get(key).push(s);
  }

  return { student, records, subjectsByRecord };
}

exports.fetchGPA = async (studentId, range) => {
  await ensureSeedData();
  const { student, records } = await fetchStudentWithRecords(studentId, range);
  const gpas = records.map((r) => Number(r.gpa)).filter((n) => Number.isFinite(n));
  const avg = gpas.length ? Math.round((gpas.reduce((a, b) => a + b, 0) / gpas.length) * 10) / 10 : 0;
  const latest = records[0]?.gpa ?? 0;
  return {
    student: { id: String(student._id), name: student.name, enrollmentId: student.enrollmentId },
    overallGpa: avg,
    latestGpa: latest,
    recordsCount: records.length,
  };
};

exports.fetchGrades = async (studentId, range) => {
  await ensureSeedData();
  const { student, records, subjectsByRecord } = await fetchStudentWithRecords(studentId, range);
  const latestRecord = records[0];
  const latestSubjects = latestRecord ? (subjectsByRecord.get(String(latestRecord._id)) || []) : [];
  const byGrade = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  latestSubjects.forEach((s) => {
    if (byGrade[s.grade] != null) byGrade[s.grade] += 1;
  });
  return {
    student: { id: String(student._id), name: student.name, enrollmentId: student.enrollmentId },
    latest: {
      academicYear: latestRecord?.academicYear || '',
      term: latestRecord?.term || '',
      gpa: latestRecord?.gpa ?? 0,
      subjects: latestSubjects.map((s) => ({
        subject: s.subject,
        marks: s.marks,
        grade: s.grade,
        percentage: s.percentage,
      })),
      gradeDistribution: byGrade,
    },
  };
};

exports.fetchSubjectPerformance = async (studentId, range) => {
  await ensureSeedData();
  const { student, records, subjectsByRecord } = await fetchStudentWithRecords(studentId, range);
  const allSubjects = [];
  for (const rec of records) {
    allSubjects.push(...(subjectsByRecord.get(String(rec._id)) || []));
  }
  const map = new Map();
  for (const s of allSubjects) {
    const key = s.subject;
    if (!map.has(key)) map.set(key, { subject: key, count: 0, totalMarks: 0, countsByGrade: { A: 0, B: 0, C: 0, D: 0, F: 0 } });
    const row = map.get(key);
    row.count += 1;
    row.totalMarks += s.marks;
    row.countsByGrade[s.grade] = (row.countsByGrade[s.grade] || 0) + 1;
  }
  const rows = Array.from(map.values()).map((r) => {
    const avgMarks = Math.round((r.totalMarks / Math.max(1, r.count)) * 10) / 10;
    const grade = Object.entries(r.countsByGrade).sort((a, b) => b[1] - a[1])[0]?.[0] || 'C';
    return { subject: r.subject, avgMarks, grade, occurrences: r.count };
  });
  rows.sort((a, b) => b.avgMarks - a.avgMarks);
  return {
    student: { id: String(student._id), name: student.name, enrollmentId: student.enrollmentId },
    subjects: rows,
  };
};

exports.fetchAcademicHistory = async (studentId, range) => {
  await ensureSeedData();
  const { student, records, subjectsByRecord } = await fetchStudentWithRecords(studentId, range);
  const list = records.map((r) => ({
    id: String(r._id),
    academicYear: r.academicYear,
    term: r.term,
    gpa: r.gpa,
    createdAt: r.createdAt,
    subjects: (subjectsByRecord.get(String(r._id)) || []).map((s) => ({
      subject: s.subject,
      marks: s.marks,
      grade: s.grade,
    })),
  }));
  return {
    student: { id: String(student._id), name: student.name, enrollmentId: student.enrollmentId },
    history: list,
  };
};

exports.generateTranscript = async (studentId, { transcriptType } = {}) => {
  await ensureSeedData();
  const type = transcriptType || 'Official';
  const { student, records, subjectsByRecord } = await fetchStudentWithRecords(studentId, {});

  const transcriptNo = `TRX-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const content = [
    `<div style="font-family:Arial, sans-serif; padding:18px;">`,
    `<h2 style="margin:0 0 8px;">Academic Transcript</h2>`,
    `<p style="margin:0 0 16px; color:#444;">Transcript No: <b>${transcriptNo}</b> (${escHtml(type)})</p>`,
    `<h3 style="margin:0 0 8px;">Student Details</h3>`,
    `<p style="margin:0; color:#222;"><b>Name:</b> ${escHtml(student.name)}</p>`,
    `<p style="margin:0; color:#222;"><b>Enrollment ID:</b> ${escHtml(student.enrollmentId)}</p>`,
    `<p style="margin:0 0 16px; color:#222;"><b>Class:</b> ${escHtml(student.assignedClass || '')} / ${escHtml(student.assignedSection || '')}</p>`,
    `<h3 style="margin:0 0 8px;">Academic Records</h3>`,
    `<div>`,
  ];

  for (const r of records.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).reverse()) {
    content.push(`<div style="border:1px solid #ddd; border-radius:10px; padding:12px; margin:10px 0;">`);
    content.push(`<div style="display:flex; justify-content:space-between; gap:12px;">`);
    content.push(`<div><b>${escHtml(r.academicYear)}</b> • ${escHtml(r.term)}</div>`);
    content.push(`<div><b>GPA:</b> ${Number(r.gpa).toFixed(1)}</div>`);
    content.push(`</div>`);
    const subs = subjectsByRecord.get(String(r._id)) || [];
    content.push(`<table style="width:100%; border-collapse:collapse; margin-top:8px;">`);
    content.push(`<thead><tr><th style="border-bottom:1px solid #eee; text-align:left; padding:6px;">Subject</th><th style="border-bottom:1px solid #eee; text-align:left; padding:6px;">Marks</th><th style="border-bottom:1px solid #eee; text-align:left; padding:6px;">Grade</th></tr></thead>`);
    content.push(`<tbody>`);
    for (const s of subs) {
      content.push(
        `<tr><td style="padding:6px; border-bottom:1px solid #f2f2f2;">${escHtml(s.subject)}</td><td style="padding:6px; border-bottom:1px solid #f2f2f2;">${s.marks}</td><td style="padding:6px; border-bottom:1px solid #f2f2f2;">${escHtml(s.grade)}</td></tr>`
      );
    }
    content.push(`</tbody></table>`);
    content.push(`</div>`);
  }

  content.push(`</div></div>`);
  const transcript = await Transcript.create({
    student: student._id,
    transcriptType: type,
    content: content.join(''),
    meta: { recordsCount: records.length },
  }).catch(() => null);

  return {
    transcriptId: transcript ? String(transcript._id) : '',
    transcriptNo,
    transcriptType: type,
    content: content.join(''),
  };
};

exports.exportAcademicData = async (studentId) => {
  await ensureSeedData();
  const { student, records, subjectsByRecord } = await fetchStudentWithRecords(studentId, {});
  const header = ['AcademicYear', 'Term', 'Subject', 'Marks', 'Grade', 'GPA'];
  const lines = [header.join(',')];
  const sorted = records.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  for (const r of sorted) {
    const subs = subjectsByRecord.get(String(r._id)) || [];
    for (const s of subs) {
      const vals = [r.academicYear, r.term, s.subject, s.marks, s.grade, r.gpa].map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`);
      lines.push(vals.join(','));
    }
  }
  return {
    student: { name: student.name, enrollmentId: student.enrollmentId },
    csv: lines.join('\n'),
  };
};

