const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'BehaviorIncident', index: true },
    channel: { type: String, enum: ['Email', 'SMS', 'Push'], default: 'SMS', index: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Sent', 'Failed'], default: 'Pending', index: true },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ParentNotification', notificationSchema);

