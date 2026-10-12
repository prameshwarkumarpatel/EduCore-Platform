const mongoose = require('mongoose');

const immunizationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    vaccineName: { type: String, required: true, index: true },
    status: { type: String, enum: ['Completed', 'Pending'], default: 'Pending', index: true },
    administeredDate: { type: Date },
    dose: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

immunizationSchema.index({ student: 1, vaccineName: 1 }, { unique: false });

module.exports = mongoose.model('Immunization', immunizationSchema);

