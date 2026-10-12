const service = require('../services/directoryService');

function pickFilters(req) {
  return {
    search: req.query.search || '',
    assignedClass: req.query.class || '',
    assignedSection: req.query.section || '',
    status: req.query.status || '',
  };
}

exports.listStudents = async (req, res, next) => {
  try {
    const list = await service.fetchStudents(pickFilters(req));
    res.json(list);
  } catch (e) {
    next(e);
  }
};

exports.getStudentProfile = async (req, res, next) => {
  try {
    const profile = await service.fetchStudentProfile(req.params.id);
    res.json(profile);
  } catch (e) {
    next(e);
  }
};

exports.filters = async (req, res, next) => {
  try {
    const out = await service.fetchFilters();
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.exportCsv = async (req, res, next) => {
  try {
    const csv = await service.exportDirectoryCsv(pickFilters(req));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=\"student-directory.csv\"');
    res.status(200).send(csv);
  } catch (e) {
    next(e);
  }
};

