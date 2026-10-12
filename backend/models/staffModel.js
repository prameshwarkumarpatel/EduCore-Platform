const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    role: { type: String, enum: ['Teacher', 'Admin', 'Staff'], default: 'Teacher', index: true },
    roleType: { type: String, enum: ['Teacher', 'NonTeaching'], default: 'Teacher', index: true },
    department: { type: String, default: '', index: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    joiningDate: { type: Date },
    employeeId: { type: String, default: '', index: true },
    photoUrl: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active', index: true },
    assignedClasses: [{ type: String }],
    assignedSubjects: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);

