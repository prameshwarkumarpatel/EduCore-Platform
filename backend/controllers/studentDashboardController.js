const service = require('../services/studentDashboardService');

exports.getDashboard = async (req, res, next) => {
  try {
    const data = await service.fetchDashboard({ start: req.query.start, end: req.query.end });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

