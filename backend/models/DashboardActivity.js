const mongoose = require('mongoose');

const dashboardActivitySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    subject: { type: String, default: '' },
    type: { type: String, default: 'system', index: true }, // "student" | "finance" | "attendance" | "academic" | "system"
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DashboardActivity', dashboardActivitySchema);

