const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    type: { type: String, required: true }, // e.g. "ID Proof", "Birth Certificate"
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' }, // for preview (pdf/image URL). Can be empty initially.
    uploadedAt: { type: Date, default: Date.now, index: true },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    remarks: { type: String, default: '' },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);

