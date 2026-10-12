const mongoose = require('mongoose');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const RolePermission = require('../models/RolePermission');

const DEFAULT_PERMISSIONS = [
  // module, action, key, label
  ['Dashboard', 'view', 'dashboard:view', 'View Dashboard'],
  ['Students', 'view', 'students:view', 'View Students'],
  ['Students', 'create', 'students:create', 'Create Students'],
  ['Students', 'edit', 'students:edit', 'Edit Students'],
  ['Students', 'delete', 'students:delete', 'Delete Students'],
  ['Teachers', 'view', 'teachers:view', 'View Teachers'],
  ['Teachers', 'create', 'teachers:create', 'Create Teachers'],
  ['Administration', 'view', 'admin:view', 'View Administration'],
  ['Administration', 'manage', 'admin:manage', 'Manage Administration'],
  ['Finance', 'view', 'finance:view', 'View Finance'],
  ['Finance', 'manage', 'finance:manage', 'Manage Finance'],
];

const DEFAULT_ROLES = [
  {
    name: 'Admin',
    description: 'Full system administrator with access to all modules.',
    modules: ['Dashboard', 'Students', 'Teachers', 'Administration', 'Finance'],
  },
  {
    name: 'Teacher',
    description: 'Faculty role focused on classes, students, and academic workflow.',
    modules: ['Dashboard', 'Students', 'Teachers'],
  },
  {
    name: 'Staff',
    description: 'Operational support staff with limited administration access.',
    modules: ['Dashboard', 'Students', 'Administration'],
  },
];

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

async function ensureDefaultPermissions() {
  const count = await Permission.countDocuments({});
  if (count > 0) return;
  await Permission.insertMany(
    DEFAULT_PERMISSIONS.map(([module, action, key, label]) => ({
      module,
      action,
      key,
      label,
    })),
    { ordered: false }
  ).catch(() => {});
}

async function ensureDefaultRoles() {
  const count = await Role.countDocuments({});
  if (count > 0) return;

  await ensureDefaultPermissions();
  const allPerms = await Permission.find({}).lean();

  const roleDocs = [];

  for (const base of DEFAULT_ROLES) {
    const permsForModules = allPerms.filter((p) => base.modules.includes(p.module));
    const permissionKeys = permsForModules.map((p) => p.key);
    roleDocs.push({
      name: base.name,
      description: base.description,
      modules: base.modules,
      permissions: permissionKeys,
    });
  }

  const createdRoles = await Role.insertMany(roleDocs, { ordered: false }).catch(() => []);

  // mirror into RolePermission for completeness
  for (const role of createdRoles) {
    const perms = allPerms.filter((p) => role.modules.includes(p.module));
    const mappings = perms.map((p) => ({
      role: role._id,
      permission: p._id,
      allowed: true,
    }));
    if (mappings.length) {
      await RolePermission.insertMany(mappings, { ordered: false }).catch(() => {});
    }
  }
}

function toPublicRole(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject({ virtuals: false }) : doc;
  const { _id, __v, ...rest } = obj;
  return { id: String(_id), ...rest };
}

exports.fetchPermissions = async () => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  await ensureDefaultPermissions();
  const docs = await Permission.find({}).sort({ module: 1, action: 1 }).lean();
  return docs.map((p) => {
    const { _id, __v, ...rest } = p;
    return { id: String(_id), ...rest };
  });
};

exports.listRoles = async ({ search } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  await ensureDefaultRoles();

  const query = {};
  if (search) {
    const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ name: re }, { description: re }, { modules: re }];
  }

  const docs = await Role.find(query).sort({ updatedAt: -1 }).lean();
  return docs.map((r) => {
    const { _id, __v, ...rest } = r;
    return { id: String(_id), ...rest };
  });
};

exports.getRoleById = async (id) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const doc = await Role.findById(id).lean();
  if (!doc) {
    const err = new Error('Role not found');
    err.statusCode = 404;
    throw err;
  }

  const { _id, __v, ...rest } = doc;
  return { id: String(_id), ...rest };
};

exports.createRole = async (payload = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  await ensureDefaultPermissions();

  const name = String(payload.name || '').trim();
  if (!name) {
    const err = new Error('Role name is required');
    err.statusCode = 400;
    throw err;
  }

  const exists = await Role.exists({ name });
  if (exists) {
    const err = new Error('Role name already exists');
    err.statusCode = 409;
    throw err;
  }

  const modules = Array.isArray(payload.modules) ? payload.modules : [];
  const permissions = Array.isArray(payload.permissions) ? payload.permissions : [];
  const restrictions = payload.restrictions || {};

  const created = await Role.create({
    name,
    description: payload.description || '',
    modules,
    permissions,
    restrictions: {
      branches: restrictions.branches || [],
      notes: restrictions.notes || '',
    },
  });

  return toPublicRole(created);
};

exports.updateRole = async (id, payload = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const update = {};

  if (payload.name != null) {
    update.name = String(payload.name).trim();
  }
  if (payload.description != null) {
    update.description = String(payload.description || '');
  }
  if (payload.modules != null) {
    update.modules = Array.isArray(payload.modules) ? payload.modules : [];
  }
  if (payload.permissions != null) {
    update.permissions = Array.isArray(payload.permissions) ? payload.permissions : [];
  }
  if (payload.restrictions != null) {
    update.restrictions = {
      branches: payload.restrictions.branches || [],
      notes: payload.restrictions.notes || '',
    };
  }

  if (update.name) {
    const dupe = await Role.exists({ _id: { $ne: id }, name: update.name });
    if (dupe) {
      const err = new Error('Role name already exists');
      err.statusCode = 409;
      throw err;
    }
  }

  const updated = await Role.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!updated) {
    const err = new Error('Role not found');
    err.statusCode = 404;
    throw err;
  }
  return toPublicRole(updated);
};

exports.deleteRole = async (id) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const deleted = await Role.findByIdAndDelete(id);
  if (!deleted) {
    const err = new Error('Role not found');
    err.statusCode = 404;
    throw err;
  }
  await RolePermission.deleteMany({ role: id }).catch(() => {});
  return { success: true };
};

exports.assignPermissions = async (id, permissionKeys = []) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const uniqueKeys = Array.from(new Set(permissionKeys));
  const allPerms = await Permission.find({ key: { $in: uniqueKeys } }).lean();
  const permsByKey = new Map(allPerms.map((p) => [p.key, p]));

  // update Role.permissions shortcut
  const updated = await Role.findByIdAndUpdate(
    id,
    { permissions: uniqueKeys },
    { new: true, runValidators: true }
  );
  if (!updated) {
    const err = new Error('Role not found');
    err.statusCode = 404;
    throw err;
  }

  // update RolePermission join table
  await RolePermission.deleteMany({ role: id });
  const roleId = updated._id;

  const mappings = uniqueKeys
    .map((key) => permsByKey.get(key))
    .filter(Boolean)
    .map((perm) => ({
      role: roleId,
      permission: perm._id,
      allowed: true,
    }));

  if (mappings.length) {
    await RolePermission.insertMany(mappings, { ordered: false }).catch(() => {});
  }

  return toPublicRole(updated);
};

