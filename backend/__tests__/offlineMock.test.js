const postgresDb = require('../db/postgres');
const User = require('../models/User');
const Deal = require('../models/Deal');
const Category = require('../models/Category');
const Analytics = require('../models/Analytics');

describe('Local PostgreSQL Offline Mode with Mock Data (No boolean flag)', () => {
  beforeAll(async () => {
    // Initialize local in-memory PostgreSQL offline mode
    await postgresDb.initLocalPostgres();
  });

  afterAll(async () => {
    if (postgresDb.getPool()) {
      await postgresDb.getPool().end();
    }
  });

  test('isPostgresConnected is true and isLocalInMemory is true in offline mode', () => {
    expect(postgresDb.isPostgresConnected()).toBe(true);
    expect(postgresDb.isLocalInMemory()).toBe(true);
  });

  test('User model works with mock admin credentials in PostgreSQL', async () => {
    const admin = await User.findOne({ email: 'admin@cashback.com' });
    expect(admin).toBeDefined();
    expect(admin.email).toBe('admin@cashback.com');
    expect(admin.role).toBe('admin');

    const isValid = await admin.comparePassword('admin123');
    expect(isValid).toBe(true);
  });

  test('Categories are populated and queryable from PostgreSQL', async () => {
    const categories = await Category.find().sort({ name: 1 });
    expect(categories.length).toBeGreaterThanOrEqual(10);
    expect(categories.some(c => c.name === 'credit cards')).toBe(true);
  });

  test('Deals are populated, searchable, and pageable in PostgreSQL', async () => {
    const deals = await Deal.find({ isActive: true });
    expect(deals.length).toBeGreaterThanOrEqual(8);

    const sbiDeals = await Deal.find({ search: 'SBI' });
    expect(sbiDeals.length).toBeGreaterThan(0);

    const deal = await Deal.findById(deals[0]._id);
    expect(deal).not.toBeNull();
  });

  test('Analytics can record events and aggregate in PostgreSQL', async () => {
    await Analytics.create({
      eventType: 'page_view',
      path: '/deals'
    });

    const stats = await Analytics.aggregate([
      { $match: { eventType: 'page_view' } }
    ]);
    expect(stats.length).toBeGreaterThan(0);
  });
});
