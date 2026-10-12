const mongoose = require('mongoose');

const subjectAllocationSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true, index: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    className: { type: String, required: true, index: true },
    section: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

subjectAllocationSchema.index({ teacher: 1, subject: 1, className: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('SubjectAllocation', subjectAllocationSchema);

