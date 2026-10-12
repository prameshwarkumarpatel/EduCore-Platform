const service = require('../services/communicationService');

exports.getMessages = async (req, res, next) => {
  try {
    const data = await service.fetchMessages(req.params.parentId, {
      channel: req.query?.channel,
      from: req.query?.from,
      to: req.query?.to,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getCalls = async (req, res, next) => {
  try {
    const data = await service.fetchCalls(req.params.parentId, {
      from: req.query?.from,
      to: req.query?.to,
      status: req.query?.status,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const data = await service.fetchNotifications(req.params.parentId, {
      from: req.query?.from,
      to: req.query?.to,
      severity: req.query?.severity,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { channel, message, severity } = req.body || {};
    const data = await service.sendMessageToParent(req.params.parentId, { channel, message, severity });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.broadcast = async (req, res, next) => {
  try {
    const { parentIds, channel, message, severity } = req.body || {};
    const data = await service.broadcastMessage({ parentIds, channel, message, severity });
    res.json({ inserted: Array.isArray(data) ? data.length : 0, items: data });
  } catch (err) {
    next(err);
  }
};

