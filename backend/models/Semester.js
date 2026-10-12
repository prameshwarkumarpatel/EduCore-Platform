const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema(
  {
    academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true, index: true },
    name: { type: String, required: true }, // e.g. "Term 1", "Semester 2"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Semester', semesterSchema);

