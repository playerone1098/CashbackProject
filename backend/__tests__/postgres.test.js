const { newDb } = require('pg-mem');
const postgresDb = require('../db/postgres');
const User = require('../models/User');
const Deal = require('../models/Deal');
const Category = require('../models/Category');
const Analytics = require('../models/Analytics');

describe('PostgreSQL Database Adapter & Models', () => {
  let pool;

  beforeAll(async () => {
    const db = newDb();
    const { Pool } = db.adapters.createPg();
    pool = new Pool();

    const client = await pool.connect();
    try {
      await postgresDb.initPostgresTables(client);
      await postgresDb.seedMockData(client);
    } finally {
      client.release();
    }

    postgresDb.setPostgresPool(pool, true);
  });

  afterAll(async () => {
    if (pool) {
      await pool.end();
    }
  });

  test('isPostgresConnected returns true when pool is active', () => {
    expect(postgresDb.isPostgresConnected()).toBe(true);
  });

  test('User model finds seeded admin and verifies password', async () => {
    const admin = await User.findOne({ email: 'admin@cashback.com' });
    expect(admin).toBeDefined();
    expect(admin.email).toBe('admin@cashback.com');
    expect(admin.role).toBe('admin');

    const isValid = await admin.comparePassword('admin123');
    expect(isValid).toBe(true);

    const isInvalid = await admin.comparePassword('wrongpassword');
    expect(isInvalid).toBe(false);
  });

  test('Category model finds seeded categories and creates/deletes category', async () => {
    const categories = await Category.find().sort({ name: 1 });
    expect(categories.length).toBeGreaterThanOrEqual(10);
    expect(categories.some(c => c.name === 'shopping')).toBe(true);

    // Create a new category
    const newCat = new Category({ name: 'test-category' });
    await newCat.save();
    expect(newCat._id).toBeDefined();

    // Verify it exists
    const found = await Category.findOne({ name: 'test-category' });
    expect(found).not.toBeNull();
    expect(found.name).toBe('test-category');

    // Delete it
    const deleted = await Category.findByIdAndDelete(found._id);
    expect(deleted).not.toBeNull();

    const afterDelete = await Category.findOne({ name: 'test-category' });
    expect(afterDelete).toBeNull();
  });

  test('Deal model lists, searches, paginates, updates and counts deals', async () => {
    const totalDeals = await Deal.countDocuments();
    expect(totalDeals).toBeGreaterThanOrEqual(8);

    // Active deals
    const activeDeals = await Deal.find({ isActive: true });
    expect(activeDeals.length).toBeGreaterThanOrEqual(1);

    // Distinct stores
    const stores = await Deal.distinct('store.name', { isActive: true });
    expect(stores.length).toBeGreaterThan(0);
    expect(stores).toContain('SBI Card');

    // Search query
    const searchRes = await Deal.find({ search: 'SBI' });
    expect(searchRes.length).toBeGreaterThanOrEqual(1);
    expect(searchRes[0].title).toContain('SBI');

    // Pagination & sorting
    const paged = await Deal.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .skip(1);
    expect(paged.length).toBe(3);

    // Find by ID and update
    const firstDeal = activeDeals[0];
    const originalCount = firstDeal.clickCount;
    firstDeal.clickCount += 1;
    await firstDeal.save();

    const reloaded = await Deal.findById(firstDeal._id);
    expect(reloaded.clickCount).toBe(originalCount + 1);

    // Update via findByIdAndUpdate
    const updated = await Deal.findByIdAndUpdate(firstDeal._id, { title: 'Updated Deal Title' });
    expect(updated.title).toBe('Updated Deal Title');
  });

  test('Analytics tracks page views and deal views and aggregates', async () => {
    // Record page view
    await Analytics.create({
      eventType: 'page_view',
      path: '/deals/test-path'
    });

    const totalPageViews = await Analytics.countDocuments({ eventType: 'page_view' });
    expect(totalPageViews).toBeGreaterThan(0);

    // Aggregate page views
    const pageViewStats = await Analytics.aggregate([
      { $match: { eventType: 'page_view' } }
    ]);
    expect(pageViewStats.length).toBeGreaterThan(0);
    expect(pageViewStats[0]._id).toBeDefined();
    expect(pageViewStats[0].count).toBeGreaterThan(0);
  });
});
