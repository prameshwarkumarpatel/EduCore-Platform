const service = require('../services/academicHistoryService');

function rangeFromReq(req) {
  return { start: req.query.start, end: req.query.end };
}

exports.gpa = async (req, res, next) => {
  try {
    const data = await service.fetchGPA(req.params.studentId, rangeFromReq(req));
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.grades = async (req, res, next) => {
  try {
    const data = await service.fetchGrades(req.params.studentId, rangeFromReq(req));
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.subjects = async (req, res, next) => {
  try {
    const data = await service.fetchSubjectPerformance(req.params.studentId, rangeFromReq(req));
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.history = async (req, res, next) => {
  try {
    const data = await service.fetchAcademicHistory(req.params.studentId, rangeFromReq(req));
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.dashboard = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const range = rangeFromReq(req);
    const [gpa, grades, subjects, history] = await Promise.all([
      service.fetchGPA(studentId, range),
      service.fetchGrades(studentId, range),
      service.fetchSubjectPerformance(studentId, range),
      service.fetchAcademicHistory(studentId, range),
    ]);
    const trend = (history?.history || []).slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((r) => ({ x: `${r.academicYear} ${r.term}`, gpa: r.gpa }));
    res.json({ gpa, grades, subjects, history, trend });
  } catch (e) {
    next(e);
  }
};

exports.generateTranscript = async (req, res, next) => {
  try {
    const data = await service.generateTranscript(req.params.studentId, req.body || {});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.export = async (req, res, next) => {
  try {
    const out = await service.exportAcademicData(req.params.studentId);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="academic-history.csv"');
    res.status(200).send(out.csv);
  } catch (e) {
    next(e);
  }
};

