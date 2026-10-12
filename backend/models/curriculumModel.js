const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    gradeOrClass: { type: String, default: '', index: true },
    totalUnits: { type: Number, default: 0 },
    completedUnits: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'InProgress', 'Completed'], default: 'InProgress', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Curriculum', curriculumSchema);
