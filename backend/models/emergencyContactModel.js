const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    name: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    relationship: { type: String, default: 'Guardian' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

emergencyContactSchema.index({ student: 1, name: 1 }, { unique: false });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);

