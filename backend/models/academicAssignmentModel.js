const mongoose = require('mongoose');

const academicAssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, default: '', index: true },
    className: { type: String, default: '', index: true },
    dueDate: { type: Date },
    totalStudents: { type: Number, default: 0 },
    submittedCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Published', 'Closed'], default: 'Published', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AcademicAssignment', academicAssignmentSchema);
