const mongoose = require('mongoose');

const idCardSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['Student', 'Teacher', 'Staff'],
      required: true,
    },
    unique_id_number: {
      type: String,
      required: true,
      unique: true, // e.g. SCH2026-001
    },
    qr_code_url: {
      type: String,
    },
    template_format: {
      type: String,
      default: 'Standard',
    },
    issue_date: {
      type: Date,
      default: Date.now,
    },
    valid_until: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Lost', 'Reissued'],
      default: 'Active',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('IdCard', idCardSchema);
