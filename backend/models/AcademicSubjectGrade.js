const mongoose = require('mongoose');

const academicSubjectGradeSchema = new mongoose.Schema(
  {
    record: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicRecord', required: true, index: true },
    subject: { type: String, required: true, index: true },
    marks: { type: Number, required: true },
    percentage: { type: Number, required: false },
    grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F'], required: true, index: true },
  },
  { timestamps: true }
);

academicSubjectGradeSchema.index({ record: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('AcademicSubjectGrade', academicSubjectGradeSchema);

