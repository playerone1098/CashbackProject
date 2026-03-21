const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: true
  },
  cashbackAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'paid', 'cancelled'],
    default: 'pending'
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  confirmationDate: Date,
  paymentDate: Date,
  transactionId: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Reward', rewardSchema);
