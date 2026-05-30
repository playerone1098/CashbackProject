import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link to="/deals" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              Deals
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
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
              <Link to="/deals" className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium">
                Deals
              </Link>
              <Link to="/about" className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium">
                About Us
              </Link>
              <Link to="/contact" className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium">
                Contact
              </Link>
              <Link to="/faq" className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium">
                FAQ
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
