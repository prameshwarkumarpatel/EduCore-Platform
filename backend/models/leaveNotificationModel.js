const mongoose = require('mongoose');

const leaveNotificationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    leaveRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'LeaveRequest', index: true },
    channel: { type: String, enum: ['Email', 'SMS', 'Push'], default: 'SMS', index: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Sent', 'Failed'], default: 'Pending', index: true },
    sentAt: { type: Date },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

leaveNotificationSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('LeaveNotification', leaveNotificationSchema);

