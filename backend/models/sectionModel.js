const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    className: { type: String, required: true, index: true },
    capacity: { type: Number, default: 40, min: 1, max: 200 },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
  },
  { timestamps: true }
);

sectionSchema.index({ name: 1, className: 1 }, { unique: true });

module.exports = mongoose.model('Section', sectionSchema);

