const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    fee_type: {
      type: String,
      enum: ['Tuition', 'Transport', 'Hostel', 'Library', 'Extracurricular', 'Auto-ID Generation'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Overdue', 'Partial'],
      default: 'Unpaid',
    },
    payment_method: {
      type: String,
      enum: ['Cash', 'Card', 'Bank Transfer', 'Online Gateway', null],
      default: null,
    },
    transaction_id: {
      type: String,
    },
    paid_date: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Fee', feeSchema);
