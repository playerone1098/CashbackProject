import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCashback: 0,
    pendingCashback: 0,
    availableBalance: 0,
    recentDeals: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [rewardsResponse, dealsResponse] = await Promise.all([
          axios.get('/api/rewards/my?limit=5'),
          axios.get('/api/deals?limit=6')
        ]);
        
        const rewards = rewardsResponse.data.rewards;
        const totalCashback = rewards
          .filter(r => r.status === 'confirmed')
          .reduce((sum, r) => sum + r.cashbackAmount, 0);
        const pendingCashback = rewards
          .filter(r => r.status === 'pending')
          .reduce((sum, r) => sum + r.cashbackAmount, 0);

        setStats({
          totalCashback,
          pendingCashback,
          availableBalance: user?.earnings?.availableBalance || 0,
          recentDeals: dealsResponse.data.deals
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
        <p className="text-gray-600 mt-2">Here's your cashback overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Cashback Earned</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalCashback.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Cashback</p>
              <p className="text-2xl font-bold text-yellow-600">${stats.pendingCashback.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Available Balance</p>
              <p className="text-2xl font-bold text-purple-600">${stats.availableBalance.toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/deals"
            className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center hover:bg-purple-100 transition-colors"
          >
            <div className="text-purple-600 font-semibold">Browse Deals</div>
            <div className="text-gray-600 text-sm mt-1">Find new cashback offers</div>
          </Link>
          <Link
            to="/rewards"
            className="bg-green-50 border border-green-200 rounded-lg p-4 text-center hover:bg-green-100 transition-colors"
          >
            <div className="text-green-600 font-semibold">View Rewards</div>
            <div className="text-gray-600 text-sm mt-1">Track your earnings</div>
          </Link>
          <Link
            to="/profile"
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors"
          >
            <div className="text-blue-600 font-semibold">Update Profile</div>
            <div className="text-gray-600 text-sm mt-1">Manage your account</div>
          </Link>
        </div>
      </div>

      {/* Recent Deals */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Latest Deals</h2>
          <Link to="/deals" className="text-purple-600 hover:text-purple-700 font-semibold">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.recentDeals.map((deal) => (
            <div key={deal._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-600">{deal.store.name}</div>
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {formatCashback(deal)} back
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{deal.title}</h3>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-400 line-through text-sm">${deal.originalPrice}</span>
                  <span className="font-bold text-gray-900 ml-2">${deal.discountedPrice}</span>
                </div>
                <Link
                  to={`/deals/${deal._id}`}
                  className="text-purple-600 hover:text-purple-700 text-sm font-semibold"
                >
                  View Deal
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
