import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const register = async (formData) => {
  const res = await axios.post(`${API_URL}/register`, formData);
  return res.data;
};

export const getProfile = async (token) => {
  const res = await axios.get('http://localhost:5000/api/users/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (token, updates) => {
  const res = await axios.put('http://localhost:5000/api/users/profile', updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 