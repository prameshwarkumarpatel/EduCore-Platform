const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, default: '', index: true },
    phone: { type: String, default: '', index: true },
    relationship: { type: String, default: 'Guardian', index: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active', index: true },
    photoUrl: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', index: true }],
  },
  { timestamps: true }
);

parentSchema.index({ email: 1, phone: 1 }, { unique: false });

module.exports = mongoose.model('Parent', parentSchema);

