const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo_url: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  registration_number: { type: String },
  established_year: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
