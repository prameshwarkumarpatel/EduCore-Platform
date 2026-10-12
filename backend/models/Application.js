const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: true },
    program: { type: String, required: true }, // e.g. "Grade 8", "B.Sc Computer Science"
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    submittedAt: { type: Date, default: Date.now, index: true },

    // Approval stage fields
    assignedClass: { type: String, default: '' },
    assignedSection: { type: String, default: '' },
    confirmationCode: { type: String, default: '' },
    decisionAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);

