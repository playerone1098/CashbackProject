import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/deals/categories/list');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories in Navbar:', err);
      }
    };
    fetchCategories();
  }, []);

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

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/deals" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition">
              Deals
            </Link>

            {/* Premium Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium focus:outline-none transition"
              >
                <span>Categories</span>
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <>
                  {/* Invisible backdrop to dismiss dropdown */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                  
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-20 overflow-hidden divide-y divide-gray-100 animate-fade-in">
                    <div className="py-1.5">
                      {categories.map((category) => (
                        <Link
                          key={category}
                          to={`/deals?category=${category}`}
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 capitalize font-medium transition"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link to="/about" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition">
              Contact
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition">
              FAQ
            </Link>
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
              <Link
                to="/deals"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
              >
                Deals
              </Link>

              {/* Mobile Categories Collapsible */}
              <div className="border-t border-b border-gray-100 py-1">
                <button
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium focus:outline-none"
                >
                  <span>Categories</span>
                  <svg
                    className={`ml-1 h-5 w-5 transition-transform duration-200 ${isMobileDropdownOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isMobileDropdownOpen && (
                  <div className="pl-4 space-y-1 mt-1 bg-gray-50 rounded-xl py-2">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        to={`/deals?category=${category}`}
                        onClick={() => {
                          setIsMobileDropdownOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className="block text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium capitalize"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
              >
                Contact
              </Link>
              <Link
                to="/faq"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
              >
                FAQ
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
