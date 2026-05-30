import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

export const Analytics = () => {
  const [stats, setStats] = useState({
    totalPageViews: 0,
    totalDealViews: 0,
    pageViewsByPath: [],
    dealViews: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const response = await api.get('/analytics/stats');
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics stats:', err);
      setError('Could not retrieve analytics data. Make sure you are logged in as an administrator.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getEngagementRate = () => {
    if (!stats.totalPageViews) return '0%';
    const rate = (stats.totalDealViews / stats.totalPageViews) * 100;
    return `${rate.toFixed(1)}%`;
  };

  const getMostPopularRoute = () => {
    if (!stats.pageViewsByPath || stats.pageViewsByPath.length === 0) return 'None';
    return stats.pageViewsByPath[0]._id;
  };

  const formatPathName = (path) => {
    if (!path) return 'Unknown';
    if (path.includes('category=')) {
      const parts = path.split('category=');
      if (parts[1]) {
        const category = decodeURIComponent(parts[1].split('&')[0].replace(/\+/g, ' '));
        // Capitalize category words for a highly professional feel
        return category.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
    
    if (path === '/') return 'Home Page';
    if (path === '/deals') return 'All Deals';
    if (path === '/about') return 'About Us';
    if (path === '/contact') return 'Contact Us';
    if (path === '/faq') return 'FAQ Page';
    if (path.startsWith('/deals/')) return 'Deal Detail';
    
    return path;
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600 font-semibold">Gathering site intelligence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative ambient blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
        <div className="absolute -bottom-10 left-10 w-60 h-60 bg-blue-500 opacity-10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Intelligence & Analytics</h1>
            <p className="text-blue-200 mt-2 max-w-xl text-sm md:text-base">
              Monitor real-time user engagement, page traffic popularity, and individual deal performance.
            </p>
          </div>
          <div>
            <button
              onClick={fetchAnalytics}
              disabled={refreshing}
              className={`flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 transition px-5 py-2.5 rounded-xl font-medium ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <svg
                className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
              </svg>
              <span>{refreshing ? 'Synchronizing...' : 'Refresh Intel'}</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-sm flex items-center space-x-3">
          <span className="text-xl">⚠️</span>
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Page Views */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-full">Views</span>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-lg font-bold">📄</div>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold">Total Page Views</h3>
          <p className="text-4xl font-extrabold text-gray-900 mt-2 tabular-nums">{stats.totalPageViews}</p>
          <span className="text-xs text-green-600 font-semibold flex items-center mt-2">
            <span>⚡ Page view actions logged</span>
          </span>
        </div>

        {/* Total Deal clicks/views */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-widest text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-full">Deals</span>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-lg font-bold">🎯</div>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold">Total Deal Clicks</h3>
          <p className="text-4xl font-extrabold text-gray-900 mt-2 tabular-nums">{stats.totalDealViews}</p>
          <span className="text-xs text-purple-600 font-semibold flex items-center mt-2">
            <span>🔥 High intent interactions</span>
          </span>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full">Engagement</span>
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-lg font-bold">📈</div>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold">View to Deal Ratio</h3>
          <p className="text-4xl font-extrabold text-gray-900 mt-2 tabular-nums">{getEngagementRate()}</p>
          <span className="text-xs text-gray-500 font-semibold flex items-center mt-2">
            <span>📊 Percentage of high intent clicks</span>
          </span>
        </div>

        {/* Top Active Route */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-widest text-amber-600 uppercase bg-amber-50 px-2.5 py-1 rounded-full">Hottest</span>
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-lg font-bold">🔥</div>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold">Top Active Page</h3>
          <p className="text-xl font-extrabold text-gray-900 mt-3 truncate" title={getMostPopularRoute()}>
            {formatPathName(getMostPopularRoute())}
          </p>
          <span className="text-xs text-amber-600 font-semibold flex items-center mt-2">
            <span>✨ Most visited endpoint</span>
          </span>
        </div>
      </div>

      {/* Main Aggregated Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Visited Pages List */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Traffic Distribution by Path</h2>
            <span className="text-xs text-gray-500 font-medium">Top 10 Routes</span>
          </div>

          <div className="space-y-5">
            {stats.pageViewsByPath.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-12">No route tracking data recorded yet.</p>
            ) : (
              stats.pageViewsByPath.map((item, index) => {
                const percentage = stats.totalPageViews
                  ? ((item.count / stats.totalPageViews) * 100).toFixed(0)
                  : 0;

                // Color themes depending on priority index
                const barColors = [
                  'bg-blue-600',
                  'bg-indigo-600',
                  'bg-purple-600',
                  'bg-pink-600',
                  'bg-rose-500'
                ];
                const barColor = barColors[index % barColors.length];

                return (
                  <div key={item._id} className="group">
                    <div className="flex items-center justify-between mb-1.5 text-sm font-medium">
                      <span className="text-gray-700 bg-gray-50 group-hover:bg-gray-100 px-2.5 py-1 rounded-xl transition" title={item._id}>
                        {formatPathName(item._id)}
                      </span>
                      <span className="text-gray-900 tabular-nums">
                        {item.count} views <span className="text-gray-400 font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Deal Click Leaderboard */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Popular Deals Leaderboard</h2>
            <span className="text-xs text-gray-500 font-medium">Ranked by clicks</span>
          </div>

          {stats.dealViews.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-12">
              No deal interaction analytics recorded yet. Users must click on a deal card to open the deal details view.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Rank</th>
                    <th className="pb-3 font-semibold">Deal Name</th>
                    <th className="pb-3 text-right font-semibold">Views/Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.dealViews.map((deal, idx) => (
                    <tr key={idx} className="group hover:bg-gray-50/50 transition">
                      <td className="py-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold ${
                          idx === 0 ? 'bg-amber-100 text-amber-800' :
                          idx === 1 ? 'bg-slate-100 text-slate-800' :
                          idx === 2 ? 'bg-orange-100 text-orange-800' :
                          'text-gray-400'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition truncate max-w-xs sm:max-w-md">
                          {deal.dealTitle || 'Unnamed Deal'}
                        </p>
                        {deal.dealId && (
                          <span className="text-xs text-gray-400 font-mono">ID: {deal.dealId}</span>
                        )}
                      </td>
                      <td className="py-3 text-right font-bold text-gray-900 tabular-nums">
                        {deal.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
