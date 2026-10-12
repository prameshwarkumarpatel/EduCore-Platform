const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, default: '', index: true },
    fileType: { type: String, default: 'PDF' },
    uploadedBy: { type: String, default: '' },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
