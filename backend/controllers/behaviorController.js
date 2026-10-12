const service = require('../services/behaviorService');

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
    const { search } = req.query || {};
    const out = await service.fetchStudents({ search });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.incidents = async (req, res, next) => {
  try {
    const { start, end, severity, studentId } = req.query || {};
    const out = await service.fetchIncidents({ start, end, severity, studentId });
    res.json({ incidents: out });
  } catch (e) {
    next(e);
  }
};

exports.history = async (req, res, next) => {
  try {
    const { studentId, start, end } = req.query || {};
    const out = await service.fetchBehaviorHistory({ studentId, start, end });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.logIncident = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const out = await service.logIncident(payload);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.notifications = async (req, res, next) => {
  try {
    const { studentId } = req.query || {};
    const out = await service.fetchNotifications({ studentId });
    res.json({ items: out });
  } catch (e) {
    next(e);
  }
};

exports.notifyParent = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const out = await service.notifyParent(payload);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.generateReport = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const out = await service.generateBehaviorReport(payload);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.exportReport = async (req, res, next) => {
  try {
    const { start, end, severity, studentId } = req.query || {};
    const csv = await service.exportBehaviorReportCsv({ start, end, severity, studentId });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="behavior-report.csv"');
    res.status(200).send(csv);
  } catch (e) {
    next(e);
  }
};

