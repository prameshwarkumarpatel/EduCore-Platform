const service = require('../services/staffAttendanceService');

exports.markAttendance = async (req, res, next) => {
  try {
    const out = await service.markAttendance(req.body || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getDaily = async (req, res, next) => {
  try {
    const out = await service.fetchDailyAttendance(req.query || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getMonthly = async (req, res, next) => {
  try {
    const out = await service.fetchMonthlyAttendance(req.query || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const out = await service.generateAttendanceReport(req.query || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getLeaveData = async (req, res, next) => {
  try {
    const out = await service.fetchLeaveData(req.query || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getAlerts = async (req, res, next) => {
  try {
    const out = await service.fetchAbsenteeAlerts(req.query || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getMeta = async (req, res, next) => {
  try {
    const out = await service.fetchMeta();
    res.json(out);
  } catch (e) {
    next(e);
  }
};
