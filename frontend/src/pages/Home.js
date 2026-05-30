import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Home = () => {
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealsResponse, categoriesResponse] = await Promise.all([
          axios.get('/api/deals?featured=true&limit=6'),
          axios.get('/api/deals/categories/list')
        ]);
        
        setFeaturedDeals(dealsResponse.data.deals);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDiscount = (deal) => {
    if (deal.discountType === 'percentage') {
      return `${deal.discountValue}% OFF`;
    }
    if (deal.discountType === 'fixed') {
      return `$${deal.discountValue} OFF`;
    }
    if (deal.discountType === 'free-shipping') {
      return 'FREE SHIPPING';
    }
    if (deal.discountType === 'buy-one-get-one') {
      return 'BUY 1 GET 1';
    }
    return 'SPECIAL OFFER';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Real-time Ticker Banner */}
      <div className="bg-purple-600 text-white py-3 overflow-hidden relative shadow-sm w-full -mt-8 mb-8">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="inline-block text-sm font-semibold tracking-wide px-4">
            ⚡ REAL-TIME UPDATES: Our dedicated team is continuously verifying and updating cashback offers and coupon codes hourly to guarantee you the absolute best chance of saving! Grab your favorite deals before they expire! &nbsp;&bull;&nbsp;
          </span>
          <span className="inline-block text-sm font-semibold tracking-wide px-4">
            ⚡ REAL-TIME UPDATES: Our dedicated team is continuously verifying and updating cashback offers and coupon codes hourly to guarantee you the absolute best chance of saving! Grab your favorite deals before they expire! &nbsp;&bull;&nbsp;
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Get <span className="text-purple-600">Cashback</span> on Every Purchase
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover amazing deals from your favorite brands and earn cashback rewards on every purchase
        </p>
        <div className="flex justify-center">
          <Link
            to="/deals"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Browse Deals
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/deals?category=${category}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-2xl mb-2 capitalize">{category}</div>
              <div className="text-gray-600 text-sm">View Deals</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Deals</h2>
          <Link to="/deals" className="text-purple-600 hover:text-purple-700 font-semibold">
            View All Deals →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDeals.map((deal) => (
            <div key={deal._id} className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
              <div className="relative">
                <img
                  src={deal.imageUrl || 'https://via.placeholder.com/300x200'}
                  alt={deal.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  {formatDiscount(deal)}
                </div>
              </div>
              
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">{deal.store.name}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{deal.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-gray-400 line-through text-sm">${deal.originalPrice}</span>
                    <span className="text-xl font-bold text-gray-900 ml-2">${deal.discountedPrice}</span>
                  </div>
                  <div className="text-green-600 font-semibold">
                    Save ${deal.originalPrice - deal.discountedPrice}
                  </div>
                </div>
                
                <Link
                  to={`/deals/${deal._id}`}
                  className="w-full bg-purple-600 text-white py-2 rounded text-center hover:bg-purple-700 block"
                >
                  View Deal
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Browse Deals</h3>
            <p className="text-gray-600">Find the best deals and active coupons from your favorite brands</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Copy Coupon Code</h3>
            <p className="text-gray-600">Get immediate access to coupon codes and discount details</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Shop & Save</h3>
            <p className="text-gray-600">Apply the code at checkout to save money on your purchase</p>
          </div>
        </div>
      </section>
    </div>
  </>
);
};
