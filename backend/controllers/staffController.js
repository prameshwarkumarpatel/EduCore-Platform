const service = require('../services/staffService');

exports.getStaffStats = async (req, res, next) => {
  try {
    const out = await service.fetchStaffStats();
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getWorkload = async (req, res, next) => {
  try {
    const out = await service.fetchWorkload();
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getAttendance = async (req, res, next) => {
  try {
    const out = await service.fetchAttendance();
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getPayrollSummary = async (req, res, next) => {
  try {
    const out = await service.fetchPayrollSummary();
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getActivities = async (req, res, next) => {
  try {
    const out = await service.fetchActivities();
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getPendingTasks = async (req, res, next) => {
  try {
    const out = await service.fetchPendingTasks();
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getDepartments = async (req, res, next) => {
  try {
    const out = await service.fetchDepartments();
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.createStaff = async (req, res, next) => {
  try {
    const out = await service.createStaff(req.body || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.updateStaff = async (req, res, next) => {
  try {
    const out = await service.updateStaffRecord(req.params.id, req.body || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.uploadProfilePhoto = async (req, res, next) => {
  try {
    const out = await service.uploadProfilePhoto(req.params.id, req.body?.dataUrl);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

