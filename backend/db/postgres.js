const { Pool } = require('pg');
const { newDb } = require('pg-mem');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const localDb = require('./localStore');

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

let pool = null;
let isConnected = false;
let isLocal = false;
let initPromise = null;

function isPostgresConnected() {
  return isConnected && pool !== null;
}

function isLocalInMemory() {
  return isLocal;
}

function getPool() {
  return pool;
}

function setPostgresPool(customPool, connected = true, local = false) {
  pool = customPool;
  isConnected = connected;
  isLocal = local;
}

function getPostgresConfig() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URI ||
    process.env.PG_URI;

  if (connectionString) {
    const isSsl =
      process.env.PGSSL === 'true' ||
      connectionString.includes('sslmode=require') ||
      connectionString.includes('neon.tech') ||
      connectionString.includes('supabase.co') ||
      connectionString.includes('render.com');

    return {
      connectionString,
      ssl: isSsl ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 1500
    };
  }

  if (process.env.PGHOST || process.env.PGDATABASE) {
    return {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT, 10) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'cashback',
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 1500
    };
  }

  return null;
}

async function initLocalPostgres() {
  try {
    const db = newDb();
    const { Pool: MemPool } = db.adapters.createPg();
    const memPool = new MemPool();
    const client = await memPool.connect();
    try {
      await initPostgresTables(client);
      await seedMockData(client);
    } finally {
      client.release();
    }
    pool = memPool;
    isConnected = true;
    isLocal = true;
    return true;
  } catch (err) {
    console.error('Failed to initialize local PostgreSQL:', err);
    return false;
  }
}

// Start PostgreSQL initialization
ensurePostgres();

