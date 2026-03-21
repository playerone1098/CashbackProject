import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cashback Rewards</h3>
            <p className="text-gray-300 text-sm">
              Your trusted platform for the best cashback deals and rewards from top brands.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/deals" className="text-gray-300 hover:text-white">Browse Deals</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-white">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/deals?category=shopping" className="text-gray-300 hover:text-white">Shopping</a></li>
              <li><a href="/deals?category=food" className="text-gray-300 hover:text-white">Food & Dining</a></li>
              <li><a href="/deals?category=travel" className="text-gray-300 hover:text-white">Travel</a></li>
              <li><a href="/deals?category=electronics" className="text-gray-300 hover:text-white">Electronics</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white">Facebook</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Twitter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Instagram</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 Cashback Rewards. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
