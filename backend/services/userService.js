const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

const DEFAULT_ROLES = [
  { name: 'Admin', permissions: ['users:read', 'users:write'] },
  { name: 'Teacher', permissions: ['classes:read'] },
  { name: 'Staff', permissions: ['attendance:read'] },
  { name: 'Student', permissions: [] },
  { name: 'Parent', permissions: [] },
];

function isDbConnected() {
  return mongoose.connection?.readyState === 1;
}

function toPublicUser(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject({ virtuals: false }) : doc;
  const { _id, password, __v, ...rest } = obj;
  return { id: String(_id), ...rest };
}

function normalize(str) {
  return String(str || '').trim().toLowerCase();
}

async function ensureDefaultRoles() {
  const count = await Role.countDocuments({});
  if (count > 0) return;
  await Role.insertMany(DEFAULT_ROLES, { ordered: false }).catch(() => {});
}

async function assertRoleValid(roleName) {
  const role = String(roleName || '').trim();
  if (!role) {
    const err = new Error('Invalid role');
    err.statusCode = 400;
    throw err;
  }
  const exists = await Role.exists({ name: role });
  if (!exists) {
    const err = new Error('Invalid role');
    err.statusCode = 400;
    throw err;
  }
  return role;
}

function generateTempPassword() {
  return crypto.randomBytes(10).toString('base64url');
}

exports.listRoles = async () => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  await ensureDefaultRoles();
  const roles = await Role.find({}).sort({ name: 1 }).lean();
  return roles.map((r) => ({ id: String(r._id), name: r.name, permissions: r.permissions || [] }));
};

exports.listUsers = async ({ search, role, status } = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const q = normalize(search);
  const roleFilter = String(role || '').trim();
  const statusFilter = normalize(status); // active | inactive

  const query = {};
  if (q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ name: re }, { email: re }, { phone: re }, { role: re }];
  }
  if (roleFilter) query.role = roleFilter;
  if (statusFilter) query.isActive = statusFilter === 'active';

  const docs = await User.find(query).sort({ updatedAt: -1 }).lean();
  return docs.map((d) => {
    const { _id, password, __v, ...rest } = d;
    return { id: String(_id), ...rest };
  });
};

exports.getUserById = async (id) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const doc = await User.findById(id).lean();
  if (!doc) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  const { _id, password, __v, ...rest } = doc;
  return { id: String(_id), ...rest };
};

exports.createUser = async (payload = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  await ensureDefaultRoles();

  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const role = await assertRoleValid(payload.role || 'Student');

  if (!name || !email) {
    const err = new Error('Name and email are required');
    err.statusCode = 400;
    throw err;
  }

  const exists = await User.exists({ email });
  if (exists) {
    const err = new Error('Email already exists');
    err.statusCode = 409;
    throw err;
  }

  // Admin UI doesn't provide password; generate a temp one so auth can work later.
  const plain = payload.password ? String(payload.password) : generateTempPassword();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plain, salt);

  const created = await User.create({
    name,
    email,
    phone,
    role,
    isActive: payload.isActive ?? true,
    profile: {
      address: payload.profile?.address || '',
      avatarUrl: payload.profile?.avatarUrl || '',
      bio: payload.profile?.bio || '',
    },
    password: hashedPassword,
  });

  return toPublicUser(created);
};

exports.updateUser = async (id, payload = {}) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }

  const update = {};
  if (payload.name != null) update.name = String(payload.name).trim();
  if (payload.email != null) update.email = String(payload.email).trim().toLowerCase();
  if (payload.phone != null) update.phone = String(payload.phone).trim();
  if (payload.isActive != null) update.isActive = Boolean(payload.isActive);

  if (payload.role != null) {
    update.role = await assertRoleValid(payload.role);
  }

  if (payload.profile != null) {
    update.profile = {
      address: payload.profile.address,
      avatarUrl: payload.profile.avatarUrl,
      bio: payload.profile.bio,
    };
    Object.keys(update.profile).forEach((k) => update.profile[k] == null && delete update.profile[k]);
  }

  // uniqueness check when changing email
  if (update.email) {
    const dupe = await User.exists({ _id: { $ne: id }, email: update.email });
    if (dupe) {
      const err = new Error('Email already exists');
      err.statusCode = 409;
      throw err;
    }
  }

  const updated = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!updated) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return toPublicUser(updated);
};

exports.deleteUser = async (id) => {
  if (!isDbConnected()) {
    const err = new Error('Database not connected');
    err.statusCode = 503;
    throw err;
  }
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return { success: true };
};

exports.toggleUserStatus = async (id, isActive) => {
  return exports.updateUser(id, { isActive: Boolean(isActive) });
};

exports.assignUserRole = async (id, role) => {
  return exports.updateUser(id, { role });
};

