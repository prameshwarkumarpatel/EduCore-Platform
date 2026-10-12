const service = require('../services/documentVerificationService');

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
}

exports.listDocuments = async (req, res) => {
  try {
    const docs = await service.fetchDocuments({
      search: req.query.search,
      status: req.query.status,
      type: req.query.type,
    });
    res.status(200).json(docs);
  } catch (error) {
    sendError(res, error);
  }
};

exports.getDocumentDetails = async (req, res) => {
  try {
    const doc = await service.fetchDocumentDetails(req.params.id);
    res.status(200).json(doc);
  } catch (error) {
    sendError(res, error);
  }
};

exports.approveDocument = async (req, res) => {
  try {
    const updated = await service.setStatus(req.params.id, 'Verified', req.body.remarks || '');
    res.status(200).json({ message: 'Document verified', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

exports.rejectDocument = async (req, res) => {
  try {
    const updated = await service.setStatus(req.params.id, 'Rejected', req.body.remarks || '');
    res.status(200).json({ message: 'Document rejected', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateVerificationStatus = async (req, res) => {
  try {
    const updated = await service.setStatus(req.params.id, req.body.status, req.body.remarks || '');
    res.status(200).json({ message: 'Verification status updated', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

exports.addRemarks = async (req, res) => {
  try {
    const updated = await service.addRemarks(req.params.id, req.body.remarks || '');
    res.status(200).json({ message: 'Remarks updated', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

exports.pendingAlerts = async (req, res) => {
  try {
    const alerts = await service.fetchPendingAlerts();
    res.status(200).json(alerts);
  } catch (error) {
    sendError(res, error);
  }
};

