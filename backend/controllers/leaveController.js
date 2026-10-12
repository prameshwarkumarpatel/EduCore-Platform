const service = require('../services/leaveService');

exports.filters = async (req, res, next) => {
  try {
    const out = await service.fetchFilters();
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.students = async (req, res, next) => {
  try {
    const out = await service.fetchStudents({ search: req.query?.search });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.requests = async (req, res, next) => {
  try {
    const { start, end, status, studentId } = req.query || {};
    const out = await service.fetchLeaveRequests({ start, end, status, studentId });
    res.json({ items: out });
  } catch (e) {
    next(e);
  }
};

exports.history = async (req, res, next) => {
  try {
    const { studentId, start, end } = req.query || {};
    const out = await service.fetchLeaveHistory({ studentId, start, end });
    res.json({ items: out });
  } catch (e) {
    next(e);
  }
};

exports.submit = async (req, res, next) => {
  try {
    const out = await service.submitLeaveRequest(req.body || {});
    res.status(201).json(out);
  } catch (e) {
    next(e);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const out = await service.approveLeave({ requestId, decisionNotes: req.body?.decisionNotes });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.reject = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const out = await service.rejectLeave({ requestId, decisionNotes: req.body?.decisionNotes });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.notifications = async (req, res, next) => {
  try {
    const out = await service.fetchNotifications({ studentId: req.query?.studentId });
    res.json({ items: out });
  } catch (e) {
    next(e);
  }
};

exports.notifyParent = async (req, res, next) => {
  try {
    const out = await service.notifyParent(req.body || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.reportGenerate = async (req, res, next) => {
  try {
    const out = await service.generateLeaveReport(req.body || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.reportExport = async (req, res, next) => {
  try {
    const { start, end, status, studentId } = req.query || {};
    const csv = await service.exportLeaveReportCsv({ start, end, status, studentId });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=\"leave-report.csv\"');
    res.status(200).send(csv);
  } catch (e) {
    next(e);
  }
};

