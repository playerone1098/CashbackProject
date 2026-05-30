import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axios';

export const DealForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    blogContent: '',
    category: 'shopping',
    store: {
      name: '',
      logo: '',
      website: ''
    },
    discountType: 'percentage',
    discountValue: 0,
    originalPrice: 0,
    discountedPrice: 0,
    imageUrl: '',
    affiliateLink: '',
    couponCode: '',
    expiryDate: '',
    terms: '',
    isActive: true,
    featured: false,
    tags: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isEditing) {
      const fetchDeal = async () => {
        try {
          const response = await api.get(`/deals/${id}`);
          const deal = response.data;
          setFormData({
            title: deal.title || '',
            description: deal.description || '',
            blogContent: deal.blogContent || '',
            category: deal.category || 'shopping',
            store: {
              name: deal.store?.name || '',
              logo: deal.store?.logo || '',
              website: deal.store?.website || ''
            },
            discountType: deal.discountType || 'percentage',
            discountValue: deal.discountValue || 0,
            originalPrice: deal.originalPrice || 0,
            discountedPrice: deal.discountedPrice || 0,
            imageUrl: deal.imageUrl || '',
            affiliateLink: deal.affiliateLink || '',
            couponCode: deal.couponCode || '',
            expiryDate: deal.expiryDate ? new Date(deal.expiryDate).toISOString().split('T')[0] : '',
            terms: deal.terms || '',
            isActive: deal.isActive !== undefined ? deal.isActive : true,
            featured: deal.featured || false,
            tags: deal.tags ? deal.tags.join(', ') : ''
          });
        } catch (error) {
          setError('Failed to load deal. Please try again.');
        }
      };

      fetchDeal();
    }
  }, [id, isEditing]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/deals/categories/list');
        setCategories(response.data);
        if (!isEditing && response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            category: response.data.includes('shopping') ? 'shopping' : response.data[0]
          }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, [isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = {
        ...formData,
        discountValue: Number(formData.discountValue) || 0,
        originalPrice: Number(formData.originalPrice) || 0,
        discountedPrice: Number(formData.discountedPrice) || 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null
      };

      // Remove discountValue for free-shipping and buy-one-get-one types
      if (formData.discountType === 'free-shipping' || formData.discountType === 'buy-one-get-one') {
        submitData.discountValue = 0;
      }

      if (isEditing) {
        await api.put(`/deals/${id}`, submitData);
        setSuccess('Deal updated successfully!');
      } else {
        await api.post('/deals', submitData);
        setSuccess('Deal created successfully!');
      }

      // Navigate only on success after a short delay
      setTimeout(() => {
        navigate('/deals');
      }, 1500);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save deal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEditing ? 'Edit Deal' : 'Create New Deal'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Deal Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Blog Content *
                </label>
                <textarea
                  name="blogContent"
                  value={formData.blogContent}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Write detailed blog content about this deal..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 capitalize"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  name="store.name"
                  value={formData.store.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Store Website
                </label>
                <input
                  type="url"
                  name="store.website"
                  value={formData.store.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Discount Information</h3>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Discount Type *
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="percentage">Percentage Off</option>
                  <option value="fixed">Fixed Amount Off</option>
                  <option value="free-shipping">Free Shipping</option>
                  <option value="buy-one-get-one">Buy One Get One</option>
                </select>
              </div>

              {formData.discountType !== 'free-shipping' && formData.discountType !== 'buy-one-get-one' && (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required={formData.discountType !== 'free-shipping' && formData.discountType !== 'buy-one-get-one'}
                    min="0"
                    step="0.01"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Coupon Code (Optional)
                </label>
                <input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., SAVE20"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Discounted Price
                </label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Affiliate Link
                </label>
                <input
                  type="url"
                  name="affiliateLink"
                  value={formData.affiliateLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/deal"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="tech, electronics, sale (comma-separated)"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Terms & Conditions
              </label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Any terms and conditions for this deal..."
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Active</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Featured Deal</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/deals')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Deal' : 'Create Deal')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
