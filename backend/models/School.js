const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  established_year: { type: Number },
  motto: { type: String },
  logo_url: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String, default: 'USA' }
  },
  branding: {
    primary_color: { type: String, default: '#3b82f6' },
    secondary_color: { type: String, default: '#10b981' }
  }
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);
