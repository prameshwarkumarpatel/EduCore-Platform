const mongoose = require('mongoose');
const StudentAttendance = require('../models/StudentAttendance');
const Student = require('../models/Student');
const ClassModel = require('../models/Class');

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

function normalizeDate(d) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function toPublicStudent(s) {
  const obj = s.toObject ? s.toObject({ virtuals: false }) : s;
  return {
    id: String(obj._id),
    enrollmentId: obj.enrollmentId || '',
    name: obj.name,
    email: obj.email || '',
    phone: obj.phone || '',
    assignedClass: obj.assignedClass || '',
    assignedSection: obj.assignedSection || '',
    status: obj.status || 'Active',
    photoUrl: obj.photoUrl || '',
  };
}

async function fetchStudentIds({ assignedClass, assignedSection } = {}) {
  const query = {};
  if (assignedClass) query.assignedClass = assignedClass;
  if (assignedSection) query.assignedSection = assignedSection;
  query.status = 'Active';
  const rows = await Student.find(query).select('_id').lean();
  return rows.map((r) => r._id);
}

async function ensureSeedDataIfEmpty() {
  assertDbConnected();
  const count = await StudentAttendance.countDocuments({});
  if (count > 0) return;

  const students = await Student.find({ status: 'Active' }).limit(50).lean();
  if (!students.length) return;

  const days = 45;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const statuses = ['Present', 'Absent', 'Late'];
  const rows = [];
  for (const st of students) {
    for (let i = 0; i < days; i += 1) {
      const day = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const r = Math.random();
      let status = 'Present';
      if (r < 0.12) status = 'Absent';
      else if (r < 0.24) status = 'Late';

      rows.push({
        student: st._id,
        date: day,
        status,
        assignedClass: st.assignedClass || '',
        assignedSection: st.assignedSection || '',
        remarks: '',
      });
    }
  }

  // best effort: insert many
  await StudentAttendance.insertMany(rows, { ordered: false }).catch(() => {});
}

exports.fetchFilters = async () => {
  assertDbConnected();
  const classes = await ClassModel.find({}).sort({ name: 1 }).lean();
  const classNames = classes.map((c) => c.name);
  const sectionSet = new Set();
  classes.forEach((c) => (c.sections || []).forEach((s) => sectionSet.add(s)));
  const sections = Array.from(sectionSet.values()).sort();
  return { classes: classNames, sections };
};

exports.fetchStudentsForMarking = async ({ assignedClass, assignedSection } = {}) => {
  assertDbConnected();
  const query = { status: 'Active' };
  if (assignedClass) query.assignedClass = assignedClass;
  if (assignedSection) query.assignedSection = assignedSection;
  const rows = await Student.find(query).sort({ name: 1 }).lean();
  return rows.map((s) => toPublicStudent(s));
};

exports.fetchDailyLogs = async ({ date, assignedClass, assignedSection } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const studentIds = await fetchStudentIds({ assignedClass, assignedSection });
  const students = studentIds.length
    ? await Student.find({ _id: { $in: studentIds } }).lean()
    : [];

  const map = new Map();
  if (studentIds.length) {
    const dateStart = normalizeDate(date);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);
    const rows = await StudentAttendance.find({
      student: { $in: studentIds },
      date: { $gte: dateStart, $lt: dateEnd },
    }).lean();
    rows.forEach((r) => {
      map.set(String(r.student), r.status);
    });
  }

  return students
    .slice()
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
    .map((s) => ({
      ...toPublicStudent(s),
      attendance: map.has(String(s._id)) ? map.get(String(s._id)) : 'Unmarked',
    }));
};

