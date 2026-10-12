const mongoose = require('mongoose');

const branchUserAssignmentSchema = new mongoose.Schema({
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['Student', 'Teacher', 'Staff', 'Admin'] },
  assigned_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('BranchUserAssignment', branchUserAssignmentSchema);
