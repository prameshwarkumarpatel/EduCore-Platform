const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true, index: true },
    date: { type: Date, required: true, index: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Leave'], default: 'Present', index: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StaffAttendance', attendanceSchema);

