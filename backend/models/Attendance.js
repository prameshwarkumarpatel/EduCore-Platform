const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    marked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The teacher who marked
    },
    records: [
      {
        student_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['Present', 'Absent', 'Late', 'Half-day'],
          required: true,
        },
        remarks: {
          type: String, // Reason for absence
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Ensure only one attendance record per class per day
attendanceSchema.index({ class_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
