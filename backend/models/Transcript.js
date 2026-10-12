const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    transcriptType: { type: String, enum: ['Official', 'Student Copy'], default: 'Official', index: true },
    content: { type: String, required: true }, // HTML/text content
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transcript', transcriptSchema);

