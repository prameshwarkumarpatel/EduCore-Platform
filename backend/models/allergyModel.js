const mongoose = require('mongoose');

const allergySchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    condition: { type: String, required: true, index: true },
    severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'], default: 'Mild', index: true },
    reaction: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

allergySchema.index({ student: 1, condition: 1 }, { unique: false });

module.exports = mongoose.model('Allergy', allergySchema);

