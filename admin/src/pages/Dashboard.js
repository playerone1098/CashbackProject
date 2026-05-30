import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDeals: 0,
    featuredDeals: 0
  });
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dealsResponse = await api.get('/deals/admin/all?page=1&limit=1');
        const dealsListResponse = await api.get('/deals/admin/all?limit=100');
        const featuredCount = dealsListResponse.data.deals.filter(deal => deal.featured).length;

        setStats({
          totalDeals: dealsResponse.data.pagination?.total || 0,
          featuredDeals: featuredCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalDeals: 0,
          featuredDeals: 0
        });
      }
    };

    const fetchStatus = async () => {
      try {
        const res = await api.get('/status');
        setDbStatus(res.data.database);
        setBackendStatus(res.data.backend);
      } catch (error) {
        console.error('Error fetching status:', error);
        setDbStatus('Setup Required');
        setBackendStatus('Disconnected');
      }
    };

    const loadData = async () => {
      await Promise.all([fetchStats(), fetchStatus()]);
      setLoading(false);
    };

    loadData();
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            <div className="text-gray-600 text-sm">Create, edit and manage coupon deals</div>
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Backend API:</span>
            <span className={backendStatus === 'Connected' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {backendStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Database:</span>
            <span className={dbStatus === 'Connected' ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
              {dbStatus}
            </span>
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
