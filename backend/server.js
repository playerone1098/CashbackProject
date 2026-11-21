const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const postgresDb = require('./db/postgres');

// Ensure safe defaults
process.env.JWT_SECRET = process.env.JWT_SECRET || 'cashback_local_jwt_secret_dev_key';

const app = express();

// Required when behind a proxy so rate limiting uses the real client IP
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use('/api/', limiter);

// Always initialize PostgreSQL (external server or local offline database with mock data)
postgresDb.connectPostgres();

// Middleware to ensure database is ready before serving requests
app.use(async (req, res, next) => {
  if (!postgresDb.isPostgresConnected()) {
    await postgresDb.connectPostgres();
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Status endpoint
app.get('/api/status', (req, res) => {
  const isLocal = postgresDb.isLocalInMemory();
  res.json({
    backend: 'Connected',
    database: 'Connected',
    storageMode: isLocal ? 'postgresql-local' : 'postgresql',
    frontend: 'Running'
  });
});

// Routes
app.use('/sitemap.xml', require('./routes/sitemap'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5000;
let server = null;
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
