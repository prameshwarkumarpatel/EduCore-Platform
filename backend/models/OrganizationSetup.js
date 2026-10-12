const mongoose = require('mongoose');

const orgSetupSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, index: true, default: 'default' },
    details: { type: Object, default: {} },
    hierarchy: { type: Array, default: [] },
    settings: { type: Array, default: [] },
    policies: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrganizationSetup', orgSetupSchema);

