const service = require('../services/studentFormService');

exports.classes = async (req, res, next) => {
  try {
    const list = await service.fetchClasses();
    res.json(list);
  } catch (e) {
    next(e);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const out = await service.fetchStudentDetails(req.params.id);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { mode, ...payload } = req.body || {};
    const out = await service.createStudent({ payload, mode: mode || 'confirm' });
    res.status(201).json(out);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { mode, ...payload } = req.body || {};
    const out = await service.updateStudent(req.params.id, { payload, mode: mode || 'confirm' });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    const out = await service.uploadProfilePhoto(req.params.id, { dataUrl: req.body?.dataUrl });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.validate = async (req, res, next) => {
  try {
    const { mode, ...payload } = req.body || {};
    const out = await service.validateStudentForm({ payload, mode: mode || 'confirm' });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

