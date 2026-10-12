const parentService = require('../services/parentService');

exports.getStats = async (req, res, next) => {
  try {
    const data = await parentService.fetchParentStats();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getLinkedStudents = async (req, res, next) => {
  try {
    const data = await parentService.fetchLinkedStudents();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getRecentActivities = async (req, res, next) => {
  try {
    const data = await parentService.fetchRecentActivities();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getCommunicationSummary = async (req, res, next) => {
  try {
    const data = await parentService.fetchCommunicationSummary();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getPendingRequests = async (req, res, next) => {
  try {
    const data = await parentService.fetchPendingRequests();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getAlerts = async (req, res, next) => {
  try {
    const data = await parentService.fetchAlerts();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const q = req.query?.q;
    const data = await parentService.searchParents({ query: q });
    res.json({ results: data });
  } catch (err) {
    next(err);
  }
};

exports.getDirectoryList = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const data = await parentService.fetchParentsForDirectory({ search, status });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getParentDetails = async (req, res, next) => {
  try {
    const data = await parentService.fetchParentDetails(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.exportDirectory = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const csv = await parentService.exportParentDirectoryCsv({ search, status });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="parent-directory.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

exports.deleteParent = async (req, res, next) => {
  try {
    await parentService.deleteParent(req.params.id);
    res.json({ status: 'success', deleted: true });
  } catch (err) {
    next(err);
  }
};

exports.updateParentProfile = async (req, res, next) => {
  try {
    const data = await parentService.updateParentProfile(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

