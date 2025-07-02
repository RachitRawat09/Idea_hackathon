import React, { useEffect, useState } from 'react';
import { getListings, getCategories, getDepartments } from '../api/listings.jsx';
import ListingCard from '../components/ListingCard.jsx';

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (department) params.department = department;
    const data = await getListings(params);
    setListings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line
  }, [search, category, department]);

  useEffect(() => {
    const fetchFilters = async () => {
      setFiltersLoading(true);
      try {
        const [cats, deps] = await Promise.all([
          getCategories(),
          getDepartments()
        ]);
        setCategories(cats);
        setDepartments(deps);
      } catch (err) {
        setCategories([]);
        setDepartments([]);
      } finally {
        setFiltersLoading(false);
      }
    };
    fetchFilters();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
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
        {/* Top search bar */}
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
        {loading ? (
          <div>Loading...</div>
        ) : listings.length === 0 ? (
          <div>No listings found.</div>
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
                sellerName={listing.seller?.name || 'N/A'}
                sellerRating={listing.seller?.rating || 0}
                date={listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : ''}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 