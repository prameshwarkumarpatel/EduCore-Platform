const mongoose = require('mongoose');

const approvalHistorySchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    action: { type: String, required: true }, // "ASSIGN", "APPROVE", "REJECT", "CONFIRM", "NOTIFY"
    status: { type: String, default: '' }, // resulting status if applicable
    remarks: { type: String, default: '' },
    meta: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

module.exports = mongoose.model('ApprovalHistory', approvalHistorySchema);

