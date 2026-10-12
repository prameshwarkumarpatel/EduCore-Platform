const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  contact: {
    phone: String,
    email: String
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);
