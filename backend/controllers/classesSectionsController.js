const service = require('../utils/classesSectionsService');

exports.dashboard = async (req, res, next) => {
  try {
    res.json(
      await service.fetchDashboard({
        className: req.query?.className,
        sectionName: req.query?.sectionName,
        search: req.query?.search,
      })
    );
  } catch (e) {
    next(e);
  }
};

exports.createClass = async (req, res, next) => {
  try {
    res.json(await service.createClass(req.body || {}));
  } catch (e) {
    next(e);
  }
};

exports.updateClass = async (req, res, next) => {
  try {
    res.json(await service.updateClass(req.params.id, req.body || {}));
  } catch (e) {
    next(e);
  }
};

exports.deleteClass = async (req, res, next) => {
  try {
    res.json(await service.deleteClass(req.params.id));
  } catch (e) {
    next(e);
  }
};

exports.createSection = async (req, res, next) => {
  try {
    res.json(await service.createSection(req.body || {}));
  } catch (e) {
    next(e);
  }
};

exports.updateSection = async (req, res, next) => {
  try {
    res.json(await service.updateSection(req.params.id, req.body || {}));
  } catch (e) {
    next(e);
  }
};

exports.deleteSection = async (req, res, next) => {
  try {
    res.json(await service.deleteSection(req.params.id));
  } catch (e) {
    next(e);
  }
};

exports.assignClassTeacher = async (req, res, next) => {
  try {
    res.json(await service.assignClassTeacher(req.body || {}));
  } catch (e) {
    next(e);
  }
};

exports.updateSectionCapacity = async (req, res, next) => {
  try {
    res.json(await service.updateSectionCapacity(req.body || {}));
  } catch (e) {
    next(e);
  }
};
