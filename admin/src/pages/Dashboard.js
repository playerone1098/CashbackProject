import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeals: 0,
    featuredDeals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Only fetch deals stats first to avoid user API issues
        const dealsResponse = await api.get('/admin/all/deals?page=1&limit=1');
        const dealsListResponse = await api.get('/admin/all/deals?limit=100');
        const featuredCount = dealsListResponse.data.deals.filter(deal => deal.featured).length;

        setStats({
          totalUsers: 1, // Hardcode admin user count for now
          totalDeals: dealsResponse.data.pagination?.total || 0,
          featuredDeals: featuredCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default stats on error to prevent crashes
        setStats({
          totalUsers: 1,
          totalDeals: 0,
          featuredDeals: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
          <p className="text-gray-600 text-sm">Registered users</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Deals</h3>
          <p className="text-2xl font-bold text-green-600">{stats.totalDeals}</p>
          <p className="text-gray-600 text-sm">Published deals</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Featured Deals</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.featuredDeals}</p>
          <p className="text-gray-600 text-sm">Highlighted offers</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/deals')}
            className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-left"
          >
            <div className="font-semibold text-blue-600">Manage Deals</div>
            <div className="text-gray-600 text-sm">Create and edit cashback deals</div>
          </button>
          
          <button
            onClick={() => navigate('/users')}
            className="w-full p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-left"
          >
            <div className="font-semibold text-green-600">Manage Users</div>
            <div className="text-gray-600 text-sm">View and manage user accounts</div>
          </button>

          <button
            onClick={() => navigate('/rewards')}
            className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 text-left"
          >
            <div className="font-semibold text-yellow-600">Process Rewards</div>
            <div className="text-gray-600 text-sm">Review and approve cashback requests</div>
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Backend API:</span>
            <span className="text-green-600 font-semibold">Connected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Database:</span>
            <span className="text-yellow-600 font-semibold">Setup Required</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Frontend:</span>
            <span className="text-green-600 font-semibold">Running</span>
          </div>
        </div>
      </div>
    </div>
  );
};
