const mongoose = require('mongoose');

const staffLeaveSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true, index: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    reason: { type: String, default: '', index: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Approved', index: true },
  },
  { timestamps: true }
);

staffLeaveSchema.index({ staff: 1, startDate: -1, status: 1 });

module.exports = mongoose.model('StaffLeave', staffLeaveSchema);
