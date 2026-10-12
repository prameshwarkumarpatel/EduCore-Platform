const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    date: { type: Date, required: true, index: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present', index: true },
    assignedClass: { type: String, default: '' },
    assignedSection: { type: String, default: '' },
    remarks: { type: String, default: '' },
    meta: { type: Object, default: {} }, // kept for backward compatibility
  },
  { timestamps: true }
);

studentAttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StudentAttendance', studentAttendanceSchema);

