import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle category submission
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/categories', { name: newCategoryName });
      setCategories((prev) => [...prev, response.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategoryName('');
      setSuccess('Category added successfully!');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      setSuccess('Category deleted successfully!');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Categories</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Category Card */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Travel, Shopping"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !newCategoryName.trim()}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* Categories List Card */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Categories</h2>
          {categories.length === 0 && !loading ? (
            <p className="text-gray-500">No categories found. Standard fallback categories will be used.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 font-semibold text-gray-700">Name</th>
                    <th className="pb-3 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id} className="border-b border-gray-100 hover:bg-gray-55 transition-colors">
                      <td className="py-3 text-gray-900 capitalize font-medium">{category.name}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteCategory(category._id, category.name)}
                          disabled={loading}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
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
