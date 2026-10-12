const service = require('../services/workloadService');

exports.getWorkloadData = async (req, res, next) => {
  try {
    const out = await service.fetchWorkloadData(req.query || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.getTeachingHours = async (req, res, next) => {
  try {
    const out = await service.fetchTeachingHours(req.query || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.updateWorkload = async (req, res, next) => {
  try {
    const out = await service.updateWorkload(req.body || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.analyzeWorkload = async (req, res, next) => {
  try {
    const out = await service.analyzeWorkload(req.query || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.generateWorkloadReport = async (req, res, next) => {
  try {
    const out = await service.generateWorkloadReport(req.query || {});
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

