const mongoose = require('mongoose');

const studentActivitySchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', index: true },
    type: { type: String, default: 'student', index: true }, // "student" | "attendance" | "academic" | "discipline"
    action: { type: String, required: true },
    subject: { type: String, default: '' },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low', index: true },
    createdAt: { type: Date, default: Date.now, index: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: false }
);

module.exports = mongoose.model('StudentActivity', studentActivitySchema);

