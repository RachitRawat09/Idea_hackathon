import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getListingById } from '../api/listings.jsx';
import { FaStar } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Product Details</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Product Details</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Details</h1>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full max-w-xs h-64 object-cover rounded-lg border"
          />
        </div>
        {/* Details */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{listing.title}</h2>
          <div className="flex items-center gap-4">
            <span className="text-green-600 text-xl font-semibold">
              ${typeof listing.price === 'number' ? listing.price.toFixed(2) : listing.price}
            </span>
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
              {listing.category}
            </span>
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
              {listing.condition}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-medium">Seller:</span>
            <span>{listing.seller?.name || 'N/A'}</span>
            <FaStar size={16} className="text-yellow-500 ml-2" />
            <span className="text-gray-600 text-sm">
              {listing.seller?.rating ? listing.seller.rating.toFixed(1) : 'N/A'}
            </span>
          </div>
          <div className="text-gray-500 text-sm">
            Listed on: {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'N/A'}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-gray-700">{listing.description || 'No description provided.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 