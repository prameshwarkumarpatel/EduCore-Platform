const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', index: true },
    channel: { type: String, enum: ['SMS', 'Email', 'Push', 'Call'], default: 'SMS', index: true },
    type: { type: String, enum: ['Message', 'Call', 'Update'], default: 'Message', index: true },
    direction: { type: String, enum: ['Incoming', 'Outgoing'], default: 'Outgoing', index: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Sent', 'Failed'], default: 'Pending', index: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low', index: true },
    meta: { type: Object, default: {} },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

communicationSchema.index({ parent: 1, createdAt: -1 });
communicationSchema.index({ type: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('ParentCommunication', communicationSchema);
