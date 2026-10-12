const mongoose = require('mongoose');

const medicalDocumentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    docType: { type: String, default: 'Certificate', index: true },
    fileName: { type: String, required: true, index: true },
    mimeType: { type: String, default: 'application/octet-stream' },
    dataUrl: { type: String, required: true }, // base64 data URL
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicalDocument', medicalDocumentSchema);

