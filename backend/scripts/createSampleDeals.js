const mongoose = require('mongoose');
const Deal = require('../models/Deal');
require('dotenv').config();

const sampleDeals = [
  {
    title: "SBI Cashback Credit Card - Flat 5% Cashback on All Online Spends",
    description: "Earn flat 5% cashback on almost all online transactions with the SBI Cashback credit card.",
    blogContent: "SBI Cashback Credit Card has revolutionized cashback in India! With a flat 5% cashback on all online spends (excluding fuel, rent, utility bills, school fees, etc.), it is the ultimate reward card for online shoppers. The cashback is capped at ₹2,000 per billing cycle and is automatically credited to your statement monthly. Enjoy the freedom of earning premium cashback without brand exclusions.",
    category: "credit cards",
    store: {
      name: "SBI Card",
      logo: "https://logo.clearbit.com/sbicard.com",
      website: "https://www.sbicard.com"
    },
    discountType: "percentage",
    discountValue: 5,
    originalPrice: 999,
    discountedPrice: 999,
    imageUrl: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=600&q=80",
    affiliateLink: "https://www.sbicard.com/en/personal/credit-cards/shopping/cashback-sbi-card.page",
    couponCode: "APPLY-SBI",
    expiryDate: new Date('2028-12-31'),
    terms: "5% cashback capped at ₹2,000 per month. Annual fee waived on ₹2 Lakh spends.",
    isActive: true,
    featured: true,
    tags: ["sbi", "cashback", "creditcard", "online", "rewards"]
  },
  {
    title: "Swiggy HDFC Bank Credit Card - 10% Cashback on Swiggy Orders",
    description: "Get 10% cashback on Swiggy Instamart, Food, Dineout + 5% cashback on online partners.",
    blogContent: "For foodies and grocery lovers, the Swiggy HDFC Credit Card is a must-have. You get a massive 10% cashback on all Swiggy orders (Food delivery, Instamart, and Dineout dining). Furthermore, enjoy 5% cashback on popular e-commerce platforms like Amazon, Flipkart, Nike, Nykaa, and Zomato. All other eligible purchases earn 1% cashback. It is one of the highest value lifestyle cards on the market today.",
    category: "credit cards",
    store: {
      name: "HDFC Bank",
      logo: "https://logo.clearbit.com/hdfcbank.com",
      website: "https://www.hdfcbank.com"
    },
    discountType: "percentage",
    discountValue: 10,
    originalPrice: 500,
    discountedPrice: 500,
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
    affiliateLink: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/swiggy-hdfc-bank-credit-card",
    couponCode: "APPLY-HDFC",
    expiryDate: new Date('2028-12-31'),
    terms: "10% cashback capped at ₹1,500/month. 5% cashback capped at ₹1,500/month.",
    isActive: true,
    featured: true,
    tags: ["hdfc", "swiggy", "food", "creditcard", "cashback"]
  },
  {
    title: "Amazon Pay ICICI Card - Unlimited 5% Cashback on Amazon India",
    description: "Lifetime Free Card with 5% unlimited cashback for Prime members on Amazon India.",
    blogContent: "The Amazon Pay ICICI Bank Credit Card is one of India's most successful co-branded credit cards. It is a lifetime free card with no joining or annual fees. Amazon Prime members earn a flat, unlimited 5% cashback on all Amazon India shopping. Non-Prime members earn 3%. Partner merchants (like Uber, BookMyShow, etc.) and utility payments earn 2% cashback.",
    category: "credit cards",
    store: {
      name: "ICICI Bank",
      logo: "https://logo.clearbit.com/icicibank.com",
      website: "https://www.icicibank.com"
    },
    discountType: "percentage",
    discountValue: 5,
    originalPrice: 0,
    discountedPrice: 0,
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=600&q=80",
    affiliateLink: "https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-icici-bank-credit-card",
    couponCode: "APPLY-ICICI",
    expiryDate: new Date('2028-12-31'),
    terms: "Lifetime free card. Earnings are credited directly as Amazon Pay balance.",
    isActive: true,
    featured: false,
    tags: ["icici", "amazon", "amazonpay", "free", "cashback"]
  },
  {
    title: "Kiwi UPI Credit Card - Flat 2% Cashback on All UPI Spends",
    description: "Earn flat 2% cashback on scan and pay UPI transactions using Kiwi RuPay credit card.",
    blogContent: "Kiwi introduces a new era of payments! Link your Kiwi Axis Bank RuPay Credit Card with your UPI app and earn a flat 2% cashback as Kiwi KwiCoins on every 'Scan & Pay' transaction at merchant outlets. Say goodbye to zero rewards on UPI payments and leverage the combined power of credit lines and UPI seamlessness. Applying is 100% digital via the Kiwi mobile app.",
    category: "upi apps",
    store: {
      name: "Kiwi UPI",
      logo: "https://logo.clearbit.com/gokiwi.in",
      website: "https://www.gokiwi.in"
    },
    discountType: "percentage",
    discountValue: 2,
    originalPrice: 0,
    discountedPrice: 0,
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
    affiliateLink: "https://www.gokiwi.in",
    couponCode: "KIWIUPI2",
    expiryDate: new Date('2027-12-31'),
    terms: "Lifetime free. Valid only on merchant UPI transactions. 1 KwiCoin = ₹0.25.",
    isActive: true,
    featured: true,
    tags: ["kiwi", "upi", "rupay", "creditcard", "cashback"]
  },
  {
    title: "Google Pay UPI - Earn up to ₹21 on First UPI Scan & Pay",
    description: "New GPay users get flat cashback on sending money or paying a merchant.",
    blogContent: "New to Google Pay? Get an instant cashback of up to ₹21 straight into your bank account when you do your first UPI transaction of ₹1 or more. Simply scan any QR code or enter a UPI ID, complete the payment, and unlock your welcome scratch card reward. Start your cashless journey today with GPay's highly secure UPI network.",
    category: "upi apps",
    store: {
      name: "Google Pay",
      logo: "https://logo.clearbit.com/google.com",
      website: "https://pay.google.com"
    },
    discountType: "fixed",
    discountValue: 21,
    originalPrice: 0,
    discountedPrice: 0,
    imageUrl: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=600&q=80",
    affiliateLink: "https://pay.google.com",
    couponCode: "GPAY21",
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    terms: "Valid for first-time GPay UPI users only. Minimum transaction of ₹1 required.",
    isActive: true,
    featured: false,
    tags: ["gpay", "googlepay", "upi", "firstpay", "cashback"]
  },
  {
    title: "CRED Pay - Up to ₹250 Cashback on Utility & Credit Bills",
    description: "Pay your credit card bills or household utilities using CRED UPI and get assured cashback.",
    blogContent: "Pay your bills smart. Use CRED Pay UPI to clear your electricity, water, broadband, or credit card bills. Get up to ₹250 instant cashback or win CRED Coins which can be redeemed for premium rewards and discounts on high-end brands. Trusted by millions of credit-worthy users for smooth and fast payments.",
    category: "upi apps",
    store: {
      name: "CRED",
      logo: "https://logo.clearbit.com/cred.club",
      website: "https://www.cred.club"
    },
    discountType: "fixed",
    discountValue: 250,
    originalPrice: 0,
    discountedPrice: 0,
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
    affiliateLink: "https://www.cred.club",
    couponCode: "CREDPAY250",
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    terms: "Valid on first credit bill or utility payment via CRED UPI. Min transaction ₹1000.",
    isActive: true,
    featured: true,
    tags: ["cred", "upi", "billpay", "rewards", "coins"]
  },
  {
    title: "Amazon India - Flat 10% Cashback on Fashion & Beauty",
    description: "Earn flat 10% cashback up to ₹200 on all fashion, clothing and cosmetics purchases.",
    blogContent: "Upgrade your wardrobe with Amazon Fashion! Shop the top apparel, footwear, watches, and beauty products from popular brands and get an instant 10% cashback (up to ₹200) credited directly to your Amazon Pay wallet. Prime members enjoy free shipping with no minimum purchase requirement.",
    category: "shopping",
    store: {
      name: "Amazon India",
      logo: "https://logo.clearbit.com/amazon.in",
      website: "https://www.amazon.in"
    },
    discountType: "percentage",
    discountValue: 10,
    originalPrice: 1500,
    discountedPrice: 1350,
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    affiliateLink: "https://www.amazon.in",
    couponCode: "AMZNFASH10",
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    terms: "Capped at ₹200 cashback. Credited as Amazon Pay balance within 24 hours.",
    isActive: true,
    featured: false,
    tags: ["amazon", "fashion", "shopping", "beauty", "wallet"]
  },
  {
    title: "Zomato Dineout - Up to 40% Off + 10% Extra Cashback",
    description: "Book restaurant tables via Zomato Dineout and get up to 40% discount plus extra bank cashback.",
    blogContent: "Dine out like royalty and save big! Book your tables at thousands of premium partner restaurants using Zomato Dineout. Pay your restaurant bills through Zomato Pay and enjoy up to 40% instant discount. Plus, pay using select credit cards (like HSBC or HDFC) to get an extra 10% cashback on your payments. Feast more, pay less!",
    category: "food",
    store: {
      name: "Zomato",
      logo: "https://logo.clearbit.com/zomato.com",
      website: "https://www.zomato.com"
    },
    discountType: "percentage",
    discountValue: 40,
    originalPrice: 1000,
    discountedPrice: 600,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
    affiliateLink: "https://www.zomato.com",
    couponCode: "ZOMATOPAY",
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    terms: "Valid only on paying via Zomato Pay at select partner restaurants.",
    isActive: true,
    featured: true,
    tags: ["zomato", "dineout", "food", "dining", "discount"]
  },
  {
    title: "MakeMyTrip Flights - Flat ₹1,500 Off on Domestic Flights",
    description: "Book domestic flight tickets and save flat ₹1,500 using select credit cards or UPI apps.",
    blogContent: "Planning your next vacation or a trip back home? Book your domestic flight tickets on MakeMyTrip and save a flat ₹1,500 on a minimum transaction value of ₹5,000. This offer is valid on both one-way and round-trip flight bookings across all major domestic airlines. Enter the coupon code at the payment page to claim your discount.",
    category: "travel",
    store: {
      name: "MakeMyTrip",
      logo: "https://logo.clearbit.com/makemytrip.com",
      website: "https://www.makemytrip.com"
    },
    discountType: "fixed",
    discountValue: 1500,
    originalPrice: 6000,
    discountedPrice: 4500,
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
    affiliateLink: "https://www.makemytrip.com",
    couponCode: "MMTFLIGHT",
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    terms: "Min booking amount ₹5,000. Once per user during the sale period.",
    isActive: true,
    featured: false,
    tags: ["mmt", "makemytrip", "flight", "travel", "discount"]
  },
  {
    title: "OneCard Credit Card - Metal Card with 5x Rewards & No Joining Fee",
    description: "Apply for OneCard, get a premium metal card with 5x reward points on your top spending categories.",
    blogContent: "Experience the future of credit cards with OneCard. It is a premium metal credit card that comes with zero joining and zero annual fees. Manage your card seamlessly via the interactive OneCard app. Earn 5x reward points on your top two spending categories each month. Points are credited instantly and can be redeemed directly as statement cash.",
    category: "credit cards",
    store: {
      name: "OneCard",
      logo: "https://logo.clearbit.com/getonecard.app",
      website: "https://www.getonecard.app"
    },
    discountType: "percentage",
    discountValue: 0,
    originalPrice: 0,
    discountedPrice: 0,
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
    affiliateLink: "https://www.getonecard.app",
    couponCode: "ONECARDMETAL",
    expiryDate: new Date('2028-12-31'),
    terms: "Lifetime free card. Subject to credit score checks. 5x rewards credited instantly.",
    isActive: true,
    featured: false,
    tags: ["onecard", "metalcard", "rewards", "free", "creditcard"]
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
