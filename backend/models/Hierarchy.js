const mongoose = require('mongoose');

const hierarchySchema = new mongoose.Schema({
  level_name: { type: String, required: true },
  parent_level: { type: mongoose.Schema.Types.ObjectId, ref: 'Hierarchy', default: null },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Hierarchy', hierarchySchema);
