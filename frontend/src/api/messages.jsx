import axios from 'axios';

const API_URL = 'http://localhost:5000/api/messages';

export const sendMessage = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getMessages = async (userId, listingId, token) => {
  const params = { userId };
  if (listingId) params.listingId = listingId;
  const res = await axios.get(API_URL, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAllUsers = async (token) => {
  const res = await axios.get('http://localhost:5000/api/users/all', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 