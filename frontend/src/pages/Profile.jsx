import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfile } from '../api/auth';
import { toast } from 'react-toastify';
import { uploadImage } from '../api/listings.jsx';

const Profile = () => {
  const { user, token, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', college: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile(token);
        setProfile(data);
        setForm({ name: data.name, email: data.email, college: data.college, password: '' });
        setProfileImage(data.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.name));
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

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

  if (loading && !profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
        {profile ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 shadow mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">College</label>
                <input type="text" name="college" value={form.college} onChange={handleChange} className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className="mt-1 block w-full border rounded p-2" placeholder="Leave blank to keep current password" />
              </div>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={loading}>
                {loading ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </>
        ) : (
          <p className="text-gray-500">User profile information will be displayed here.</p>
        )}
      </div>
    </div>
  );
};

export default Profile; 