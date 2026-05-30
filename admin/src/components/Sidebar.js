import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/deals', icon: '🎯', label: 'Deals' },
    { path: '/categories', icon: '📂', label: 'Categories' },
    { path: '/analytics', icon: '📈', label: 'Analytics' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen">
      <div className="p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-blue-400">Deal Blog</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
