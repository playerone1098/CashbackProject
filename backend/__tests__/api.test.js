const request = require('supertest');
const app = require('../server');
const postgresDb = require('../db/postgres');

describe('API Endpoints - Always PostgreSQL with Mock Data', () => {
  let authToken;

  beforeAll(async () => {
    // Ensure PostgreSQL is initialized (local offline mode with mock data)
    await postgresDb.initLocalPostgres();
  });

  afterAll(async () => {
    if (postgresDb.getPool()) {
      await postgresDb.getPool().end();
    }
  });

  test('GET /api/status returns postgresql mode and connected database', async () => {
    const res = await request(app).get('/api/status');
    expect(res.status).toBe(200);
    expect(res.body.backend).toBe('Connected');
    expect(res.body.storageMode).toBe('postgresql-local');
    expect(res.body.database).toBe('Connected');
  });

  test('GET /api/deals returns seeded deals with pagination', async () => {
    const res = await request(app).get('/api/deals');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.deals)).toBe(true);
    expect(res.body.deals.length).toBeGreaterThan(0);
    expect(res.body.pagination).toBeDefined();
  });

  test('GET /api/categories returns seeded categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('POST /api/auth/login works with mock admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@cashback.com',
        password: 'admin123'
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('admin@cashback.com');
    expect(res.body.user.role).toBe('admin');
    authToken = res.body.token;
  });

  test('GET /api/analytics/stats returns metrics with valid admin token', async () => {
    const res = await request(app)
      .get('/api/analytics/stats')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.totalPageViews).toBeDefined();
    expect(res.body.dealViews).toBeDefined();
  });

  test('POST /api/deals creates a deal in PostgreSQL (admin only)', async () => {
    const newDeal = {
      title: 'Local PostgreSQL Deal - 30% Off',
      description: 'Exclusive deal running on local PostgreSQL',
      blogContent: 'Detailed content about cashback with offline PostgreSQL support.',
      category: 'shopping',
      store: { name: 'Postgres Local Store', website: 'https://postgresql.org' },
      discountType: 'percentage',
      discountValue: 30,
      originalPrice: 1000,
      discountedPrice: 700,
      expiryDate: new Date('2028-12-31').toISOString(),
      isActive: true,
      featured: true
    };

    const res = await request(app)
      .post('/api/deals')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newDeal);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe(newDeal.title);
  });

  test('GET /api/deals/stats returns stats from PostgreSQL', async () => {
    const res = await request(app).get('/api/deals/stats');
    expect(res.status).toBe(200);
    expect(res.body.activeDeals).toBeGreaterThan(0);
    expect(res.body.supportedStores).toBeGreaterThan(0);
  });
});
