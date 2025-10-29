import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfile } from '../api/auth';
import { getListings, getPurchasesByUser } from '../api/listings.jsx';
import { toast } from 'react-toastify';
import { uploadImage } from '../api/listings.jsx';
import { FaUser, FaEnvelope, FaUniversity, FaCalendarAlt, FaStar, FaEdit, FaCheck } from 'react-icons/fa';

const Profile = () => {
  const { user, token, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', college: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [profileData, listingsData, purchasesData] = await Promise.all([
          getProfile(token),
          getListings({ seller: user?.id || user?._id }),
          getPurchasesByUser(user?.id || user?._id)
        ]);
        
        setProfile(profileData);
        setForm({ name: profileData.name, email: profileData.email, college: profileData.college, password: '' });
        setProfileImage(profileData.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profileData.name));
        setUserListings(listingsData);
        setUserPurchases(purchasesData);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (user && token) {
      fetchProfileData();
    }
  }, [token, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updates = { ...form };
      if (!updates.password) delete updates.password;
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        updates.profileImage = imageUrl;
      }
      const updated = await updateProfile(token, updates);
      setProfile(updated);
      updateUser(updated);
      setProfileImage(updated.profileImage || profileImage);
      toast.success('Profile updated!');
      setForm({ ...form, password: '' });
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Profile</h1>
        <p className="text-lg text-gray-600">Your complete profile and activity overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center mb-6">
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.college}</p>
              <div className="flex items-center mt-2">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="text-sm text-gray-600">
                  {profile?.averageRating || 0} ({profile?.numReviews || 0} reviews)
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-3" />
                <span className="text-gray-700">{profile?.email}</span>
              </div>
              <div className="flex items-center">
                <FaUniversity className="text-gray-400 mr-3" />
                <span className="text-gray-700">{profile?.college}</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="text-gray-400 mr-3" />
                <span className="text-gray-700">
                  Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3" />
                <span className="text-gray-700">
                  {profile?.isVerified ? 'Verified Student' : 'Unverified'}
                </span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <FaEdit className="mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Activity Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userListings.length}</div>
                <div className="text-sm text-gray-600">Items Listed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userPurchases.length}</div>
                <div className="text-sm text-gray-600">Items Purchased</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${userPurchases.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{profile?.numReviews || 0}</div>
                <div className="text-sm text-gray-600">Reviews Received</div>
              </div>
            </div>
          </div>

          {/* Recent Listings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Listings</h3>
            {userListings.length > 0 ? (
              <div className="space-y-3">
                {userListings.slice(0, 3).map((listing) => (
                  <div key={listing._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{listing.title}</h4>
                      <p className="text-sm text-gray-600">{listing.category} • ${listing.price}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        listing.isSold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {listing.isSold ? 'Sold' : 'Available'}
                      </span>
                    </div>
                  </div>
                ))}
                {userListings.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">...and {userListings.length - 3} more</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No listings yet</p>
            )}
          </div>

          {/* Recent Purchases */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Purchases</h3>
            {userPurchases.length > 0 ? (
              <div className="space-y-3">
                {userPurchases.slice(0, 3).map((purchase) => (
                  <div key={purchase._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{purchase.title}</h4>
                      <p className="text-sm text-gray-600">From: {purchase.seller?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${purchase.price}</p>
                      <p className="text-xs text-gray-500">
                        {purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
                {userPurchases.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">...and {userPurchases.length - 3} more</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No purchases yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                <input
                  type="text"
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 