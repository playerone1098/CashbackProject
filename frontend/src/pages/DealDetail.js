import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

export const DealDetail = () => {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await axios.get(`/api/deals/${id}`);
        setDeal(response.data);
      } catch (error) {
        console.error('Error fetching deal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

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

  const loadingHelmet = (
    <Helmet>
      <title>Loading Deal Details... | Cashback</title>
      <meta name="description" content="Loading verified cashback deals and promo codes. Grab your discount before it expires!" />
      <link rel="canonical" href={window.location.origin + window.location.pathname} />
    </Helmet>
  );

  if (loading) {
    return (
      <>
        {loadingHelmet}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </>
    );
  }

  const notFoundHelmet = (
    <Helmet>
      <title>Deal Not Found | Cashback</title>
      <meta name="description" content="The requested deal could not be found or has expired. Browse our other verified cashback and discount offers." />
      <link rel="canonical" href={window.location.origin + window.location.pathname} />
    </Helmet>
  );

  if (!deal) {
    return (
      <>
        {notFoundHelmet}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deal not found</h2>
            <Link to="/deals" className="text-purple-600 hover:text-purple-700">
              Browse other deals
            </Link>
          </div>
        </div>
      </>
    );
  }

  const keywordsStr = deal.tags && Array.isArray(deal.tags) && deal.tags.length > 0 
    ? deal.tags.join(', ') 
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": deal.title,
    "description": deal.description,
    "image": deal.imageUrl || "https://via.placeholder.com/800x400",
    "category": deal.category,
    "keywords": keywordsStr,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": deal.discountedPrice,
      "priceValidUntil": deal.expiryDate ? deal.expiryDate.split('T')[0] : undefined,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": deal.store.name
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{`${deal.title} - Save ${formatDiscount(deal)} at ${deal.store.name} | Cashback`}</title>
        <meta name="description" content={deal.description.substring(0, 155)} />
        {keywordsStr && <meta name="keywords" content={keywordsStr} />}
        <meta property="og:title" content={`${deal.title} - Save ${formatDiscount(deal)} at ${deal.store.name}`} />
        <meta property="og:description" content={deal.description} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={deal.imageUrl || 'https://via.placeholder.com/800x400'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={deal.title} />
        <meta name="twitter:description" content={deal.description} />
        <link rel="canonical" href={window.location.origin + window.location.pathname} />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={deal.imageUrl || 'https://via.placeholder.com/800x400'}
            alt={deal.title}
            className="w-full h-96 object-cover"
            fetchPriority="high"
          />
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-lg font-semibold">
            {formatDiscount(deal)}
          </div>
          {deal.featured && (
            <div className="absolute top-4 left-4 bg-purple-500 text-white px-4 py-2 rounded-lg text-lg font-semibold">
              Featured Deal
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center text-gray-600 mb-2">
              <span className="font-medium">{deal.store.name}</span>
              {deal.store.website && (
                <a
                  href={deal.store.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-purple-600 hover:text-purple-700"
                >
                  Visit Store →
                </a>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{deal.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{deal.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="text-gray-400 line-through">${deal.originalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discounted Price:</span>
                  <span className="text-xl font-bold text-gray-900">${deal.discountedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">You Save:</span>
                  <span className="text-green-600 font-semibold">
                    ${deal.originalPrice - deal.discountedPrice}
                  </span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-purple-600 font-semibold">{formatDiscount(deal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="capitalize">{deal.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expires:</span>
                  <span>{new Date(deal.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

             <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Save</h3>
              <ol className="space-y-2 text-gray-600">
                <li className="flex">
                  <span className="font-semibold mr-2">1.</span>
                  Copy the coupon code listed below (if available)
                </li>
                <li className="flex">
                  <span className="font-semibold mr-2">2.</span>
                  Click "Visit Store" to open the store's website
                </li>
                <li className="flex">
                  <span className="font-semibold mr-2">3.</span>
                  Apply the copied coupon code at checkout to enjoy your discount
                </li>
              </ol>
            </div>
          </div>

          {deal.terms && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">{deal.terms}</p>
              </div>
            </div>
          )}

          {deal.couponCode && deal.couponCode.trim() !== '' && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coupon Code</h3>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-purple-600">{deal.couponCode}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(deal.couponCode)}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Copy Code
                </button>
              </div>
            </div>
          )}

          {deal.store.website && (
            <div className="border-t pt-8 text-center">
              <a
                href={deal.store.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Go to Deal at {deal.store.name}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
