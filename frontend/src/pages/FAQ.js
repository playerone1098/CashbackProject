import React, { useState } from 'react';

export const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'rewards', name: 'Cashback & Rewards' },
    { id: 'coupons', name: 'Coupons & Deals' },
    { id: 'account', name: 'Account & Security' }
  ];

  const faqs = [
    {
      category: 'rewards',
      question: 'How do I earn cashback?',
      answer: 'Earning cashback is simple! First, browse our list of verified deals. Click on the "View Deal" button, and copy any listed coupon code. Next, use the provided link to navigate to the store, and shop normally. Once your purchase is complete and verified by the merchant, your cashback rewards are tracked and paid out to your account.'
    },
    {
      category: 'rewards',
      question: 'When will I receive my cashback payout?',
      answer: 'Typically, merchants verify purchases within 30 to 60 days to account for return windows and trial periods. Once verified, payouts are processed at the beginning of each calendar month. You can withdraw your balance via PayPal or Direct Deposit once you reach a minimum threshold of $15.'
    },
    {
      category: 'coupons',
      question: 'Are the coupon codes verified?',
      answer: 'Yes, absolutely. We have a dedicated team of deal verifiers who check and update every single coupon code daily. We also calculate real-time savings to ensure that you get exactly what is advertised without frustrated checkout attempts.'
    },
    {
      category: 'coupons',
      question: 'What should I do if a coupon code doesn’t work?',
      answer: 'While we verify all codes regularly, merchants sometimes expire promotions early. If a coupon doesn\'t work, you can click the "Report Issue" link on the deal page, and our verification team will review it immediately. In the meantime, try another active deal listed for that store.'
    },
    {
      category: 'account',
      question: 'Is it free to use Cashback Rewards?',
      answer: 'Yes! Our platform is 100% free to join and use. We receive commissions from retail partners for driving sales, and we share that commission directly with you in the form of cashback rewards.'
    },
    {
      category: 'account',
      question: 'How do you protect my account data?',
      answer: 'We prioritize your privacy and data security. We implement advanced SSL encryption across the platform, use secure hashed passwords, and never share or sell your personal details or shopping history with third-party advertising networks.'
    }
  ];

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Need help? Check out our quick answers below or search your question.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-10 space-y-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search FAQs (e.g. cashback, payment, security)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm text-gray-700"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  <span className="font-bold text-gray-900 md:text-lg">{faq.question}</span>
                  <span className={`w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                {/* Accordion body panel */}
                <div
                  className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 py-5 border-t border-gray-100' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-gray-800 text-lg mb-1">No FAQs Found</h3>
            <p className="text-gray-500 text-sm">
              We couldn't find any questions matching "{searchQuery}". Try adjusting your keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
