const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    relationshipType: {
      type: String,
      enum: ['Father', 'Mother', 'Guardian'],
      default: 'Guardian',
      index: true,
    },
  },
  { timestamps: true }
);

relationshipSchema.index({ parent: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Relationship', relationshipSchema);
