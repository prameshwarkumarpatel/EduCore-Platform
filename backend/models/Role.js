const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  permissions: [{ type: String }], // list of permission keys for quick lookup
  modules: [{ type: String }], // high-level modules this role can access
  restrictions: {
    branches: [{ type: String }],
    notes: { type: String, default: '' },
  },
  active_users: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
