import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  // Placeholder for profile update
  const handleUpdate = () => {
    try {
      // Simulate update
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-4">User profile information will be displayed here.</p>
        <button onClick={handleUpdate} className="bg-indigo-600 text-white px-4 py-2 rounded">Update Profile</button>
      </div>
    </div>
  );
};

export default Profile; 