const mongoose = require('mongoose');

const lockSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true, index: true },
    lockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AttendanceDayLock', lockSchema);
