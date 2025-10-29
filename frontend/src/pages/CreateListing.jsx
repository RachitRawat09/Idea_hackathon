import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createListing, uploadImage, getUserPlanInfo, getPlans, subscribePlan } from '../api/listings.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaCrown, FaCheckCircle } from 'react-icons/fa';

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
  const { user, token, planInfo, updatePlanInfo } = useContext(AuthContext);
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
  const [quotaChecked, setQuotaChecked] = useState(false);
  const [overQuota, setOverQuota] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [showOverQuotaModal, setShowOverQuotaModal] = useState(false);

  useEffect(() => {
    const checkQuota = async () => {
      if (!user) return;
      try {
        const info = await getUserPlanInfo(user._id || user.id);
        updatePlanInfo(info);
        const isOver = info.listingsThisPeriod >= (info.planInfo?.listingLimit || 3);
        setOverQuota(isOver);
        setShowOverQuotaModal(isOver);
      } catch {
        setOverQuota(false);
        setShowOverQuotaModal(false);
      } finally {
        setQuotaChecked(true);
      }
    };
    checkQuota();
    // eslint-disable-next-line
  }, [user]);

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const data = await getPlans();
      setPlans(data);
    } catch {}
    setLoadingPlans(false);
  };

  const handleUpgrade = () => {
    setShowUpgrade(true);
    fetchPlans();
  };

  const handleSubscribe = async (planName) => {
    setSubscribing(true);
    try {
      await subscribePlan(user._id || user.id, planName);
      toast.success('Plan upgraded!');
      setShowUpgrade(false);
      setQuotaChecked(false); // recheck quota
    } catch {
      toast.error('Failed to upgrade plan.');
    }
    setSubscribing(false);
  };

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
    if (overQuota) {
      setShowOverQuotaModal(true);
      return;
    }
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
      if (err.response && err.response.status === 403 && err.response.data?.message?.includes('Listing limit')) {
        setOverQuota(true);
        setShowOverQuotaModal(true);
      } else {
        toast.error('Failed to create listing.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Over Quota Modal ---
  const OverQuotaModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg text-center relative animate-fade-in">
        <FaCrown className="mx-auto text-yellow-400 mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Your Free Access Has Ended</h2>
        <p className="mb-4 text-gray-700">You've reached your free listing limit. To continue selling, please subscribe to a plan.</p>
        <button
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition mb-4"
          onClick={handleUpgrade}
        >
          See Subscription Plans
        </button>
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={() => setShowOverQuotaModal(false)}
          aria-label="Close"
        >
          ×
        </button>
        {showUpgrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl text-center relative animate-fade-in">
              <h3 className="text-xl font-bold mb-6 text-indigo-700">Choose Your Plan</h3>
              {loadingPlans ? <div>Loading plans...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plans.map(plan => (
                    <div key={plan._id} className={`border-2 rounded-xl p-6 flex flex-col items-center shadow-md ${plan.name === 'premium' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                      {plan.name === 'premium' && <FaCrown className="text-yellow-400 mb-2" size={32} />}
                      <span className="font-bold text-lg mb-1 capitalize">{plan.name}</span>
                      <span className="text-2xl font-extrabold mb-2">{plan.price === 0 ? 'Free' : `$${plan.price}`}</span>
                      <span className="mb-2">{plan.description}</span>
                      <span className="mb-2 text-indigo-700 font-semibold">Listings: {plan.listingLimit}</span>
                      {plan.durationDays && <span className="mb-2 text-gray-500">Duration: {plan.durationDays} days</span>}
                      <button
                        className={`mt-2 px-5 py-2 rounded-full font-semibold text-white shadow ${subscribing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        disabled={subscribing}
                        onClick={() => handleSubscribe(plan.name)}
                      >
                        {subscribing ? 'Subscribing...' : 'Choose'}
                      </button>
                      {plan.name === planInfo?.plan && (
                        <span className="mt-2 text-green-600 flex items-center gap-1 text-sm"><FaCheckCircle /> Current Plan</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <button className="mt-6 text-gray-600 underline" onClick={() => setShowUpgrade(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!quotaChecked) return <div>Checking your plan...</div>;
  if (overQuota && showOverQuotaModal) {
    return <OverQuotaModal />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Sell Your Items</h1>
        <p className="text-lg text-gray-600">List your items for sale to other students</p>
        {planInfo && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Plan: {planInfo.planInfo?.name || 'free'} | 
                  Listings Used: {planInfo.listingsThisPeriod || 0} / {planInfo.planInfo?.listingLimit || 3}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
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