exports.fetchAttendanceSummary = async ({ startD, endD, assignedClass, assignedSection } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const studentIds = await fetchStudentIds({ assignedClass, assignedSection });
  if (!studentIds.length) return { attendedPct: 0, present: 0, late: 0, absent: 0, total: 0 };

  const rows = await StudentAttendance.aggregate([
    {
      $match: {
        student: { $in: studentIds },
        date: { $gte: startD, $lte: endD },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const by = Object.fromEntries(rows.map((r) => [r._id, r.count]));
  const present = by.Present || 0;
  const late = by.Late || 0;
  const absent = by.Absent || 0;
  const total = present + late + absent;
  const attended = present + late;
  const attendedPct = total ? Math.round((attended / total) * 1000) / 10 : 0;
  return { attendedPct, present, late, absent, total };
};

exports.fetchTrends = async ({ startD, endD, assignedClass, assignedSection, period = 'weekly' } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const studentIds = await fetchStudentIds({ assignedClass, assignedSection });
  if (!studentIds.length) return { period, points: [] };

  // group by day
  const dayRows = await StudentAttendance.aggregate([
    {
      $match: {
        student: { $in: studentIds },
        date: { $gte: startD, $lte: endD },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
        late: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
      },
    },
  ]);

  const byDay = new Map(dayRows.map((r) => [r._id._id, r]));

  const points = [];
  if (period === 'monthly') {
    // bucket by YYYY-MM
    const cur = new Date(startD);
    cur.setDate(1);
    cur.setHours(0, 0, 0, 0);
    const end = new Date(endD);
    end.setHours(0, 0, 0, 0);

    const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    let d = new Date(cur);
    while (d <= end) {
      const key = monthKey(d);
      const next = new Date(d);
      next.setMonth(next.getMonth() + 1);
      next.setDate(1);

      let present = 0;
      let late = 0;
      let absent = 0;

      const cursor = new Date(d);
      while (cursor < next && cursor <= end) {
        const k = cursor.toISOString().slice(0, 10);
        const row = byDay.get(k);
        if (row) {
          present += row.present;
          late += row.late;
          absent += row.absent;
        }
        cursor.setDate(cursor.getDate() + 1);
      }

      const total = present + late + absent;
      const attended = present + late;
      const attendedPct = total ? Math.round((attended / total) * 1000) / 10 : 0;
      points.push({ x: key, attendedPct });

      d = next;
    }
  } else {
    // weekly buckets: Monday-start-ish (simple: every 7 days window from start)
    const totalDays = Math.max(1, Math.round((endD.getTime() - startD.getTime()) / (24 * 60 * 60 * 1000)));
    const weeks = Math.max(1, Math.ceil(totalDays / 7));
    for (let w = 0; w < weeks; w += 1) {
      const wkStart = new Date(startD.getTime() + w * 7 * 24 * 60 * 60 * 1000);
      const wkEnd = new Date(wkStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);

      let present = 0;
      let late = 0;
      let absent = 0;

      const cursor = new Date(wkStart);
      while (cursor <= wkEnd && cursor <= endD) {
        const k = cursor.toISOString().slice(0, 10);
        const row = byDay.get(k);
        if (row) {
          present += row.present;
          late += row.late;
          absent += row.absent;
        }
        cursor.setDate(cursor.getDate() + 1);
      }

      const total = present + late + absent;
      const attended = present + late;
      const attendedPct = total ? Math.round((attended / total) * 1000) / 10 : 0;
      points.push({ x: `W${w + 1}`, attendedPct });
    }
  }

  return { period, points };
};

exports.fetchLowAttendanceAlerts = async ({ startD, endD, threshold, assignedClass, assignedSection } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const t = Number.isFinite(Number(threshold)) ? Number(threshold) : 75;
  const studentIds = await fetchStudentIds({ assignedClass, assignedSection });
  if (!studentIds.length) return { threshold: t, items: [] };

  const agg = await StudentAttendance.aggregate([
    {
      $match: {
        student: { $in: studentIds },
        date: { $gte: startD, $lte: endD },
      },
    },
    {
      $group: {
        _id: '$student',
        present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
        late: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
      },
    },
    {
      $project: {
        total: { $add: ['$present', { $add: ['$late', '$absent'] }] },
        attended: { $add: ['$present', '$late'] },
        present: 1,
        late: 1,
        absent: 1,
      },
    },
  ]);

  const items = agg
    .map((r) => {
      const total = r.total || 0;
      const attendedPct = total ? Math.round(((r.attended || 0) / total) * 1000) / 10 : 0;
      return {
        studentId: String(r._id),
        attendedPct,
        present: r.present || 0,
        late: r.late || 0,
        absent: r.absent || 0,
      };
    })
    .filter((x) => x.attendedPct < t)
    .sort((a, b) => a.attendedPct - b.attendedPct)
    .slice(0, 10);

  const students = items.length
    ? await Student.find({ _id: { $in: items.map((x) => x.studentId) } }).lean()
    : [];
  const byId = new Map(students.map((s) => [String(s._id), s]));

  return {
    threshold: t,
    items: items.map((it) => {
      const s = byId.get(it.studentId);
      return {
        id: it.studentId,
        name: s?.name || 'Student',
        enrollmentId: s?.enrollmentId || '',
        assignedClass: s?.assignedClass || '',
        assignedSection: s?.assignedSection || '',
        attendedPct: it.attendedPct,
        status: it.attendedPct < 60 ? 'High' : it.attendedPct < 70 ? 'Medium' : 'Low',
      };
    }),
  };
};

exports.generateReportCsv = async ({ startD, endD, assignedClass, assignedSection } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const studentIds = await fetchStudentIds({ assignedClass, assignedSection });
  if (!studentIds.length) return 'StudentName,EnrollmentID,Class,Section,Date,Status\n';

  const rows = await StudentAttendance.find({
    student: { $in: studentIds },
    date: { $gte: startD, $lte: endD },
  })
    .populate('student')
    .sort({ date: 1 })
    .lean();

  const header = ['StudentName', 'EnrollmentID', 'Class', 'Section', 'Date', 'Status'];
  const lines = [header.join(',')];
  for (const r of rows) {
    const s = r.student || {};
    const dateStr = r.date ? new Date(r.date).toISOString().slice(0, 10) : '';
    const vals = [
      s.name || '',
      s.enrollmentId || '',
      s.assignedClass || '',
      s.assignedSection || '',
      dateStr,
      r.status || '',
    ].map((v) => `"${String(v).replaceAll('"', '""')}"`);
    lines.push(vals.join(','));
  }
  return lines.join('\n');
};

exports.markAttendance = async ({ date, assignedClass, assignedSection, records = [] } = {}) => {
  await ensureSeedDataIfEmpty();
  assertDbConnected();
  const normalized = normalizeDate(date);

  if (!records.length) {
    const err = new Error('records is required');
    err.statusCode = 400;
    throw err;
  }

  // Resolve student ids
  const resolved = [];
  for (const rec of records) {
    const studentIdOrEnrollmentId = rec.studentId || rec.studentIdOrEnrollmentId || rec.id || rec.enrollmentId;
    if (!studentIdOrEnrollmentId) continue;

    const s = await Student.findOne(resolveQuery(studentIdOrEnrollmentId)).select('_id').lean();
    if (!s) continue;
    resolved.push({ student: s._id, status: rec.status, remarks: rec.remarks || '' });
  }

  if (!resolved.length) {
    const err = new Error('No valid student records to mark.');
    err.statusCode = 400;
    throw err;
  }

  const allowed = new Set(['Present', 'Absent', 'Late']);
  const updates = resolved.map((r) => {
    const st = allowed.has(r.status) ? r.status : 'Present';
    return {
      student: r.student,
      date: normalized,
      assignedClass: assignedClass || '',
      assignedSection: assignedSection || '',
      status: st,
      remarks: r.remarks || '',
    };
  });

  const results = await Promise.all(
    updates.map((u) =>
      StudentAttendance.findOneAndUpdate(
        { student: u.student, date: u.date },
        {
          $set: {
            status: u.status,
            assignedClass: u.assignedClass,
            assignedSection: u.assignedSection,
            remarks: u.remarks,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );

  return { markedCount: results.length };
};

