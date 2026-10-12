const mongoose = require('mongoose');

const dashboardNotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, default: '' },
    type: { type: String, enum: ['system', 'alert', 'info'], default: 'info', index: true },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DashboardNotification', dashboardNotificationSchema);