async function initPostgresTables(client) {
  const schemaSql = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      profile JSONB DEFAULT '{}'::jsonb,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS deals (
      id VARCHAR(64) PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      blog_content TEXT NOT NULL,
      category VARCHAR(255) NOT NULL,
      store JSONB NOT NULL DEFAULT '{}'::jsonb,
      discount_type VARCHAR(50) DEFAULT 'percentage',
      discount_value NUMERIC DEFAULT 0,
      original_price NUMERIC DEFAULT 0,
      discounted_price NUMERIC DEFAULT 0,
      image_url TEXT,
      affiliate_link TEXT,
      coupon_code VARCHAR(100),
      expiry_date TIMESTAMPTZ NOT NULL,
      terms TEXT,
      is_active BOOLEAN DEFAULT true,
      featured BOOLEAN DEFAULT false,
      click_count INTEGER DEFAULT 0,
      tags JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS analytics (
      id VARCHAR(64) PRIMARY KEY,
      event_type VARCHAR(50) NOT NULL,
      path TEXT NOT NULL,
      deal_id VARCHAR(64),
      deal_title TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_deals_is_active ON deals (is_active);
    CREATE INDEX IF NOT EXISTS idx_deals_category ON deals (category);
    CREATE INDEX IF NOT EXISTS idx_deals_featured ON deals (featured);
    CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics (event_type);
  `;

  await client.query(schemaSql);
}

async function seedMockData(client) {
  const catCountRes = await client.query('SELECT COUNT(*)::int AS count FROM categories');
  if (catCountRes.rows[0].count === 0) {
    for (const cat of localDb.store.categories) {
      await client.query(
        `INSERT INTO categories (id, name, created_at, updated_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (name) DO NOTHING`,
        [cat._id, cat.name, cat.createdAt || new Date(), cat.updatedAt || new Date()]
      );
    }
  }

  const adminRes = await client.query('SELECT id FROM users WHERE email = $1', ['admin@cashback.com']);
  if (adminRes.rows.length === 0) {
    const admin = localDb.store.users.find(u => u.email === 'admin@cashback.com');
    if (admin) {
      await client.query(
        `INSERT INTO users (id, username, email, password, role, profile, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (email) DO NOTHING`,
        [
          admin._id,
          admin.username,
          admin.email,
          admin.password,
          admin.role || 'admin',
          JSON.stringify(admin.profile || {}),
          admin.isActive !== false,
          admin.createdAt || new Date(),
          admin.updatedAt || new Date()
        ]
      );
    }
  }

  const dealCountRes = await client.query('SELECT COUNT(*)::int AS count FROM deals');
  if (dealCountRes.rows[0].count === 0) {
    for (const d of localDb.store.deals) {
      await client.query(
        `INSERT INTO deals (
           id, title, description, blog_content, category, store, discount_type,
           discount_value, original_price, discounted_price, image_url, affiliate_link,
           coupon_code, expiry_date, terms, is_active, featured, click_count, tags,
           created_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
         ON CONFLICT (id) DO NOTHING`,
        [
          d._id,
          d.title,
          d.description,
          d.blogContent || d.description,
          d.category,
          JSON.stringify(d.store || {}),
          d.discountType || 'percentage',
          d.discountValue || 0,
          d.originalPrice || 0,
          d.discountedPrice || 0,
          d.imageUrl || '',
          d.affiliateLink || '',
          d.couponCode || null,
          d.expiryDate || new Date('2028-12-31'),
          d.terms || '',
          d.isActive !== false,
          !!d.featured,
          d.clickCount || 0,
          JSON.stringify(d.tags || []),
          d.createdAt || new Date(),
          d.updatedAt || new Date()
        ]
      );
    }
  }

  const analyticsCountRes = await client.query('SELECT COUNT(*)::int AS count FROM analytics');
  if (analyticsCountRes.rows[0].count === 0 && localDb.store.analytics.length > 0) {
    for (const a of localDb.store.analytics) {
      await client.query(
        `INSERT INTO analytics (id, event_type, path, deal_id, deal_title, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [
          a._id,
          a.eventType,
          a.path,
          a.dealId || null,
          a.dealTitle || null,
          a.createdAt || new Date(),
          a.updatedAt || new Date()
        ]
      );
    }
  }
}

function ensurePostgres(customConfig = null) {
  if (!initPromise) {
    initPromise = (async () => {
      const config = customConfig || getPostgresConfig();
      if (config) {
        try {
          const newPool = new Pool(config);
          const client = await newPool.connect();
          try {
            await client.query('SELECT 1');
            await initPostgresTables(client);
            await seedMockData(client);
            pool = newPool;
            isConnected = true;
            isLocal = false;
            console.log(`Connected to external PostgreSQL server at ${config.connectionString || config.host}`);
            return true;
          } finally {
            client.release();
          }
        } catch (err) {
          console.log('External PostgreSQL server not reachable. Running on local PostgreSQL database (offline with mock data).');
        }
      }
      return await initLocalPostgres();
    })();
  }
  return initPromise;
}

async function connectPostgres(customConfig = null) {
  if (customConfig) {
    initPromise = null;
    return await ensurePostgres(customConfig);
  }
  return await ensurePostgres();
}

// Helpers to map SQL rows to API-compatible JS objects
function mapUserRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    role: row.role,
    profile: typeof row.profile === 'string' ? JSON.parse(row.profile) : (row.profile || {}),
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCategoryRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapDealRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    description: row.description,
    blogContent: row.blog_content,
    category: row.category,
    store: typeof row.store === 'string' ? JSON.parse(row.store) : (row.store || {}),
    discountType: row.discount_type,
    discountValue: row.discount_value !== null ? Number(row.discount_value) : 0,
    originalPrice: row.original_price !== null ? Number(row.original_price) : 0,
    discountedPrice: row.discounted_price !== null ? Number(row.discounted_price) : 0,
    imageUrl: row.image_url,
    affiliateLink: row.affiliate_link,
    couponCode: row.coupon_code,
    expiryDate: row.expiry_date,
    terms: row.terms,
    isActive: row.is_active,
    featured: row.featured,
    clickCount: row.click_count !== null ? Number(row.click_count) : 0,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapAnalyticsRow(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    eventType: row.event_type,
    path: row.path,
    dealId: row.deal_id,
    dealTitle: row.deal_title,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Thenable query wrapper for chaining (.sort(), .limit(), .skip(), .select(), .populate())
class PostgresQuery {
  constructor(executor) {
    this._executor = executor;
    this._sortObj = null;
    this._limitNum = null;
    this._skipNum = 0;
    this._selectFields = null;
    this._populateField = null;
  }

  sort(sortCriteria) {
    this._sortObj = sortCriteria;
    return this;
  }

  limit(n) {
    if (n !== undefined && n !== null) {
      this._limitNum = parseInt(n, 10);
    }
    return this;
  }

  skip(n) {
    if (n !== undefined && n !== null) {
      this._skipNum = parseInt(n, 10);
    }
    return this;
  }

  select(fields) {
    if (typeof fields === 'string') {
      this._selectFields = fields.trim().split(/\s+/);
    }
    return this;
  }

  populate(field) {
    this._populateField = field;
    return this;
  }

  async exec() {
    if (!pool) await ensurePostgres();
    let items = await this._executor({
      sort: this._sortObj,
      limit: this._limitNum,
      skip: this._skipNum,
      select: this._selectFields,
      populate: this._populateField
    });

    if (!Array.isArray(items)) {
      if (items && this._selectFields) {
        items = applySelect(items, this._selectFields);
      }
      return items;
    }

    if (this._populateField === 'dealId') {
      const dealIds = items.map(i => i.dealId).filter(Boolean);
      if (dealIds.length > 0 && pool) {
        const placeholders = dealIds.map((_, idx) => `$${idx + 1}`).join(',');
        const dealsRes = await pool.query(
          `SELECT id, store, original_price, discounted_price FROM deals WHERE id IN (${placeholders})`,
          dealIds
        );
        const dealMap = {};
        dealsRes.rows.forEach(r => {
          dealMap[r.id] = {
            _id: r.id,
            store: typeof r.store === 'string' ? JSON.parse(r.store) : (r.store || {}),
            originalPrice: Number(r.original_price || 0),
            discountedPrice: Number(r.discounted_price || 0)
          };
        });
        items = items.map(item => {
          const copy = { ...item };
          if (copy.dealId && dealMap[copy.dealId]) {
            copy.dealId = dealMap[copy.dealId];
          }
          return copy;
        });
      }
    }

    if (this._selectFields) {
      items = items.map(item => applySelect(item, this._selectFields));
    }

    return items;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }
}

function applySelect(item, selectFields) {
  if (!item || !selectFields) return item;
  const isExclusion = selectFields.some(f => f.startsWith('-'));
  if (isExclusion) {
    const excludedKeys = selectFields
      .filter(f => f.startsWith('-'))
      .map(f => f.slice(1));
    const result = { ...item };
    excludedKeys.forEach(k => delete result[k]);
    return result;
  }
  const result = {};
  selectFields.forEach(k => {
    if (item[k] !== undefined) result[k] = item[k];
  });
  return result;
}

// -------------------------------------------------------------
// POSTGRES USER MODEL
// -------------------------------------------------------------
class PostgresUser {
  constructor(data = {}) {
    Object.assign(this, data);
    if (!this._id) this._id = data.id || generateId();
    this.id = this._id;
    if (!this.createdAt) this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async comparePassword(candidatePassword) {
    if (!this.password) return false;
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch {
      return candidatePassword === this.password;
    }
  }

  async save() {
    if (!pool) await ensurePostgres();
    this.updatedAt = new Date();
    let hashed = this.password;
    if (hashed && !hashed.startsWith('$2a$') && !hashed.startsWith('$2b$')) {
      hashed = await bcrypt.hash(this.password, 10);
      this.password = hashed;
    }

    const query = `
      INSERT INTO users (id, username, email, password, role, profile, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        email = EXCLUDED.email,
        password = EXCLUDED.password,
        role = EXCLUDED.role,
        profile = EXCLUDED.profile,
        is_active = EXCLUDED.is_active,
        updated_at = EXCLUDED.updated_at
      RETURNING *;
    `;
    const res = await pool.query(query, [
      this._id,
      this.username,
      this.email,
      this.password,
      this.role || 'admin',
      JSON.stringify(this.profile || {}),
      this.isActive !== false,
      this.createdAt || new Date(),
      this.updatedAt
    ]);
    const saved = mapUserRow(res.rows[0]);
    Object.assign(this, saved);
    return this;
  }

  static findOne(query = {}) {
    return new PostgresQuery(async () => {
      const conditions = [];
      const params = [];
      if (query.email) {
        params.push(query.email.toLowerCase());
        conditions.push(`LOWER(email) = $${params.length}`);
      }
      if (query.username) {
        params.push(query.username.toLowerCase());
        conditions.push(`LOWER(username) = $${params.length}`);
      }
      if (query._id || query.id) {
        params.push(query._id || query.id);
        conditions.push(`id = $${params.length}`);
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const res = await pool.query(`SELECT * FROM users ${where} LIMIT 1`, params);
      return res.rows[0] ? new PostgresUser(mapUserRow(res.rows[0])) : null;
    });
  }

  static findById(id) {
    return new PostgresQuery(async () => {
      const res = await pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
      return res.rows[0] ? new PostgresUser(mapUserRow(res.rows[0])) : null;
    });
  }

  static async countDocuments() {
    const res = await pool.query('SELECT COUNT(*)::int AS count FROM users');
    return res.rows[0].count;
  }

  static async create(data) {
    const user = new PostgresUser(data);
    await user.save();
    return user;
  }
}

// -------------------------------------------------------------
// POSTGRES CATEGORY MODEL
// -------------------------------------------------------------
class PostgresCategory {
  constructor(data = {}) {
    Object.assign(this, data);
    if (!this._id) this._id = data.id || generateId();
    this.id = this._id;
    if (!this.createdAt) this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    if (!pool) await ensurePostgres();
    this.updatedAt = new Date();
    const cleanName = (this.name || '').trim().toLowerCase();
    const query = `
      INSERT INTO categories (id, name, created_at, updated_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO UPDATE SET
        updated_at = EXCLUDED.updated_at
      RETURNING *;
    `;
    const res = await pool.query(query, [
      this._id,
      cleanName,
      this.createdAt || new Date(),
      this.updatedAt
    ]);
    const saved = mapCategoryRow(res.rows[0]);
    Object.assign(this, saved);
    return this;
  }

  static find(query = {}) {
    return new PostgresQuery(async ({ sort }) => {
      let orderSql = 'ORDER BY name ASC';
      if (sort) {
        const [field, dir] = Object.entries(sort)[0] || ['name', 1];
        const direction = dir === -1 || dir === 'desc' ? 'DESC' : 'ASC';
        orderSql = `ORDER BY ${field === 'createdAt' ? 'created_at' : field} ${direction}`;
      }

      const conditions = [];
      const params = [];
      if (query.name) {
        params.push(query.name.toLowerCase());
        conditions.push(`LOWER(name) = $${params.length}`);
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const res = await pool.query(`SELECT * FROM categories ${where} ${orderSql}`, params);
      return res.rows.map(r => new PostgresCategory(mapCategoryRow(r)));
    });
  }

  static findOne(query = {}) {
    return new PostgresQuery(async () => {
      const conditions = [];
      const params = [];
      if (query.name) {
        params.push(query.name.toLowerCase());
        conditions.push(`LOWER(name) = $${params.length}`);
      }
      if (query._id || query.id) {
        params.push(query._id || query.id);
        conditions.push(`id = $${params.length}`);
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const res = await pool.query(`SELECT * FROM categories ${where} LIMIT 1`, params);
      return res.rows[0] ? new PostgresCategory(mapCategoryRow(res.rows[0])) : null;
    });
  }

  static async findByIdAndDelete(id) {
    const res = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] ? new PostgresCategory(mapCategoryRow(res.rows[0])) : null;
  }

  static async countDocuments() {
    const res = await pool.query('SELECT COUNT(*)::int AS count FROM categories');
    return res.rows[0].count;
  }

  static async insertMany(list) {
    const inserted = [];
    for (const item of list) {
      const cat = new PostgresCategory(item);
      await cat.save();
      inserted.push(cat);
    }
    return inserted;
  }

  static async deleteMany() {
    const res = await pool.query('DELETE FROM categories');
    return { deletedCount: res.rowCount };
  }
}

// -------------------------------------------------------------
// POSTGRES DEAL MODEL
// -------------------------------------------------------------
class PostgresDeal {
  constructor(data = {}) {
    Object.assign(this, data);
    if (!this._id) this._id = data.id || generateId();
    this.id = this._id;
    if (this.clickCount === undefined) this.clickCount = 0;
    if (this.isActive === undefined) this.isActive = true;
    if (this.featured === undefined) this.featured = false;
    if (!this.createdAt) this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    if (!pool) await ensurePostgres();
    this.updatedAt = new Date();
    const query = `
      INSERT INTO deals (
        id, title, description, blog_content, category, store, discount_type,
        discount_value, original_price, discounted_price, image_url, affiliate_link,
        coupon_code, expiry_date, terms, is_active, featured, click_count, tags,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        blog_content = EXCLUDED.blog_content,
        category = EXCLUDED.category,
        store = EXCLUDED.store,
        discount_type = EXCLUDED.discount_type,
        discount_value = EXCLUDED.discount_value,
        original_price = EXCLUDED.original_price,
        discounted_price = EXCLUDED.discounted_price,
        image_url = EXCLUDED.image_url,
        affiliate_link = EXCLUDED.affiliate_link,
        coupon_code = EXCLUDED.coupon_code,
        expiry_date = EXCLUDED.expiry_date,
        terms = EXCLUDED.terms,
        is_active = EXCLUDED.is_active,
        featured = EXCLUDED.featured,
        click_count = EXCLUDED.click_count,
        tags = EXCLUDED.tags,
        updated_at = EXCLUDED.updated_at
      RETURNING *;
    `;

    const res = await pool.query(query, [
      this._id,
      this.title,
      this.description,
      this.blogContent || this.description,
      this.category,
      JSON.stringify(this.store || {}),
      this.discountType || 'percentage',
      this.discountValue || 0,
      this.originalPrice || 0,
      this.discountedPrice || 0,
      this.imageUrl || '',
      this.affiliateLink || '',
      this.couponCode || null,
      this.expiryDate || new Date('2028-12-31'),
      this.terms || '',
      this.isActive !== false,
      !!this.featured,
      this.clickCount || 0,
      JSON.stringify(this.tags || []),
      this.createdAt || new Date(),
      this.updatedAt
    ]);

    const saved = mapDealRow(res.rows[0]);
    Object.assign(this, saved);
    return this;
  }

  static _buildWhereClause(query, params) {
    const conditions = [];

    if (query.isActive !== undefined) {
      params.push(query.isActive === true || query.isActive === 'true');
      conditions.push(`is_active = $${params.length}`);
    }

    if (query.featured !== undefined) {
      params.push(query.featured === true || query.featured === 'true');
      conditions.push(`featured = $${params.length}`);
    }

    if (query.category) {
      params.push(query.category.toLowerCase());
      conditions.push(`LOWER(category) = $${params.length}`);
    }

    const searchTerm = query.$text && query.$text.$search ? query.$text.$search : query.search;
    if (searchTerm) {
      params.push(`%${searchTerm.toLowerCase()}%`);
      const pIdx = params.length;
      conditions.push(`(
        LOWER(title) LIKE $${pIdx} OR
        LOWER(description) LIKE $${pIdx} OR
        LOWER(store->>'name') LIKE $${pIdx} OR
        LOWER(tags::text) LIKE $${pIdx}
      )`);
    }

    return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  }

  static find(query = {}) {
    return new PostgresQuery(async ({ sort, limit, skip }) => {
      const params = [];
      const where = PostgresDeal._buildWhereClause(query, params);

      let orderSql = 'ORDER BY created_at DESC';
      if (sort) {
        const [field, dir] = Object.entries(sort)[0] || ['created_at', -1];
        const direction = dir === -1 || dir === 'desc' ? 'DESC' : 'ASC';
        const col = field === 'createdAt' ? 'created_at' : (field === 'clickCount' ? 'click_count' : field);
        orderSql = `ORDER BY ${col} ${direction}`;
      }

      let paginationSql = '';
      if (limit !== null && limit !== undefined) {
        params.push(limit);
        paginationSql += ` LIMIT $${params.length}`;
      }
      if (skip > 0) {
        params.push(skip);
        paginationSql += ` OFFSET $${params.length}`;
      }

      const res = await pool.query(`SELECT * FROM deals ${where} ${orderSql} ${paginationSql}`, params);
      return res.rows.map(r => new PostgresDeal(mapDealRow(r)));
    });
  }

  static async countDocuments(query = {}) {
    if (!pool) await ensurePostgres();
    const params = [];
    const where = PostgresDeal._buildWhereClause(query, params);
    const res = await pool.query(`SELECT COUNT(*)::int AS count FROM deals ${where}`, params);
    return res.rows[0].count;
  }

  static async distinct(field, query = {}) {
    if (!pool) await ensurePostgres();
    const params = [];
    const where = PostgresDeal._buildWhereClause(query, params);

    let expr = field;
    if (field === 'store.name') {
      expr = "store->>'name'";
    }

    const res = await pool.query(`SELECT DISTINCT ${expr} AS val FROM deals ${where} AND ${expr} IS NOT NULL`, params);
    return res.rows.map(r => r.val).filter(Boolean);
  }

  static async findById(id) {
    if (!pool) await ensurePostgres();
    const res = await pool.query('SELECT * FROM deals WHERE id = $1 LIMIT 1', [id]);
    return res.rows[0] ? new PostgresDeal(mapDealRow(res.rows[0])) : null;
  }

  static async findByIdAndUpdate(id, updateData = {}, options = {}) {
    const existing = await PostgresDeal.findById(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updateData,
      store: updateData.store ? { ...existing.store, ...updateData.store } : existing.store,
      tags: updateData.tags !== undefined ? updateData.tags : existing.tags,
      updatedAt: new Date()
    };

    const query = `
      UPDATE deals SET
        title = $1,
        description = $2,
        blog_content = $3,
        category = $4,
        store = $5,
        discount_type = $6,
        discount_value = $7,
        original_price = $8,
        discounted_price = $9,
        image_url = $10,
        affiliate_link = $11,
        coupon_code = $12,
        expiry_date = $13,
        terms = $14,
        is_active = $15,
        featured = $16,
        click_count = $17,
        tags = $18,
        updated_at = NOW()
      WHERE id = $19
      RETURNING *;
    `;

    const res = await pool.query(query, [
      merged.title,
      merged.description,
      merged.blogContent || merged.description,
      merged.category,
      JSON.stringify(merged.store || {}),
      merged.discountType || 'percentage',
      merged.discountValue || 0,
      merged.originalPrice || 0,
      merged.discountedPrice || 0,
      merged.imageUrl || '',
      merged.affiliateLink || '',
      merged.couponCode || null,
      merged.expiryDate || new Date(),
      merged.terms || '',
      merged.isActive !== false,
      !!merged.featured,
      merged.clickCount || 0,
      JSON.stringify(merged.tags || []),
      id
    ]);

    return res.rows[0] ? new PostgresDeal(mapDealRow(res.rows[0])) : null;
  }

  static async findByIdAndDelete(id) {
    const res = await pool.query('DELETE FROM deals WHERE id = $1 RETURNING *', [id]);
    return res.rows[0] ? new PostgresDeal(mapDealRow(res.rows[0])) : null;
  }

  static async deleteMany() {
    const res = await pool.query('DELETE FROM deals');
    return { deletedCount: res.rowCount };
  }

  static async insertMany(list) {
    const inserted = [];
    for (const item of list) {
      const deal = new PostgresDeal(item);
      await deal.save();
      inserted.push(deal);
    }
    return inserted;
  }
}

// -------------------------------------------------------------
// POSTGRES ANALYTICS MODEL
// -------------------------------------------------------------
class PostgresAnalytics {
  constructor(data = {}) {
    Object.assign(this, data);
    if (!this._id) this._id = data.id || generateId();
    this.id = this._id;
    if (!this.createdAt) this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    if (!pool) await ensurePostgres();
    this.updatedAt = new Date();
    const query = `
      INSERT INTO analytics (id, event_type, path, deal_id, deal_title, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await pool.query(query, [
      this._id,
      this.eventType || 'page_view',
      this.path || '/',
      this.dealId || null,
      this.dealTitle || null,
      this.createdAt || new Date(),
      this.updatedAt
    ]);
    const saved = mapAnalyticsRow(res.rows[0]);
    Object.assign(this, saved);
    return this;
  }

  static async create(data) {
    const record = new PostgresAnalytics(data);
    await record.save();
    return record;
  }

  static async countDocuments(query = {}) {
    if (query.eventType) {
      const res = await pool.query('SELECT COUNT(*)::int AS count FROM analytics WHERE event_type = $1', [query.eventType]);
      return res.rows[0].count;
    }
    const res = await pool.query('SELECT COUNT(*)::int AS count FROM analytics');
    return res.rows[0].count;
  }

  static find(query = {}) {
    return new PostgresQuery(async ({ sort, limit }) => {
      const params = [];
      let where = '';
      if (query.eventType) {
        params.push(query.eventType);
        where = `WHERE event_type = $1`;
      }

      let orderSql = 'ORDER BY created_at DESC';
      if (sort) {
        const [field, dir] = Object.entries(sort)[0] || ['created_at', -1];
        const direction = dir === -1 || dir === 'desc' ? 'DESC' : 'ASC';
        orderSql = `ORDER BY ${field === 'createdAt' ? 'created_at' : field} ${direction}`;
      }

      let limitSql = '';
      if (limit) {
        params.push(limit);
        limitSql = `LIMIT $${params.length}`;
      }

      const res = await pool.query(`SELECT * FROM analytics ${where} ${orderSql} ${limitSql}`, params);
      return res.rows.map(r => new PostgresAnalytics(mapAnalyticsRow(r)));
    });
  }

  static async aggregate(pipeline = []) {
    // 1. Page views by path
    const isPageViews = pipeline.some(stage => stage.$match && stage.$match.eventType === 'page_view');
    if (isPageViews) {
      const res = await pool.query(`
        SELECT path AS "_id", COUNT(*)::int AS "count"
        FROM analytics
        WHERE event_type = 'page_view'
        GROUP BY path
        ORDER BY count DESC
        LIMIT 10
      `);
      return res.rows;
    }

    // 2. Deal views leaderboard
    const isDealViews = pipeline.some(stage => stage.$match && stage.$match.eventType === 'deal_view');
    if (isDealViews) {
      const res = await pool.query(`
        SELECT deal_id AS "dealId", deal_title AS "dealTitle", COUNT(*)::int AS "count"
        FROM analytics
        WHERE event_type = 'deal_view' AND deal_id IS NOT NULL
        GROUP BY deal_id, deal_title
        ORDER BY count DESC
        LIMIT 10
      `);
      return res.rows;
    }

    return [];
  }
}

module.exports = {
  isPostgresConnected,
  isLocalInMemory,
  ensurePostgres,
  connectPostgres,
  initLocalPostgres,
  getPool,
  setPostgresPool,
  initPostgresTables,
  seedMockData,
  User: PostgresUser,
  Category: PostgresCategory,
  Deal: PostgresDeal,
  Analytics: PostgresAnalytics
};
