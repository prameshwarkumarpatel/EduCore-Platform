const mongoose = require('mongoose');

const academicRecordSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    academicYear: { type: String, required: true, index: true }, // e.g. "2025-2026"
    term: { type: String, required: true, index: true }, // e.g. "Semester 1"
    gpa: { type: Number, required: true, index: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

academicRecordSchema.index({ student: 1, academicYear: 1, term: 1 }, { unique: true });

module.exports = mongoose.model('AcademicRecord', academicRecordSchema);

