const express = require('express');
const { body, validationResult } = require('express-validator');
const Deal = require('../models/Deal');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all deals (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const deals = await Deal.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Deal.countDocuments(query);

    res.json({
      deals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all deals for admin (including inactive)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 10 } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const deals = await Deal.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Deal.countDocuments(query);

    res.json({
      deals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get deal stats (public)
router.get('/stats', async (req, res) => {
  try {
    const activeDeals = await Deal.countDocuments({ isActive: true });
    const uniqueStores = await Deal.distinct('store.name', { isActive: true });
    res.json({
      activeDeals,
      supportedStores: uniqueStores.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get deal by ID
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal || !deal.isActive) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Increment click count
    deal.clickCount += 1;
    await deal.save();

    // Log the deal_view event historically
    try {
      const Analytics = require('../models/Analytics');
      await Analytics.create({
        eventType: 'deal_view',
        path: `/deals/${deal._id}`,
        dealId: deal._id,
        dealTitle: deal.title
      });
    } catch (analyticsError) {
      console.error('Failed to log analytics event:', analyticsError);
    }

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new deal (admin only)
router.post('/', adminAuth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('blogContent').notEmpty().withMessage('Blog content is required'),
  body('category').custom(async (value) => {
    const Category = require('../models/Category');
    const cleanName = value.trim().toLowerCase();
    const exists = await Category.findOne({ name: cleanName });
    if (!exists) {
      throw new Error('Invalid category selected');
    }
    return true;
  }),
  body('store.name').notEmpty().withMessage('Store name is required'),
  body('discountType').isIn(['percentage', 'fixed', 'free-shipping', 'buy-one-get-one']),
  body('discountValue').custom((value, { req }) => {
    if (req.body.discountType === 'free-shipping' || req.body.discountType === 'buy-one-get-one') {
      return true; // Skip validation for these types
    }
    if (value === undefined || value === null || value === '') {
      throw new Error('Discount value is required');
    }
    if (isNaN(value) || Number(value) < 0) {
      throw new Error('Discount value must be a positive number');
    }
    return true;
  }),
  body('couponCode').optional(),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const deal = new Deal(req.body);
    await deal.save();

    res.status(201).json(deal);
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update deal (admin only)
router.put('/:id', adminAuth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('blogContent').optional().notEmpty().withMessage('Blog content cannot be empty'),
  body('category').optional().custom(async (value) => {
    const Category = require('../models/Category');
    const cleanName = value.trim().toLowerCase();
    const exists = await Category.findOne({ name: cleanName });
    if (!exists) {
      throw new Error('Invalid category selected');
    }
    return true;
  }),
  body('store.name').optional().notEmpty().withMessage('Store name cannot be empty'),
  body('discountType').optional().isIn(['percentage', 'fixed', 'free-shipping', 'buy-one-get-one']),
  body('discountValue').optional().isNumeric().withMessage('Discount value must be a number'),
  body('couponCode').optional(),
  body('expiryDate').optional().isISO8601().withMessage('Valid expiry date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json(deal);
  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Patch deal for partial updates (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete deal (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const Category = require('../models/Category');
    const categories = await Category.find().sort({ name: 1 });
    if (!categories || categories.length === 0) {
      return res.json(['shopping', 'food', 'travel', 'entertainment', 'electronics', 'fashion', 'health', 'credit cards', 'upi apps', 'other']);
    }
    res.json(categories.map(c => c.name));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
