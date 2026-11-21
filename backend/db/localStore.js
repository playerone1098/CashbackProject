const crypto = require('crypto');
const bcrypt = require('bcryptjs');

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

// Initial Admin User
const initialAdmin = {
  _id: '64f8a1234567890abcdef001',
  username: 'admin',
  email: 'admin@cashback.com',
  password: bcrypt.hashSync('admin123', 10),
  role: 'admin',
  profile: {
    firstName: 'Admin',
    lastName: 'User',
    phone: '',
    address: ''
  },
  isActive: true,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z')
};

// Initial Categories
const initialCategoryNames = [
  'credit cards',
  'upi apps',
  'shopping',
  'food',
  'travel',
  'entertainment',
  'electronics',
  'fashion',
  'health',
  'other'
];

const initialCategories = initialCategoryNames.map((name, index) => ({
  _id: `64f8a1234567890abcde${(100 + index).toString(16)}`,
  name,
  createdAt: new Date(Date.now() - (10 - index) * 86400000),
  updatedAt: new Date(Date.now() - (10 - index) * 86400000)
}));

// Initial Deals
const initialDeals = [
  {
    _id: '64f8a1234567890abcde0001',
    title: 'SBI Cashback Credit Card - Flat 5% Cashback on All Online Spends',
    description: 'Earn flat 5% cashback on almost all online transactions with the SBI Cashback credit card.',
    blogContent: 'SBI Cashback Credit Card has revolutionized cashback in India! With a flat 5% cashback on all online spends (excluding fuel, rent, utility bills, school fees, etc.), it is the ultimate reward card for online shoppers. The cashback is capped at ₹2,000 per billing cycle and is automatically credited to your statement monthly. Enjoy the freedom of earning premium cashback without brand exclusions.',
    category: 'credit cards',
    store: {
      name: 'SBI Card',
      logo: 'https://logo.clearbit.com/sbicard.com',
      website: 'https://www.sbicard.com'
    },
    discountType: 'percentage',
    discountValue: 5,
    originalPrice: 999,
    discountedPrice: 999,
    imageUrl: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=600&q=80',
    affiliateLink: 'https://www.sbicard.com/en/personal/credit-cards/shopping/cashback-sbi-card.page',
    couponCode: 'APPLY-SBI',
    expiryDate: new Date('2028-12-31T23:59:59.000Z'),
    terms: '5% cashback capped at ₹2,000 per month. Annual fee waived on ₹2 Lakh spends.',
    isActive: true,
    featured: true,
    clickCount: 15,
    tags: ['sbi', 'cashback', 'creditcard', 'online', 'rewards'],
    createdAt: new Date(Date.now() - 7 * 86400000),
    updatedAt: new Date(Date.now() - 7 * 86400000)
  },
  {
    _id: '64f8a1234567890abcde0002',
    title: 'Swiggy HDFC Bank Credit Card - 10% Cashback on Swiggy Orders',
    description: 'Get 10% cashback on Swiggy Instamart, Food, Dineout + 5% cashback on online partners.',
    blogContent: 'For foodies and grocery lovers, the Swiggy HDFC Credit Card is a must-have. You get a massive 10% cashback on all Swiggy orders (Food delivery, Instamart, and Dineout dining). Furthermore, enjoy 5% cashback on popular e-commerce platforms like Amazon, Flipkart, Nike, Nykaa, and Zomato. All other eligible purchases earn 1% cashback. It is one of the highest value lifestyle cards on the market today.',
    category: 'credit cards',
    store: {
      name: 'HDFC Bank',
      logo: 'https://logo.clearbit.com/hdfcbank.com',
      website: 'https://www.hdfcbank.com'
    },
    discountType: 'percentage',
    discountValue: 10,
    originalPrice: 500,
    discountedPrice: 500,
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    affiliateLink: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/swiggy-hdfc-bank-credit-card',
    couponCode: 'APPLY-HDFC',
    expiryDate: new Date('2028-12-31T23:59:59.000Z'),
    terms: '10% cashback capped at ₹1,500/month. 5% cashback capped at ₹1,500/month.',
    isActive: true,
    featured: true,
    clickCount: 22,
    tags: ['hdfc', 'swiggy', 'food', 'creditcard', 'cashback'],
    createdAt: new Date(Date.now() - 6 * 86400000),
    updatedAt: new Date(Date.now() - 6 * 86400000)
  },
  {
    _id: '64f8a1234567890abcde0003',
    title: 'Amazon Pay ICICI Card - Unlimited 5% Cashback on Amazon India',
    description: 'Lifetime Free Card with 5% unlimited cashback for Prime members on Amazon India.',
    blogContent: 'The Amazon Pay ICICI Bank Credit Card is one of India\'s most successful co-branded credit cards. It is a lifetime free card with no joining or annual fees. Amazon Prime members earn a flat, unlimited 5% cashback on all Amazon India shopping. Non-Prime members earn 3%. Partner merchants (like Uber, BookMyShow, etc.) and utility payments earn 2% cashback.',
    category: 'credit cards',
    store: {
      name: 'ICICI Bank',
      logo: 'https://logo.clearbit.com/icicibank.com',
      website: 'https://www.icicibank.com'
    },
    discountType: 'percentage',
    discountValue: 5,
    originalPrice: 0,
    discountedPrice: 0,
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=600&q=80',
    affiliateLink: 'https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-icici-bank-credit-card',
    couponCode: 'APPLY-ICICI',
    expiryDate: new Date('2028-12-31T23:59:59.000Z'),
    terms: 'Lifetime free card. Earnings are credited directly as Amazon Pay balance.',
    isActive: true,
    featured: false,
    clickCount: 18,
    tags: ['icici', 'amazon', 'amazonpay', 'free', 'cashback'],
    createdAt: new Date(Date.now() - 5 * 86400000),
    updatedAt: new Date(Date.now() - 5 * 86400000)
  },
  {
    _id: '64f8a1234567890abcde0004',
    title: 'Kiwi UPI Credit Card - Flat 2% Cashback on All UPI Spends',
    description: 'Earn flat 2% cashback on scan and pay UPI transactions using Kiwi RuPay credit card.',
    blogContent: 'Kiwi introduces a new era of payments! Link your Kiwi Axis Bank RuPay Credit Card with your UPI app and earn a flat 2% cashback as Kiwi KwiCoins on every \'Scan & Pay\' transaction at merchant outlets. Say goodbye to zero rewards on UPI payments and leverage the combined power of credit lines and UPI seamlessness. Applying is 100% digital via the Kiwi mobile app.',
    category: 'upi apps',
    store: {
      name: 'Kiwi UPI',
      logo: 'https://logo.clearbit.com/gokiwi.in',
      website: 'https://www.gokiwi.in'
    },
    discountType: 'percentage',
    discountValue: 2,
    originalPrice: 0,
    discountedPrice: 0,
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    affiliateLink: 'https://www.gokiwi.in',
    couponCode: 'KIWIUPI2',
    expiryDate: new Date('2027-12-31T23:59:59.000Z'),
    terms: 'Lifetime free. Valid only on merchant UPI transactions. 1 KwiCoin = ₹0.25.',
    isActive: true,
    featured: true,
    clickCount: 30,
    tags: ['kiwi', 'upi', 'rupay', 'creditcard', 'cashback'],
    createdAt: new Date(Date.now() - 4 * 86400000),
    updatedAt: new Date(Date.now() - 4 * 86400000)
  },
  {
    _id: '64f8a1234567890abcde0005',
    title: 'Google Pay UPI - Earn up to ₹21 on First UPI Scan & Pay',
    description: 'New GPay users get flat cashback on sending money or paying a merchant.',
    blogContent: 'New to Google Pay? Get an instant cashback of up to ₹21 straight into your bank account when you do your first UPI transaction of ₹1 or more. Simply scan any QR code or enter a UPI ID, complete the payment, and unlock your welcome scratch card reward. Start your cashless journey today with GPay\'s highly secure UPI network.',
    category: 'upi apps',
    store: {
      name: 'Google Pay',
      logo: 'https://logo.clearbit.com/google.com',
      website: 'https://pay.google.com'
    },
    discountType: 'fixed',
    discountValue: 21,
    originalPrice: 0,
    discountedPrice: 0,
    imageUrl: 'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=600&q=80',
    affiliateLink: 'https://pay.google.com',
    couponCode: 'GPAY21',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    terms: 'Valid for first-time GPay UPI users only. Minimum transaction of ₹1 required.',
    isActive: true,
    featured: false,
    clickCount: 9,
    tags: ['gpay', 'googlepay', 'upi', 'firstpay', 'cashback'],
    createdAt: new Date(Date.now() - 3 * 86400000),
    updatedAt: new Date(Date.now() - 3 * 86400000)
  },
  {
    _id: '64f8a1234567890abcde0006',
    title: 'CRED Pay - Up to ₹250 Cashback on Utility & Credit Bills',
    description: 'Pay your credit card bills or household utilities using CRED UPI and get assured cashback.',
    blogContent: 'Pay your bills smart. Use CRED Pay UPI to clear your electricity, water, broadband, or credit card bills. Get up to ₹250 instant cashback or win CRED Coins which can be redeemed for premium rewards and discounts on high-end brands. Trusted by millions of credit-worthy users for smooth and fast payments.',
    category: 'upi apps',
    store: {
      name: 'CRED',
      logo: 'https://logo.clearbit.com/cred.club',
      website: 'https://www.cred.club'
    },
    discountType: 'fixed',
    discountValue: 250,
    originalPrice: 0,
    discountedPrice: 0,
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    affiliateLink: 'https://www.cred.club',
    couponCode: 'CREDPAY250',
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    terms: 'Valid on first credit bill or utility payment via CRED UPI. Min transaction ₹1000.',
    isActive: true,
    featured: true,
    clickCount: 45,
    tags: ['cred', 'upi', 'billpay', 'rewards', 'coins'],
    createdAt: new Date(Date.now() - 2 * 86400000),
    updatedAt: new Date(Date.now() - 2 * 86400000)
  },
  {
    _id: '64f8a1234567890abcde0007',
    title: 'Amazon India - Flat 10% Cashback on Fashion & Beauty',
    description: 'Earn flat 10% cashback up to ₹200 on all fashion, clothing and cosmetics purchases.',
    blogContent: 'Upgrade your wardrobe with Amazon Fashion! Shop the top apparel, footwear, watches, and beauty products from popular brands and get an instant 10% cashback (up to ₹200) credited directly to your Amazon Pay wallet. Prime members enjoy free shipping with no minimum purchase requirement.',
    category: 'shopping',
    store: {
      name: 'Amazon India',
      logo: 'https://logo.clearbit.com/amazon.in',
      website: 'https://www.amazon.in'
    },
    discountType: 'percentage',
    discountValue: 10,
    originalPrice: 1500,
    discountedPrice: 1350,
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    affiliateLink: 'https://www.amazon.in',
    couponCode: 'AMZNFASH10',
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    terms: 'Capped at ₹200 cashback. Credited as Amazon Pay balance within 24 hours.',
    isActive: true,
    featured: false,
    clickCount: 14,
    tags: ['amazon', 'fashion', 'shopping', 'beauty', 'wallet'],
    createdAt: new Date(Date.now() - 1 * 86400000),
    updatedAt: new Date(Date.now() - 1 * 86400000)
  },
  {
    _id: '64f8a1234567890abcde0008',
    title: 'Zomato Dineout - Up to 40% Off + 10% Extra Cashback',
    description: 'Book restaurant tables via Zomato Dineout and get up to 40% discount plus extra bank cashback.',
    blogContent: 'Dine out like royalty and save big! Book your tables at thousands of premium partner restaurants using Zomato Dineout. Pay your restaurant bills through Zomato Pay and enjoy up to 40% instant discount. Plus, pay using select credit cards (like HSBC or HDFC) to get an extra 10% cashback on your payments. Feast more, pay less!',
    category: 'food',
    store: {
      name: 'Zomato',
      logo: 'https://logo.clearbit.com/zomato.com',
      website: 'https://www.zomato.com'
    },
    discountType: 'percentage',
    discountValue: 40,
    originalPrice: 1000,
    discountedPrice: 600,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80',
    affiliateLink: 'https://www.zomato.com',
    couponCode: 'ZOMATOPAY',
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    terms: 'Valid only on paying via Zomato Pay at select partner restaurants.',
    isActive: true,
    featured: true,
    clickCount: 38,
    tags: ['zomato', 'dineout', 'food', 'dining', 'discount'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Initial Analytics Events
const initialAnalytics = [
  {
    _id: '64f8a1234567890abcde0101',
    eventType: 'page_view',
    path: '/',
    createdAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    _id: '64f8a1234567890abcde0102',
    eventType: 'page_view',
    path: '/deals',
    createdAt: new Date(Date.now() - 3600000 * 4)
  },
  {
    _id: '64f8a1234567890abcde0103',
    eventType: 'deal_view',
    path: '/deals/64f8a1234567890abcde0001',
    dealId: '64f8a1234567890abcde0001',
    dealTitle: 'SBI Cashback Credit Card - Flat 5% Cashback on All Online Spends',
    createdAt: new Date(Date.now() - 3600000 * 3)
  },
  {
    _id: '64f8a1234567890abcde0104',
    eventType: 'deal_view',
    path: '/deals/64f8a1234567890abcde0006',
    dealId: '64f8a1234567890abcde0006',
    dealTitle: 'CRED Pay - Up to ₹250 Cashback on Utility & Credit Bills',
    createdAt: new Date(Date.now() - 3600000 * 2)
  }
];

// In-Memory Database Store
class LocalStore {
  constructor() {
    this.users = [{ ...initialAdmin }];
    this.categories = initialCategories.map(c => ({ ...c }));
    this.deals = initialDeals.map(d => ({ ...d }));
    this.analytics = initialAnalytics.map(a => ({ ...a }));
  }

  // Clone item to prevent external mutation
  clone(item) {
    if (!item) return item;
    return JSON.parse(JSON.stringify(item));
  }
}

const store = new LocalStore();

// Chainable query helper
class LocalQuery {
  constructor(executor) {
    this._executor = executor;
    this._sortObj = null;
    this._limitNum = null;
    this._skipNum = 0;
    this._selectFields = null;
    this._populateField = null;
    this._populateSelect = null;
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

  populate(field, selectFields) {
    this._populateField = field;
    this._populateSelect = selectFields;
    return this;
  }

  async exec() {
    let items = await this._executor();
    if (!Array.isArray(items)) {
      if (items && this._selectFields) {
        items = applySelect(items, this._selectFields);
      }
      return items;
    }

    if (this._sortObj) {
      const entries = Object.entries(this._sortObj);
      if (entries.length > 0) {
        const [field, direction] = entries[0];
        const dir = direction === -1 || direction === 'desc' ? -1 : 1;
        items.sort((a, b) => {
          const valA = a[field] !== undefined ? a[field] : '';
          const valB = b[field] !== undefined ? b[field] : '';
          if (valA < valB) return -1 * dir;
          if (valA > valB) return 1 * dir;
          return 0;
        });
      }
    }

    if (this._skipNum > 0) {
      items = items.slice(this._skipNum);
    }

    if (this._limitNum !== null && this._limitNum >= 0) {
      items = items.slice(0, this._limitNum);
    }

    if (this._populateField === 'dealId') {
      items = items.map(item => {
        const copy = { ...item };
        const foundDeal = store.deals.find(d => String(d._id) === String(copy.dealId));
        if (foundDeal) {
          copy.dealId = {
            _id: foundDeal._id,
            store: foundDeal.store,
            originalPrice: foundDeal.originalPrice,
            discountedPrice: foundDeal.discountedPrice
          };
        }
        return copy;
      });
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

// User Model Class
class LocalUser {
  constructor(data = {}) {
    Object.assign(this, data);
    if (!this._id) this._id = generateId();
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
    this.updatedAt = new Date();
    const idx = store.users.findIndex(u => String(u._id) === String(this._id));
    const raw = { ...this };
    if (idx >= 0) {
      store.users[idx] = raw;
    } else {
      store.users.push(raw);
    }
    return this;
  }

  static findOne(query = {}) {
    return new LocalQuery(async () => {
      const user = store.users.find(u => {
        if (query.email && u.email.toLowerCase() !== query.email.toLowerCase()) {
          return false;
        }
        if (query.username && u.username.toLowerCase() !== query.username.toLowerCase()) {
          return false;
        }
        if (query._id && String(u._id) !== String(query._id)) {
          return false;
        }
        return true;
      });
      return user ? new LocalUser(user) : null;
    });
  }

  static findById(id) {
    return new LocalQuery(async () => {
      const user = store.users.find(u => String(u._id) === String(id));
      return user ? new LocalUser(user) : null;
    });
  }

  static async countDocuments() {
    return store.users.length;
  }
}

// Category Model Class
class LocalCategory {
  constructor(data = {}) {
    Object.assign(this, data);
    if (!this._id) this._id = generateId();
    if (!this.createdAt) this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    this.updatedAt = new Date();
    const idx = store.categories.findIndex(c => String(c._id) === String(this._id));
    const raw = { ...this };
    if (idx >= 0) {
      store.categories[idx] = raw;
    } else {
      store.categories.push(raw);
    }
    return this;
  }

  static find(query = {}) {
    return new LocalQuery(async () => {
      let list = [...store.categories];
      if (query.name) {
        list = list.filter(c => c.name.toLowerCase() === query.name.toLowerCase());
      }
      return list.map(c => new LocalCategory(c));
    });
  }

  static findOne(query = {}) {
    return new LocalQuery(async () => {
      const item = store.categories.find(c => {
        if (query.name && c.name.toLowerCase() !== query.name.toLowerCase()) {
          return false;
        }
        if (query._id && String(c._id) !== String(query._id)) {
          return false;
        }
        return true;
      });
      return item ? new LocalCategory(item) : null;
    });
  }

  static async findByIdAndDelete(id) {
    const idx = store.categories.findIndex(c => String(c._id) === String(id));
    if (idx >= 0) {
      const deleted = store.categories.splice(idx, 1)[0];
      return new LocalCategory(deleted);
    }
    return null;
  }

  static async countDocuments() {
    return store.categories.length;
  }

  static async insertMany(list) {
    const inserted = list.map(item => new LocalCategory(item));
    store.categories.push(...inserted.map(i => ({ ...i })));
    return inserted;
  }
}

// Deal Model Class
class LocalDeal {
  constructor(data = {}) {
    Object.assign(this, data);
    if (!this._id) this._id = generateId();
    if (this.clickCount === undefined) this.clickCount = 0;
    if (this.isActive === undefined) this.isActive = true;
    if (this.featured === undefined) this.featured = false;
    if (!this.createdAt) this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    this.updatedAt = new Date();
    const idx = store.deals.findIndex(d => String(d._id) === String(this._id));
    const raw = { ...this };
    if (idx >= 0) {
      store.deals[idx] = raw;
    } else {
      store.deals.push(raw);
    }
    return this;
  }

  static _matchesFilter(deal, query) {
    if (query.isActive !== undefined && deal.isActive !== query.isActive) {
      return false;
    }
    if (query.featured !== undefined) {
      const isFeatured = String(query.featured) === 'true';
      if (deal.featured !== isFeatured) return false;
    }
    if (query.category && deal.category.toLowerCase() !== query.category.toLowerCase()) {
      return false;
    }
    if (query.$text && query.$text.$search) {
      const s = query.$text.$search.toLowerCase();
      const inTitle = deal.title && deal.title.toLowerCase().includes(s);
      const inDesc = deal.description && deal.description.toLowerCase().includes(s);
      const inStore = deal.store && deal.store.name && deal.store.name.toLowerCase().includes(s);
      const inTags = Array.isArray(deal.tags) && deal.tags.some(t => t.toLowerCase().includes(s));
      if (!inTitle && !inDesc && !inStore && !inTags) {
        return false;
      }
    }
    return true;
  }

  static find(query = {}) {
    return new LocalQuery(async () => {
      const filtered = store.deals.filter(d => LocalDeal._matchesFilter(d, query));
      return filtered.map(d => new LocalDeal(d));
    });
  }

  static async countDocuments(query = {}) {
    return store.deals.filter(d => LocalDeal._matchesFilter(d, query)).length;
  }

  static async distinct(field, query = {}) {
    const filtered = store.deals.filter(d => LocalDeal._matchesFilter(d, query));
    const values = new Set();
    filtered.forEach(deal => {
      if (field === 'store.name' && deal.store && deal.store.name) {
        values.add(deal.store.name);
      } else if (deal[field] !== undefined) {
        values.add(deal[field]);
      }
    });
    return Array.from(values);
  }

  static async findById(id) {
    const deal = store.deals.find(d => String(d._id) === String(id));
    return deal ? new LocalDeal(deal) : null;
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    const idx = store.deals.findIndex(d => String(d._id) === String(id));
    if (idx === -1) return null;
    const current = store.deals[idx];
    const updated = {
      ...current,
      ...updateData,
      store: updateData.store ? { ...current.store, ...updateData.store } : current.store,
      updatedAt: new Date()
    };
    store.deals[idx] = updated;
    return new LocalDeal(updated);
  }

  static async findByIdAndDelete(id) {
    const idx = store.deals.findIndex(d => String(d._id) === String(id));
    if (idx === -1) return null;
    const deleted = store.deals.splice(idx, 1)[0];
    return new LocalDeal(deleted);
  }

  static async deleteMany() {
    store.deals = [];
    return { deletedCount: 0 };
  }

  static async insertMany(list) {
    const inserted = list.map(d => new LocalDeal(d));
    store.deals.push(...inserted.map(d => ({ ...d })));
    return inserted;
  }
}

// Analytics Model Class
class LocalAnalytics {
  constructor(data = {}) {
    Object.assign(this, data);
    if (!this._id) this._id = generateId();
    if (!this.createdAt) this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    const raw = { ...this };
    store.analytics.push(raw);
    return this;
  }

  static async create(data) {
    const entry = new LocalAnalytics(data);
    await entry.save();
    return entry;
  }

  static async countDocuments(query = {}) {
    if (query.eventType) {
      return store.analytics.filter(a => a.eventType === query.eventType).length;
    }
    return store.analytics.length;
  }

  static find(query = {}) {
    return new LocalQuery(async () => {
      let list = [...store.analytics];
      if (query.eventType) {
        list = list.filter(a => a.eventType === query.eventType);
      }
      return list.map(a => new LocalAnalytics(a));
    });
  }

  static async aggregate(pipeline = []) {
    // 1. Page views by path
    const isPageViews = pipeline.some(stage => stage.$match && stage.$match.eventType === 'page_view');
    if (isPageViews) {
      const counts = {};
      store.analytics
        .filter(a => a.eventType === 'page_view')
        .forEach(a => {
          counts[a.path] = (counts[a.path] || 0) + 1;
        });
      const sorted = Object.entries(counts)
        .map(([_id, count]) => ({ _id, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      return sorted;
    }

    // 2. Deal views leaderboard
    const isDealViews = pipeline.some(stage => stage.$match && stage.$match.eventType === 'deal_view');
    if (isDealViews) {
      const map = {};
      store.analytics
        .filter(a => a.eventType === 'deal_view')
        .forEach(a => {
          const key = `${a.dealId}__${a.dealTitle}`;
          if (!map[key]) {
            map[key] = { dealId: a.dealId, dealTitle: a.dealTitle, count: 0 };
          }
          map[key].count += 1;
        });
      const sorted = Object.values(map)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      return sorted;
    }

    return [];
  }
}

module.exports = {
  store,
  User: LocalUser,
  Category: LocalCategory,
  Deal: LocalDeal,
  Analytics: LocalAnalytics
};
