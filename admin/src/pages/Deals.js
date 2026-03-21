import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

export const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await api.get('/admin/all/deals');
        setDeals(response.data.deals);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleToggleActive = async (dealId, currentStatus) => {
    try {
      await api.patch(`/deals/${dealId}`, { isActive: !currentStatus });
      // Update local state
      setDeals(deals.map(deal => 
        deal._id === dealId ? { ...deal, isActive: !currentStatus } : deal
      ));
    } catch (error) {
      console.error('Error toggling deal status:', error);
      alert('Failed to update deal status');
    }
  };

  const handleDelete = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await api.delete(`/deals/${dealId}`);
        // Update local state
        setDeals(deals.filter(deal => deal._id !== dealId));
      } catch (error) {
        console.error('Error deleting deal:', error);
        alert('Failed to delete deal');
      }
    }
  };

  if (loading) {
    return <div>Loading deals...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Deals</h1>
        <Link
          to="/deals/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Deal
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Deal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deals.map((deal) => (
                <tr key={deal._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{deal.title}</div>
                      <div className="text-sm text-gray-500">{deal.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deal.store.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {deal.discountType === 'percentage' ? `${deal.discountValue}%` : 
                       deal.discountType === 'fixed' ? `$${deal.discountValue}` :
                       deal.discountType === 'free-shipping' ? 'FREE SHIPPING' :
                       deal.discountType === 'buy-one-get-one' ? 'BOGO' : 'SPECIAL'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deal.originalPrice && deal.discountedPrice ? (
                      <div>
                        <span className="text-gray-400 line-through text-sm">${deal.originalPrice}</span>
                        <span className="text-gray-900 font-medium ml-2">${deal.discountedPrice}</span>
                      </div>
                    ) : (
                      <span className="text-gray-900 font-medium">See deal</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      deal.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {deal.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {deal.featured && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/deals/${deal._id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleToggleActive(deal._id, deal.isActive)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {deal.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDelete(deal._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deals.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No deals found</div>
          <p className="text-gray-600">Create your first deal to get started!</p>
        </div>
      )}
    </div>
  );
};
