import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

export const Deals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page')) || 1;

  const getSeoMetadata = () => {
    let title = 'Latest Cashback Deals, Discounts & Promo Codes | Cashback';
    let description = 'Browse all our verified cashback deals, card rewards, and active promo codes. Shop and save now!';

    if (category && category !== 'all') {
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      title = `${formattedCategory} Cashback Deals & Active Coupon Codes | Cashback`;
      description = `Find the best cashback rewards, discount offers, and coupon codes in the ${category} category. Save money on every purchase.`;
    }

    if (search) {
      title = `Search Results for "${search}" | Cashback Deals`;
      description = `Discover active coupon codes and cashback rewards matching your search for "${search}".`;
    }

    return { title, description };
  };

  const { title: seoTitle, description: seoDesc } = getSeoMetadata();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/deals/categories/list');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        params.append('page', page);
        params.append('limit', 12);

        const response = await axios.get(`/api/deals?${params.toString()}`);
        setDeals(response.data.deals);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [category, search, page]);

  const handleCategoryChange = (newCategory) => {
    const params = new URLSearchParams();
    if (newCategory && newCategory !== 'all') params.append('category', newCategory);
    if (search) params.append('search', search);
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (searchValue) params.append('search', searchValue);
    setSearchParams(params);
  };

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

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    params.append('page', newPage);
    setSearchParams(params);
  };

  const helmet = (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={window.location.origin + window.location.pathname} />
    </Helmet>
  );

  if (loading) {
    return (
      <>
        {helmet}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {helmet}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Latest Deals & Offers</h1>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                name="search"
                placeholder="Search deals..."
                defaultValue={search || ''}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category || category === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                  category === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {deals.length} of {pagination.total} deals
        </p>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {deals.map((deal) => (
          <div key={deal._id} className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
            <div className="relative">
              <img
                src={deal.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={deal.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                {formatDiscount(deal)}
              </div>
              {deal.featured && (
                <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  Featured
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-1">{deal.store.name}</div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{deal.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.description}</p>
              
              {/* Coupon Code Display */}
              {deal.couponCode && deal.couponCode.trim() !== '' && (
                <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-3">
                  <div className="text-xs text-gray-500 mb-1">Coupon Code:</div>
                  <div className="font-mono font-bold text-green-600 text-center">{deal.couponCode}</div>
                </div>
              )}
              
              {deal.originalPrice && deal.discountedPrice && (
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-gray-400 line-through text-sm">${deal.originalPrice}</span>
                    <span className="text-lg font-bold text-gray-900 ml-2">${deal.discountedPrice}</span>
                  </div>
                  <div className="text-green-600 font-semibold text-sm">
                    Save ${deal.originalPrice - deal.discountedPrice}
                  </div>
                </div>
              )}
              
              <a
                href={`/deals/${deal._id}`}
                className="w-full bg-purple-600 text-white py-2 rounded text-center hover:bg-purple-700 block"
              >
                View Deal Details
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {[...Array(pagination.pages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-lg ${
                  page === pageNum
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pagination.pages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {deals.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No deals found</div>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};
