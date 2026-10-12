const userService = require('../services/userService');

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
}

exports.listUsers = async (req, res) => {
  try {
    const users = await userService.listUsers({
      search: req.query.search,
      role: req.query.role,
      status: req.query.status,
    });
    res.status(200).json(users);
  } catch (error) {
    sendError(res, error);
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    sendError(res, error);
  }
};

exports.addUser = async (req, res) => {
  try {
    const created = await userService.createUser(req.body);
    res.status(201).json({ message: 'User created', data: created });
  } catch (error) {
    sendError(res, error);
  }
};

exports.editUser = async (req, res) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ message: 'User updated', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

exports.removeUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    sendError(res, error);
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const updated = await userService.toggleUserStatus(req.params.id, req.body.isActive);
    res.status(200).json({ message: 'Status updated', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

exports.assignRole = async (req, res) => {
  try {
    const updated = await userService.assignUserRole(req.params.id, req.body.role);
    res.status(200).json({ message: 'Role assigned', data: updated });
  } catch (error) {
    sendError(res, error);
  }
};

exports.listRoles = async (req, res) => {
  try {
    const roles = await userService.listRoles();
    res.status(200).json(roles);
  } catch (error) {
    sendError(res, error);
  }
};

