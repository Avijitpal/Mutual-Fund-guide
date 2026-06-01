const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['LUMP_SUM', 'SIP'],
    required: true
  },
  purchaseNav: {
    type: Number,
    required: true
  },
  unitsAcquired: {
    type: Number,
    required: true
  },
  investedAmount: {
    type: Number,
    required: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  }
});

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fund: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fund',
    required: true
  },
  totalUnits: {
    type: Number,
    default: 0
  },
  totalInvested: {
    type: Number,
    default: 0
  },
  isAutoSipActive: {
    type: Boolean,
    default: false
  },
  sipAmount: {
    type: Number,
    default: 0
  },
  transactions: [TransactionSchema]
}, { timestamps: true });

// Index for ultra-fast user portfolio lookups during dashboard loads
PortfolioSchema.index({ user: 1, fund: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);