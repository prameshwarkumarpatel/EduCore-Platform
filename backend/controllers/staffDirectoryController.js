const service = require('../services/staffDirectoryService');

exports.list = async (req, res, next) => {
  try {
    const { search, roleType, department, status } = req.query;
    const out = await service.fetchStaffList({ search, roleType, department, status });
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.details = async (req, res, next) => {
  try {
    const out = await service.fetchStaffDetails(req.params.id);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.search = async (req, res, next) => {
  try {
    const out = await service.searchStaff({ query: req.query?.q || '' });
    res.json({ results: out });
  } catch (e) {
    next(e);
  }
};

exports.exportCsv = async (req, res, next) => {
  try {
    const { search, roleType, department, status } = req.query;
    const csv = await service.exportStaffData({ search, roleType, department, status });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="staff-directory.csv"');
    res.status(200).send(csv);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const out = await service.updateStaff(req.params.id, req.body || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const out = await service.deleteStaff(req.params.id);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

