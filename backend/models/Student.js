const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    guardian: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    enrollmentId: { type: String, unique: true, sparse: true },
    assignedClass: { type: String, default: '' },
    assignedSection: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Pending', 'Inactive'], default: 'Active', index: true },
    photoUrl: { type: String, default: '' }, // data URL or hosted URL
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);

