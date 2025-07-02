import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createListing, uploadImage } from '../api/listings.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const categories = [
  'Textbooks',
  'Electronics',
  'Calculators',
  'Lab Equipment',
  'Notes & Study Guides',
  'Office Supplies',
  'Other',
];
const conditions = [
  'Like New',
  'Very Good',
  'Good',
  'Acceptable',
];

const CreateListing = ({ onCreated }) => {
  const { user, token } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    condition: '',
    department: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.price || !form.condition || !form.department) {
      toast.error('Please fill all required fields.');
      return;
    }
    if (!user || !(user._id || user.id)) {
      toast.error('User not found. Please log in again.');
      return;
    }
    console.log('user in CreateListing:', user);
    setLoading(true);
    try {
      let imageUrl = '';
      if (form.image) {
        imageUrl = await uploadImage(form.image);
      }
      const data = {
        title: form.title,
        description: form.description,
        category: form.category,
        price: parseFloat(form.price),
        condition: form.condition,
        department: form.department,
        image: imageUrl,
        seller: user.id || user._id,
      };
      await createListing(data, token);
      toast.success('Listing created successfully!');
      setForm({
        title: '',
        description: '',
        category: '',
        price: '',
        condition: '',
        department: '',
        image: null,
      });
      if (onCreated) onCreated();
    } catch (err) {
      toast.error('Failed to create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Condition *</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select condition</option>
              {conditions.map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Department *</label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Price (USD) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing; 