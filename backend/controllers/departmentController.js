const service = require('../services/departmentService');

exports.list = async (req, res, next) => {
  try {
    const data = await service.fetchDepartments({ search: req.query?.search });
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.details = async (req, res, next) => {
  try {
    const data = await service.fetchDepartmentDetails(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await service.createDepartment(req.body || {});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await service.updateDepartment(req.params.id, req.body || {});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const data = await service.deleteDepartment(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.assignStaff = async (req, res, next) => {
  try {
    const data = await service.assignStaffToDepartment(req.params.id, req.body || {});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.staffPool = async (req, res, next) => {
  try {
    const data = await service.fetchStaffForAssignment();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

