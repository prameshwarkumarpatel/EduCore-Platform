const service = require('../services/subjectAllocationService');

exports.list = async (req, res, next) => {
  try {
    const data = await service.fetchAllocations({
      teacherId: req.query?.teacherId,
      className: req.query?.className,
      subjectId: req.query?.subjectId,
    });
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.meta = async (req, res, next) => {
  try {
    const data = await service.fetchMeta();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.workload = async (req, res, next) => {
  try {
    const data = await service.fetchTeacherWorkload();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await service.createAllocation(req.body || {});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await service.updateAllocation(req.params.id, req.body || {});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const data = await service.deleteAllocation(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.checkConflicts = async (req, res, next) => {
  try {
    const data = await service.checkConflicts(req.body || {});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

