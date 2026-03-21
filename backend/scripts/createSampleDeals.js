const mongoose = require('mongoose');
const Deal = require('../models/Deal');
require('dotenv').config();

const sampleDeals = [
  {
    title: "Amazon Prime Day - 50% Off Electronics",
    description: "Massive savings on electronics during Amazon Prime Day",
    blogContent: "Amazon Prime Day is here with incredible deals on electronics! Get up to 50% off on smartphones, laptops, headphones, and more. This is the perfect time to upgrade your tech gadgets at unbeatable prices. Don't miss out on these limited-time offers that are exclusive to Prime members.",
    category: "electronics",
    store: {
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
      website: "https://www.amazon.com"
    },
    discountType: "percentage",
    discountValue: 50,
    originalPrice: 999,
    discountedPrice: 499,
    imageUrl: "https://via.placeholder.com/300x200?text=Amazon+Prime+Day",
    affiliateLink: "https://www.amazon.com/prime-day",
    couponCode: "PRIME50",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    terms: "Valid only for Prime members. Limited quantities available.",
    isActive: true,
    featured: true,
    tags: ["amazon", "prime", "electronics", "50off"]
  },
  {
    title: "Nike - Free Shipping on All Orders",
    description: "Get free shipping on all Nike orders with no minimum purchase",
    blogContent: "Nike is offering free shipping on all orders with no minimum purchase required! Whether you're buying running shoes, athletic apparel, or accessories, you can get them delivered to your doorstep without any shipping charges. This is a great opportunity to stock up on your favorite Nike products.",
    category: "fashion",
    store: {
      name: "Nike",
      logo: "https://logo.clearbit.com/nike.com",
      website: "https://www.nike.com"
    },
    discountType: "free-shipping",
    discountValue: 0,
    imageUrl: "https://via.placeholder.com/300x200?text=Nike+Free+Shipping",
    affiliateLink: "https://www.nike.com",
    couponCode: "FREESHIP",
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    terms: "Valid for all orders within continental US.",
    isActive: true,
    featured: false,
    tags: ["nike", "freeshipping", "shoes", "apparel"]
  },
  {
    title: "Best Buy - Buy One Get One Free on Select Games",
    description: "Buy one get one free on selected video games",
    blogContent: "Best Buy has an amazing BOGO deal on select video games! Buy one get one free on popular titles for PlayStation, Xbox, and Nintendo Switch. This is the perfect opportunity to expand your gaming library or grab a gift for a fellow gamer. Limited time offer while supplies last.",
    category: "entertainment",
    store: {
      name: "Best Buy",
      logo: "https://logo.clearbit.com/bestbuy.com",
      website: "https://www.bestbuy.com"
    },
    discountType: "buy-one-get-one",
    discountValue: 0,
    originalPrice: 59.99,
    discountedPrice: 29.99,
    imageUrl: "https://via.placeholder.com/300x200?text=Best+Buy+BOGO",
    affiliateLink: "https://www.bestbuy.com/deals",
    couponCode: "BOGOGAME",
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    terms: "Valid only on selected games. In-store pickup available.",
    isActive: true,
    featured: true,
    tags: ["bestbuy", "bogo", "games", "ps5", "xbox"]
  },
  {
    title: "Target - $20 Off $100 Purchase",
    description: "Save $20 on your next $100 purchase at Target",
    blogContent: "Target is offering a fantastic deal - get $20 off when you spend $100 or more! This is perfect for stocking up on household essentials, clothing, electronics, or home decor. With Target's wide selection of products, you'll easily find ways to use this coupon and save money on your shopping.",
    category: "shopping",
    store: {
      name: "Target",
      logo: "https://logo.clearbit.com/target.com",
      website: "https://www.target.com"
    },
    discountType: "fixed",
    discountValue: 20,
    originalPrice: 100,
    discountedPrice: 80,
    imageUrl: "https://via.placeholder.com/300x200?text=Target+$20+Off",
    affiliateLink: "https://www.target.com",
    couponCode: "SAVE20",
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    terms: "Minimum purchase of $100 required. Excludes gift cards.",
    isActive: true,
    featured: false,
    tags: ["target", "20off", "shopping", "household"]
  },
  {
    title: "Uber Eats - 30% Off First Order",
    description: "Get 30% off your first food delivery order",
    blogContent: "New to Uber Eats? Get 30% off your first order! This is the perfect opportunity to try out food delivery from your favorite local restaurants. Whether you're craving pizza, sushi, or a hearty burger, you can enjoy it at home with a great discount. Don't wait - this offer won't last forever!",
    category: "food",
    store: {
      name: "Uber Eats",
      logo: "https://logo.clearbit.com/ubereats.com",
      website: "https://www.ubereats.com"
    },
    discountType: "percentage",
    discountValue: 30,
    imageUrl: "https://via.placeholder.com/300x200?text=Uber+Eats+30%25+Off",
    affiliateLink: "https://www.ubereats.com",
    couponCode: "FIRST30",
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    terms: "Valid for new users only. Maximum discount $15.",
    isActive: true,
    featured: true,
    tags: ["ubereats", "food", "delivery", "newuser", "30off"]
  }
];

async function createSampleDeals() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing deals
    await Deal.deleteMany({});
    console.log('Cleared existing deals');

    // Insert sample deals
    const insertedDeals = await Deal.insertMany(sampleDeals);
    console.log(`Created ${insertedDeals.length} sample deals`);

    console.log('Sample deals created successfully!');
  } catch (error) {
    console.error('Error creating sample deals:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createSampleDeals();
