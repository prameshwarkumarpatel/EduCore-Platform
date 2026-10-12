const service = require('../services/attendanceService');

function getDate(req) {
  const raw = req.query?.date;
  const d = raw ? new Date(raw) : new Date();
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

function getRange(req) {
  const start = req.query?.start ? new Date(req.query.start) : null;
  const end = req.query?.end ? new Date(req.query.end) : null;
  const now = new Date();
  const startD = start && !Number.isNaN(start.getTime()) ? new Date(start) : new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
  const endD = end && !Number.isNaN(end.getTime()) ? new Date(end) : now;
  startD.setHours(0, 0, 0, 0);
  endD.setHours(23, 59, 59, 999);
  return { startD, endD };
}

exports.filters = async (req, res, next) => {
  try {
    const out = await service.fetchFilters();
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.students = async (req, res, next) => {
  try {
    const { assignedClass, assignedSection } = req.query || {};
    const out = await service.fetchStudentsForMarking({ assignedClass, assignedSection });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.logs = async (req, res, next) => {
  try {
    const date = getDate(req);
    if (!date) {
      const err = new Error('Invalid date');
      err.statusCode = 400;
      throw err;
    }
    const { assignedClass, assignedSection } = req.query || {};
    const out = await service.fetchDailyLogs({
      date,
      assignedClass,
      assignedSection,
    });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.summary = async (req, res, next) => {
  try {
    const { startD, endD } = getRange(req);
    const { assignedClass, assignedSection } = req.query || {};
    const out = await service.fetchAttendanceSummary({ startD, endD, assignedClass, assignedSection });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.trends = async (req, res, next) => {
  try {
    const { startD, endD } = getRange(req);
    const { assignedClass, assignedSection, period } = req.query || {};
    const out = await service.fetchTrends({ startD, endD, assignedClass, assignedSection, period: period || 'weekly' });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.lowAlerts = async (req, res, next) => {
  try {
    const { startD, endD } = getRange(req);
    const threshold = Number(req.query?.threshold ?? 75);
    const { assignedClass, assignedSection } = req.query || {};
    const out = await service.fetchLowAttendanceAlerts({ startD, endD, threshold, assignedClass, assignedSection });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.report = async (req, res, next) => {
  try {
    const { startD, endD } = getRange(req);
    const { assignedClass, assignedSection } = req.query || {};
    const csv = await service.generateReportCsv({ startD, endD, assignedClass, assignedSection });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="attendance-report.csv"');
    res.status(200).send(csv);
  } catch (e) {
    next(e);
  }
};

exports.mark = async (req, res, next) => {
  try {
    const { date, assignedClass, assignedSection, records } = req.body || {};
    if (!date) {
      const err = new Error('date is required');
      err.statusCode = 400;
      throw err;
    }
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) {
      const err = new Error('Invalid date');
      err.statusCode = 400;
      throw err;
    }
    d.setHours(0, 0, 0, 0);
    const out = await service.markAttendance({
      date: d,
      assignedClass: assignedClass || '',
      assignedSection: assignedSection || '',
      records: Array.isArray(records) ? records : [],
    });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

