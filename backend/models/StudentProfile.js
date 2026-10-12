const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    admission_number: {
      type: String,
      required: true,
      unique: true,
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    blood_group: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    photo_url: {
      type: String,
      default: '',
    },
    address: {
      type: String,
    },
    emergency_contact: {
      type: String,
    },
    enrollment_status: {
      type: String,
      enum: ['Active', 'Graduated', 'Suspended', 'Transferred'],
      default: 'Active',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
