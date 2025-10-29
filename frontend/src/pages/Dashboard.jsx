import React, { useEffect, useState, useContext } from 'react';
import { getListings, getPurchasesByUser } from '../api/listings.jsx';
import ListingCard from '../components/ListingCard.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const hardcodedCategories = [
  'Textbooks',
  'Electronics',
  'Calculators',
  'Lab Equipment',
  'Notes & Study Guides',
  'Office Supplies',
  'Other',
];
const hardcodedDepartments = [
  'Computer Science',
  'Mechanical',
  'Electrical',
  'Civil',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Other',
];

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories] = useState(hardcodedCategories);
  const [departments] = useState(hardcodedDepartments);
  const [filtersLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('listings');
  const [purchases, setPurchases] = useState([]);

  const fetchListings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (department) params.department = department;
      if (user?.id || user?._id) params.seller = user.id || user._id;
      const data = await getListings(params);
      setListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchListings();
    }
    // eslint-disable-next-line
  }, [search, category, department, user]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;
      try {
        const data = await getPurchasesByUser(user._id || user.id);
        setPurchases(data);
      } catch (err) {
        setPurchases([]);
      }
    };
    fetchPurchases();
    // Listen for purchaseMade event
    const handlePurchaseMade = () => fetchPurchases();
    window.addEventListener('purchaseMade', handlePurchaseMade);
    return () => window.removeEventListener('purchaseMade', handlePurchaseMade);
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
        <p className="text-lg text-gray-600">Manage your listings and track your purchases</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Listings</p>
                <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${purchases.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-64 w-full bg-white rounded-xl shadow p-4 mb-4 md:mb-0">
        <h3 className="font-bold text-lg mb-4 text-blue-700">Filters</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full border p-2 rounded"
            value={category}
            onChange={e => setCategory(e.target.value)}
            disabled={filtersLoading}
          >
            <option value="">All</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Department</label>
          <select
            className="w-full border p-2 rounded"
            value={department}
            onChange={e => setDepartment(e.target.value)}
            disabled={filtersLoading}
          >
            <option value="">All</option>
            {departments.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => { setCategory(''); setDepartment(''); setSearch(''); }}
          className="w-full bg-gray-200 text-gray-700 py-1 rounded mt-2 hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1">
        {/* Tabs */}
        <div className="mb-4 flex gap-6 border-b">
          <button
            className={`pb-2 px-2 border-b-2 ${activeTab === 'listings' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('listings')}
          >
            Your Listings
          </button>
          <button
            className={`pb-2 px-2 border-b-2 ${activeTab === 'purchases' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('purchases')}
          >
            Your Purchases
          </button>
        </div>
        {/* Top search bar (only for listings tab) */}
        {activeTab === 'listings' && (
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6">
            <input
              type="text"
              placeholder="Search for books, calculators, laptops..."
              className="border p-2 rounded flex-1"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              onClick={fetchListings}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        )}
        {/* Listings Tab */}
        {activeTab === 'listings' && (
          loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                  <ListingCard
                    key={listing._id || listing.id}
                    id={listing._id || listing.id}
                    title={listing.title}
                    price={listing.price}
                    image={listing.image}
                    category={listing.category}
                    condition={listing.condition || 'Good'}
                    sellerName={listing.seller?.name || 'You'}
                    sellerRating={listing.seller?.rating || 0}
                    date={listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : ''}
                  />
                ))}
            </div>
          )
        )}
        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          purchases.length === 0 ? (
            <div>No purchases found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map(listing => (
                <ListingCard
                  key={listing._id || listing.id}
                  id={listing._id || listing.id}
                  title={listing.title}
                  price={listing.price}
                  image={listing.image}
                  category={listing.category}
                  condition={listing.condition || 'Good'}
                  sellerName={listing.seller?.name || 'N/A'}
                  sellerRating={listing.seller?.rating || 0}
                  date={listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : ''}
                />
              ))}
            </div>
          )
        )}
      </main>
      </div>
    </div>
  );
};

export default Dashboard; 