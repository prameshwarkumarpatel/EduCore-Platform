const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "students:view"
    module: { type: String, required: true }, // e.g. "Students"
    action: { type: String, required: true }, // e.g. "view"
    label: { type: String, required: true }, // e.g. "View Students"
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Permission', permissionSchema);

