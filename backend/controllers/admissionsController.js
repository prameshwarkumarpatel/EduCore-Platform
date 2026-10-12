const admissionsService = require('../services/admissionsService');

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
}

exports.getDashboardData = async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await admissionsService.fetchSummary({ from, to });
    res.status(200).json(data);
  } catch (error) {
    sendError(res, error);
  }
};

exports.createApplication = async (req, res) => {
  try {
    const created = await admissionsService.createApplication(req.body);
    res.status(201).json({ message: 'Application created', data: created });
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const updated = await admissionsService.updateApplicationStatus(req.params.id, req.body.status);
    res.status(200).json({ message: 'Status updated', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};


