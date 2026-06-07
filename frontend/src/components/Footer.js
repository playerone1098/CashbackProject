import React from 'react';
import { Link } from 'react-router-dom';
import { VERSION } from '../version';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cashback Rewards</h3>
            <p className="text-gray-300 text-sm">
              Your trusted platform for the best cashback deals and rewards from top brands.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/deals" className="text-gray-300 hover:text-white">Browse Deals</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/deals?category=shopping" className="text-gray-300 hover:text-white">Shopping</Link></li>
              <li><Link to="/deals?category=food" className="text-gray-300 hover:text-white">Food & Dining</Link></li>
              <li><Link to="/deals?category=travel" className="text-gray-300 hover:text-white">Travel</Link></li>
              <li><Link to="/deals?category=electronics" className="text-gray-300 hover:text-white">Electronics</Link></li>
              <li><Link to="/deals?category=credit cards" className="text-gray-300 hover:text-white">Credit Cards</Link></li>
              <li><Link to="/deals?category=upi apps" className="text-gray-300 hover:text-white">UPI & Wallet Apps</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom copyright and version */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Cashback Rewards. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-xs text-gray-500">v{VERSION}</p>
        </div>
      </div>
    </footer>
  );
};
