const express = require('express');
const Analytics = require('../models/Analytics');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Record a page view event (Public)
router.post('/page-view', async (req, res) => {
  try {
    const { path } = req.body;
    if (!path) {
      return res.status(400).json({ message: 'Path is required' });
    }

    const event = new Analytics({
      eventType: 'page_view',
      path
    });

    await event.save();
    res.status(201).json({ message: 'Page view recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch detailed aggregated metrics (Admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    // 1. Total Page Views
    const totalPageViews = await Analytics.countDocuments({ eventType: 'page_view' });

    // 2. Total Deal Views
    const totalDealViews = await Analytics.countDocuments({ eventType: 'deal_view' });

    // 3. Views Grouped by Page Route
    const pageViewsByPath = await Analytics.aggregate([
      { $match: { eventType: 'page_view' } },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // 4. Deal click/view leaderboard
    const dealViews = await Analytics.aggregate([
      { $match: { eventType: 'deal_view' } },
      { $group: {
          _id: { dealId: '$dealId', dealTitle: '$dealTitle' },
          count: { $sum: 1 }
        }
      },
      { $project: {
          dealId: '$_id.dealId',
          dealTitle: '$_id.dealTitle',
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // 5. Recent Activity (Latest 10 view events)
    const recentActivity = await Analytics.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('dealId', 'store.name originalPrice discountedPrice');

    res.json({
      totalPageViews,
      totalDealViews,
      pageViewsByPath,
      dealViews,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
