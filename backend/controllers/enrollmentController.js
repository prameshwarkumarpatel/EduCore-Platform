const enrollmentService = require('../services/enrollmentService');

function pickFilters(req) {
  return {
    search: req.query.search || '',
    assignedClass: req.query.class || '',
    assignedSection: req.query.section || '',
    status: req.query.status || '',
  };
}

exports.listEnrollments = async (req, res, next) => {
  try {
    const list = await enrollmentService.fetchEnrolledStudents(pickFilters(req));
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.generateId = async (req, res, next) => {
  try {
    const out = await enrollmentService.generateEnrollmentId();
    res.json(out);
  } catch (err) {
    next(err);
  }
};

exports.convert = async (req, res, next) => {
  try {
    const { applicationId } = req.body || {};
    if (!applicationId) return res.status(400).json({ message: 'applicationId is required' });
    const created = await enrollmentService.convertApplicationToStudent(applicationId);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.assign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await enrollmentService.assignClassSection(id, req.body || {});
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.classes = async (req, res, next) => {
  try {
    const list = await enrollmentService.fetchClasses();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.exportCsv = async (req, res, next) => {
  try {
    const csv = await enrollmentService.exportEnrollmentData(pickFilters(req));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="enrollments.csv"');
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};

