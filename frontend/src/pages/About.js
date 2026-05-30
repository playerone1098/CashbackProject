import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>About Us | Learn How We Help You Save | Cashback</title>
        <meta name="description" content="Learn about our mission, vision, and core values. We bridge the gap between world-class brands and smart shoppers, delivering premium cashback and verified deals." />
        <meta property="og:title" content="About Us - Cashback Platform" />
        <meta property="og:description" content="Learn about our mission, vision, and core values. We deliver premium cashback and verified deals to help you save effortlessly." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.origin + window.location.pathname} />
      </Helmet>
      {/* Hero Section */}
      <section className="text-center py-16 cashback-gradient rounded-3xl text-white mb-16 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Empowering Your Shopping Journey
          </h1>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            We bridge the gap between world-class brands and smart shoppers, delivering premium cashback opportunities and verified deals to help you save effortlessly.
          </p>
          <Link
            to="/deals"
            className="inline-block bg-white text-purple-700 px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-purple-50 transition-all hover:scale-105 duration-200"
          >
            Explore Deals
          </Link>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To build the most rewarding shopping platform on the web. We strive to curate high-value cashback offers and daily updated coupons, helping our community make smarter financial decisions every day.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            A world where no online purchase is made without rewards. We envision a future where retail partnerships and innovative technology empower consumers globally to get maximum value from every dollar spent.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'Integrity First',
              desc: 'Every coupon code is verified daily. No dead links, no fake counts—just honest rewards.',
              color: 'border-blue-500',
              bg: 'bg-blue-50',
              text: 'text-blue-600'
            },
            {
              title: 'Customer Obsession',
              desc: 'We place our users’ savings and experience at the center of every feature we design.',
              color: 'border-purple-500',
              bg: 'bg-purple-50',
              text: 'text-purple-600'
            },
            {
              title: 'Innovation Always',
              desc: 'Pioneering better cashback automation and visual tools to enhance retail browsing.',
              color: 'border-green-500',
              bg: 'bg-green-50',
              text: 'text-green-600'
            },
            {
              title: 'Strong Partnerships',
              desc: 'We cultivate strong relations with hundreds of trusted global brands to source elite discounts.',
              color: 'border-yellow-500',
              bg: 'bg-yellow-50',
              text: 'text-yellow-600'
            }
          ].map((val, idx) => (
            <div key={idx} className={`bg-white p-6 rounded-2xl border-t-4 ${val.color} shadow-sm hover:shadow-md transition-shadow duration-300`}>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{val.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats / Numbers section */}
      <section className="bg-gray-900 text-white rounded-3xl p-12 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-purple-400 mb-2">99.9%</div>
            <div className="text-gray-300 font-medium">Coupon Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-green-400 mb-2">$5M+</div>
            <div className="text-gray-300 font-medium">Saved by Users</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-blue-400 mb-2">24/7</div>
            <div className="text-gray-300 font-medium">Support & Verification</div>
          </div>
        </div>
      </section>
    </div>
  );
};
