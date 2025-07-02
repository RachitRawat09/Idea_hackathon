import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import ListingCard from '../components/ListingCard.jsx';

// Mock categories for demonstration
const categories = [
  'All Categories',
  'Textbooks',
  'Electronics',
  'Calculators',
  'Lab Equipment',
  'Notes & Study Guides',
  'Office Supplies',
  'Other',
];
// Mock conditions for demonstration
const conditions = [
  'Any Condition',
  'Like New',
  'Very Good',
  'Good',
  'Acceptable',
];
// Mock data for demonstration
const mockListings = [
  {
    id: '1',
    title: 'Calculus Early Transcendentals 8th Edition',
    price: 45.99,
    image:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Textbooks',
    condition: 'Good',
    sellerName: 'John D.',
    sellerRating: 4.5,
    date: '2 days ago',
  },
  {
    id: '2',
    title: 'TI-84 Plus Graphing Calculator',
    price: 65.0,
    image:
      'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FsY3VsYXRvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Calculators',
    condition: 'Like New',
    sellerName: 'Sarah M.',
    sellerRating: 4.8,
    date: '5 days ago',
  },
  {
    id: '3',
    title: 'Physics for Scientists and Engineers',
    price: 38.5,
    image:
      'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dGV4dGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Textbooks',
    condition: 'Good',
    sellerName: 'Alex J.',
    sellerRating: 4.7,
    date: '1 week ago',
  },
  {
    id: '4',
    title: 'MacBook Pro 2019 13-inch',
    price: 750.0,
    image:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bWFjYm9va3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Electronics',
    condition: 'Very Good',
    sellerName: 'Michael T.',
    sellerRating: 4.9,
    date: '3 days ago',
  },
  {
    id: '5',
    title: 'Lab Coat Size M',
    price: 15.0,
    image:
      'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFiJTIwY29hdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Lab Equipment',
    condition: 'Like New',
    sellerName: 'Emma L.',
    sellerRating: 4.6,
    date: '6 days ago',
  },
  {
    id: '6',
    title: 'Organic Chemistry Study Guide',
    price: 12.99,
    image:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3R1ZHklMjBndWlkZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Notes & Study Guides',
    condition: 'Good',
    sellerName: 'David R.',
    sellerRating: 4.4,
    date: '4 days ago',
  },
];

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCondition, setSelectedCondition] = useState('Any Condition');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Filter listings based on selected filters
  const filteredListings = mockListings.filter((listing) => {
    if (
      searchTerm &&
      !listing.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (
      selectedCategory !== 'All Categories' &&
      listing.category !== selectedCategory
    ) {
      return false;
    }
    if (
      selectedCondition !== 'Any Condition' &&
      listing.condition !== selectedCondition
    ) {
      return false;
    }
    if (priceRange.min && listing.price < parseFloat(priceRange.min)) {
      return false;
    }
    if (priceRange.max && listing.price > parseFloat(priceRange.max)) {
      return false;
    }
    return true;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedCondition('Any Condition');
    setPriceRange({ min: '', max: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Items</h1>
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for items..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <FaFilter size={20} className="mr-2" />
            Filters
          </button>
        </div>
        {/* Filters - Desktop */}
        <div className="hidden md:flex flex-wrap gap-4">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* Condition Filter */}
          <div>
            <label
              htmlFor="condition"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Condition
            </label>
            <select
              id="condition"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
          {/* Price Range Filter */}
          <div>
            <label
              htmlFor="price-min"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price Range
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="price-min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    min: e.target.value,
                  })
                }
                placeholder="Min"
                className="block w-24 pl-3 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <span className="px-2 border-t border-b border-gray-300 bg-gray-50 text-gray-500">
                to
              </span>
              <input
                type="number"
                id="price-max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    max: e.target.value,
                  })
                }
                placeholder="Max"
                className="block w-24 pl-3 pr-3 py-2 border border-gray-300 rounded-r-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <FaTimes size={16} className="mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
        {/* Filters - Mobile */}
        {showFilters && (
          <div className="md:hidden mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 space-y-4">
            {/* Category Filter */}
            <div>
              <label
                htmlFor="category-mobile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category-mobile"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {/* Condition Filter */}
            <div>
              <label
                htmlFor="condition-mobile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Condition
              </label>
              <select
                id="condition-mobile"
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
            {/* Price Range Filter */}
            <div>
              <label
                htmlFor="price-min-mobile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price Range
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="price-min-mobile"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      min: e.target.value,
                    })
                  }
                  placeholder="Min"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <span className="px-2 border-t border-b border-gray-300 bg-gray-50 text-gray-500">
                  to
                </span>
                <input
                  type="number"
                  id="price-max-mobile"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: e.target.value,
                    })
                  }
                  placeholder="Max"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-r-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Clear Filters */}
            <button
              onClick={handleClearFilters}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <FaTimes size={16} className="mr-2" />
              Clear Filters
            </button>
          </div>
        )}
      </div>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Showing {filteredListings.length} results
          {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
          {selectedCondition !== 'Any Condition' &&
            ` in ${selectedCondition} condition`}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>
      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No items found matching your criteria.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Browse; 