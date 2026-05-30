const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['page_view', 'deal_view'],
    default: 'page_view',
    required: true
  },
  path: {
    type: String,
    required: true
  },
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal'
  },
  dealTitle: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for super-fast aggregation and statistics retrieval
analyticsSchema.index({ eventType: 1, createdAt: -1 });
analyticsSchema.index({ path: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
