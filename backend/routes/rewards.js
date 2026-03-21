const express = require('express');
const Reward = require('../models/Reward');
const Deal = require('../models/Deal');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get user rewards
router.get('/my', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const rewards = await Reward.find(query)
      .populate('deal', 'title store cashback')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Reward.countDocuments(query);

    res.json({
      rewards,
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

// Create new reward (when user clicks on deal)
router.post('/claim', auth, async (req, res) => {
  try {
    const { dealId, purchaseDate, transactionId } = req.body;

    // Check if deal exists and is active
    const deal = await Deal.findById(dealId);
    if (!deal || !deal.isActive) {
      return res.status(404).json({ message: 'Deal not found or inactive' });
    }

    // Check if already claimed
    const existingReward = await Reward.findOne({
      user: req.user._id,
      deal: dealId,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingReward) {
      return res.status(400).json({ message: 'Reward already claimed for this deal' });
    }

    // Calculate cashback
    let cashbackAmount;
    if (deal.cashbackType === 'percentage') {
      cashbackAmount = (deal.discountedPrice * deal.cashback) / 100;
    } else {
      cashbackAmount = deal.cashback;
    }

    // Create reward
    const reward = new Reward({
      user: req.user._id,
      deal: dealId,
      cashbackAmount,
      purchaseDate: purchaseDate || new Date(),
      transactionId
    });

    await reward.save();

    // Update user earnings
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'earnings.pendingCashback': cashbackAmount }
    });

    // Update deal redemption count
    await Deal.findByIdAndUpdate(dealId, {
      $inc: { redemptionCount: 1 }
    });

    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all rewards (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const rewards = await Reward.find(query)
      .populate('user', 'username email')
      .populate('deal', 'title store')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Reward.countDocuments(query);

    res.json({
      rewards,
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

// Update reward status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const reward = await Reward.findById(req.params.id).populate('user').populate('deal');
    
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    const oldStatus = reward.status;
    reward.status = status;
    reward.notes = notes;

    if (status === 'confirmed' && oldStatus !== 'confirmed') {
      reward.confirmationDate = new Date();
      
      // Update user earnings
      await User.findByIdAndUpdate(reward.user._id, {
        $inc: {
          'earnings.pendingCashback': -reward.cashbackAmount,
          'earnings.totalCashback': reward.cashbackAmount,
          'earnings.availableBalance': reward.cashbackAmount
        }
      });
    } else if (status === 'paid' && oldStatus !== 'paid') {
      reward.paymentDate = new Date();
    } else if (status === 'cancelled' && oldStatus === 'confirmed') {
      // Refund if was confirmed
      await User.findByIdAndUpdate(reward.user._id, {
        $inc: {
          'earnings.totalCashback': -reward.cashbackAmount,
          'earnings.availableBalance': -reward.cashbackAmount
        }
      });
    } else if (status === 'cancelled' && oldStatus === 'pending') {
      // Remove from pending
      await User.findByIdAndUpdate(reward.user._id, {
        $inc: { 'earnings.pendingCashback': -reward.cashbackAmount }
      });
    }

    await reward.save();
    res.json(reward);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reward statistics (admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Reward.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$cashbackAmount' }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
