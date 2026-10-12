const trackingService = require('../services/applicationTrackingService');
const admissionsService = require('../services/admissionsService');

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
}

exports.listApplications = async (req, res) => {
  try {
    const { search, status, from, to, sort } = req.query;
    const apps = await trackingService.fetchApplications({ search, status, from, to, sort });
    res.status(200).json(apps);
  } catch (error) {
    sendError(res, error);
  }
};

exports.getApplicationDetails = async (req, res) => {
  try {
    const app = await trackingService.fetchApplicationDetails(req.params.id);
    res.status(200).json(app);
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

