const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Required when behind a proxy (CRA dev server, nginx, etc.) so rate limiting uses the real client IP
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  try {
    const Category = require('./models/Category');
    const count = await Category.countDocuments();
    if (count === 0) {
      const defaults = ['shopping', 'food', 'travel', 'entertainment', 'electronics', 'fashion', 'health', 'credit cards', 'upi apps', 'other'];
      await Category.insertMany(defaults.map(name => ({ name })));
      console.log('Default categories seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding default categories:', err);
  }
})
.catch(err => console.error('MongoDB connection error:', err));

// Status endpoint
app.get('/api/status', (req, res) => {
  const dbState = mongoose.connection.readyState;
  let dbStatus = 'Setup Required';
  if (dbState === 1) {
    dbStatus = 'Connected';
  } else if (dbState === 2) {
    dbStatus = 'Connecting';
  }
  res.json({
    backend: 'Connected',
    database: dbStatus,
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
