const service = require('../services/approvalService');

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
}

exports.queue = async (req, res) => {
  try {
    const data = await service.fetchApprovalQueue({ search: req.query.search, status: req.query.status });
    res.status(200).json(data);
  } catch (e) {
    sendError(res, e);
  }
};

exports.review = async (req, res) => {
  try {
    const data = await service.fetchApplicationReview(req.params.id);
    res.status(200).json(data);
  } catch (e) {
    sendError(res, e);
  }
};

exports.classes = async (req, res) => {
  try {
    const data = await service.fetchClasses();
    res.status(200).json(data);
  } catch (e) {
    sendError(res, e);
  }
};

exports.assign = async (req, res) => {
  try {
    const data = await service.assignClassSection(req.params.id, req.body);
    res.status(200).json({ message: 'Assigned', data });
  } catch (e) {
    sendError(res, e);
  }
};

exports.approve = async (req, res) => {
  try {
    const data = await service.approveApplication(req.params.id, { remarks: req.body.remarks });
    res.status(200).json({ message: 'Approved', data });
  } catch (e) {
    sendError(res, e);
  }
};

exports.reject = async (req, res) => {
  try {
    const data = await service.rejectApplication(req.params.id, { remarks: req.body.remarks });
    res.status(200).json({ message: 'Rejected', data });
  } catch (e) {
    sendError(res, e);
  }
};

exports.confirmation = async (req, res) => {
  try {
    const data = await service.generateConfirmation(req.params.id);
    res.status(200).json({ message: 'Confirmation generated', data });
  } catch (e) {
    sendError(res, e);
  }
};

exports.notify = async (req, res) => {
  try {
    const data = await service.sendNotification(req.params.id, req.body);
    res.status(200).json({ message: 'Notification logged', data });
  } catch (e) {
    sendError(res, e);
  }
};

exports.history = async (req, res) => {
  try {
    const data = await service.fetchApprovalHistory(req.params.id);
    res.status(200).json(data);
  } catch (e) {
    sendError(res, e);
  }
};

