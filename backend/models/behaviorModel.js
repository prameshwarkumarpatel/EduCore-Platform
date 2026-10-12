const mongoose = require('mongoose');

const behaviorIncidentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    category: { type: String, required: true, index: true }, // e.g. 'Disruption'
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true, index: true },
    remarks: { type: String, default: '' },
    notes: { type: String, default: '' }, // teacher/admin extra notes
    status: { type: String, enum: ['Open', 'Resolved'], default: 'Open', index: true },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

behaviorIncidentSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('BehaviorIncident', behaviorIncidentSchema);

