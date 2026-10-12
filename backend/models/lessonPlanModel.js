const mongoose = require('mongoose');

const lessonPlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, default: '', index: true },
    teacherName: { type: String, default: '' },
    status: { type: String, enum: ['Draft', 'Submitted', 'Approved', 'Published'], default: 'Draft', index: true },
    weekNumber: { type: Number, default: 1 },
    plannedDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LessonPlan', lessonPlanSchema);
