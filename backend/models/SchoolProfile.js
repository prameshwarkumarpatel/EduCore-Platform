const mongoose = require('mongoose');

const schoolProfileSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, index: true, default: 'default' },
    name: { type: String, default: '' },
    established_year: { type: Number },
    motto: { type: String, default: '' },
    logo_url: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    address: { type: Object, default: {} },
    branding: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SchoolProfile', schoolProfileSchema);

