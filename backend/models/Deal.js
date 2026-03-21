const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  blogContent: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['shopping', 'food', 'travel', 'entertainment', 'electronics', 'fashion', 'health', 'other']
  },
  store: {
    name: {
      type: String,
      required: true
    },
    logo: String,
    website: String
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'free-shipping', 'buy-one-get-one'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discountedPrice: {
    type: Number,
    min: 0
  },
  imageUrl: String,
  affiliateLink: String,
  couponCode: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  terms: String,
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  clickCount: {
    type: Number,
    default: 0
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for search functionality
dealSchema.index({ title: 'text', description: 'text', store: 'text' });

module.exports = mongoose.model('Deal', dealSchema);
