const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g. "Grade 6"
    sections: [{ type: String }], // e.g. ["A","B"]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);
