const service = require('../services/studentProfileService');

exports.getProfile = async (req, res, next) => {
  try {
    const out = await service.fetchProfile(req.params.id);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const out = await service.updateProfile(req.params.id, req.body || {});
    res.json(out);
  } catch (e) {
    next(e);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    const out = await service.uploadPhoto(req.params.id, req.body?.dataUrl);
    res.json(out);
  } catch (e) {
    next(e);
  }
};

