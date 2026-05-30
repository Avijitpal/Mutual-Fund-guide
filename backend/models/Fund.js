const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  schemeCode: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  schemeName: {
    type: String,
    required: true,
    index: true // Enables high-speed text matching
  },
  fundHouse: { type: String, trim: true },
  category: {
    type: String,
    enum: ['Equity', 'Debt', 'Hybrid', 'Other'],
    required: true,
    index: true
  },
  subCategory: String,
  nav: { type: Number, default: 0 },
  navDate: Date,
  returns: {
    oneMonth: { type: Number, default: 0 },
    threeMonth: { type: Number, default: 0 },
    sixMonth: { type: Number, default: 0 },
    oneYear: { type: Number, default: 0 },
    threeYear: { type: Number, default: 0 },
    fiveYear: { type: Number, default: 0 }
  },
  expenseRatio: { type: Number, default: 0 },
  aum: { type: Number, default: 0 }, // Assets Under Management
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Very High'],
    default: 'Moderate'
  }
}, { timestamps: true });

// Compound Index: Optimizes pages displaying specific fund categories sorted by high returns
fundSchema.index({ category: 1, 'returns.oneYear': -1 });

module.exports = mongoose.model('Fund', fundSchema);