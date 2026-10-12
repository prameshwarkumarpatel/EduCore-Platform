const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema(
  {
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], required: true },
    remarks: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.model('Verification', verificationSchema);

