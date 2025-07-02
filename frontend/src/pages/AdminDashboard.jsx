import React, { useEffect, useState } from 'react';
import { getListings } from '../api/listings.jsx';
import ListingCard from '../components/ListingCard.jsx';

const AdminDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const data = await getListings();
        setListings(data);
      } catch (err) {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-gray-500 mb-4">All Listings</p>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
