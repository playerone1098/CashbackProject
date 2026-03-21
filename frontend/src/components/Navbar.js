import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-purple-600">Cashback</span>
              <span className="text-2xl font-bold text-green-500">Rewards</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/deals" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              Deals
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/rewards" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                  My Rewards
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-purple-600 border border-purple-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium">
                Home
              </Link>
              <Link to="/deals" className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium">
                Deals
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium">
                    Dashboard
                  </Link>
                  <Link to="/rewards" className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium">
                    My Rewards
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-red-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-purple-600 px-3 py-2 rounded-md text-base font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="block bg-purple-600 text-white px-3 py-2 rounded-md text-base font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
