const academicYearService = require('../services/academicYearService');

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
}

exports.listYears = async (req, res) => {
  try {
    const years = await academicYearService.listAcademicYears({ search: req.query.search });
    res.status(200).json(years);
  } catch (error) {
    sendError(res, error);
  }
};

exports.getYearDetails = async (req, res) => {
  try {
    const year = await academicYearService.getAcademicYearById(req.params.id);
    res.status(200).json(year);
  } catch (error) {
    sendError(res, error);
  }
};

exports.createYear = async (req, res) => {
  try {
    const created = await academicYearService.createAcademicYear(req.body);
    res.status(201).json({ message: 'Academic year created', data: created });
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateYear = async (req, res) => {
  try {
    const updated = await academicYearService.updateAcademicYear(req.params.id, req.body);
    res.status(200).json({ message: 'Academic year updated', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

exports.deleteYear = async (req, res) => {
  try {
    await academicYearService.deleteAcademicYear(req.params.id);
    res.status(200).json({ message: 'Academic year deleted' });
  } catch (error) {
    sendError(res, error);
  }
};

exports.configureSemesters = async (req, res) => {
  try {
    const updated = await academicYearService.configureSemesters(req.params.id, req.body.semesters || []);
    res.status(200).json({ message: 'Semesters updated', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const updated = await academicYearService.toggleAcademicYearStatus(req.params.id, req.body.isActive);
    res.status(200).json({ message: 'Status updated', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

