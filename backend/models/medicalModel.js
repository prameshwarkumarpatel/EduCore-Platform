const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    recordType: { type: String, default: 'General', index: true }, // e.g. General, Diagnosis, Treatment
    title: { type: String, required: true, index: true }, // e.g. Asthma
    date: { type: Date, required: true, index: true },
    treatment: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

medicalHistorySchema.index({ student: 1, date: -1 });

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);

