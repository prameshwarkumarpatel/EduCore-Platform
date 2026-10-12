const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Applicant', applicantSchema);

