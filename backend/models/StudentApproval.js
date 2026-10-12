const mongoose = require('mongoose');

const studentApprovalSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    type: { type: String, enum: ['Leave', 'ProfileUpdate'], default: 'Leave', index: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', index: true },
    requestedAt: { type: Date, default: Date.now, index: true },
    details: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentApproval', studentApprovalSchema);

