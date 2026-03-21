import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const DealDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimData, setClaimData] = useState({
    purchaseDate: '',
    transactionId: ''
  });

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

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to claim this deal');
      return;
    }

    setClaiming(true);
    try {
      const response = await axios.post('/api/rewards/claim', {
        dealId: id,
        purchaseDate: claimData.purchaseDate,
        transactionId: claimData.transactionId
      });

      alert('Cashback claimed successfully! It will be processed after confirmation.');
      setShowClaimForm(false);
      setClaimData({ purchaseDate: '', transactionId: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to claim cashback');
    } finally {
      setClaiming(false);
    }
  };

  const formatCashback = (deal) => {
    if (deal.cashbackType === 'percentage') {
      return `${deal.cashback}%`;
    }
    return `$${deal.cashback}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deal not found</h2>
          <Link to="/deals" className="text-purple-600 hover:text-purple-700">
            Browse other deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={deal.imageUrl || 'https://via.placeholder.com/800x400'}
            alt={deal.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-lg font-semibold">
            {formatCashback(deal)} Cashback
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
                  <span className="text-gray-600">Cashback:</span>
                  <span className="text-purple-600 font-semibold">{formatCashback(deal)}</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Get Cashback</h3>
              <ol className="space-y-2 text-gray-600">
                <li className="flex">
                  <span className="font-semibold mr-2">1.</span>
                  Click the "Claim Cashback" button below
                </li>
                <li className="flex">
                  <span className="font-semibold mr-2">2.</span>
                  Complete your purchase through our affiliate link
                </li>
                <li className="flex">
                  <span className="font-semibold mr-2">3.</span>
                  Submit your purchase details for verification
                </li>
                <li className="flex">
                  <span className="font-semibold mr-2">4.</span>
                  Receive cashback in your account after confirmation
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

          {deal.couponCode && (
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

          <div className="border-t pt-8">
            {!showClaimForm ? (
              <div className="text-center">
                <button
                  onClick={() => setShowClaimForm(true)}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700"
                >
                  Claim Cashback
                </button>
                {!isAuthenticated && (
                  <p className="text-gray-600 mt-4">
                    <Link to="/login" className="text-purple-600 hover:text-purple-700">
                      Login
                    </Link>
                    {' '}to claim this deal
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleClaim} className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Your Cashback</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={claimData.purchaseDate}
                    onChange={(e) => setClaimData({...claimData, purchaseDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={claimData.transactionId}
                    onChange={(e) => setClaimData({...claimData, transactionId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="Order confirmation number"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={claiming}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {claiming ? 'Claiming...' : 'Submit Claim'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClaimForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
