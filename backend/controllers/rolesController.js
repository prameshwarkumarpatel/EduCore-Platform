const rolesService = require('../services/rolesService');

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
}

exports.listRoles = async (req, res) => {
  try {
    const roles = await rolesService.listRoles({ search: req.query.search });
    res.status(200).json(roles);
  } catch (error) {
    sendError(res, error);
  }
};

exports.getRoleDetails = async (req, res) => {
  try {
    const role = await rolesService.getRoleById(req.params.id);
    res.status(200).json(role);
  } catch (error) {
    sendError(res, error);
  }
};

exports.createRole = async (req, res) => {
  try {
    const created = await rolesService.createRole(req.body);
    res.status(201).json({ message: 'Role created', data: created });
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateRole = async (req, res) => {
  try {
    const updated = await rolesService.updateRole(req.params.id, req.body);
    res.status(200).json({ message: 'Role updated', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await rolesService.deleteRole(req.params.id);
    res.status(200).json({ message: 'Role deleted' });
  } catch (error) {
    sendError(res, error);
  }
};

exports.fetchPermissions = async (req, res) => {
  try {
    const perms = await rolesService.fetchPermissions();
    res.status(200).json(perms);
  } catch (error) {
    sendError(res, error);
  }
};

exports.assignPermissions = async (req, res) => {
  try {
    const updated = await rolesService.assignPermissions(req.params.id, req.body.permissions || []);
    res.status(200).json({ message: 'Permissions updated', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

