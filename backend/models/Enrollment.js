const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, index: true, unique: true },
    enrollmentId: { type: String, required: true, unique: true },
    assignedClass: { type: String, default: '' },
    assignedSection: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Enrolled', 'Inactive'], default: 'Enrolled', index: true },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema);

