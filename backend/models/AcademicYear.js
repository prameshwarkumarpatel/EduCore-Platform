const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  year: { type: String, required: true, unique: true }, // e.g., "2026-2027"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  isActive: { type: Boolean, default: false, index: true },
  metadata: {
    notes: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('AcademicYear', academicYearSchema);
