import axios from 'axios';

const API_URL = 'http://localhost:8080/api/listings';

export const getListings = async (params = {}) => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const getListingById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createListing = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getCategories = async () => {
  const res = await axios.get(`${API_URL}/categories`);
  return res.data;
};

export const getDepartments = async () => {
  const res = await axios.get(`${API_URL}/departments`);
  return res.data;
};

export const getPurchasesByUser = async (userId) => {
  const res = await axios.get(`${API_URL}/purchases`, { params: { userId } });
  return res.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axios.post(`${API_URL}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.imageUrl;
};

export const purchaseListing = async (id, buyerId, token) => {
  const res = await axios.put(`${API_URL}/${id}`, { buyer: buyerId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getUserPlanInfo = async (userId) => {
  const res = await axios.get(`${API_URL}/user-plan-info`, { params: { userId } });
  return res.data;
};

export const getPlans = async () => {
  const res = await axios.get(`${API_URL}/plans`);
  return res.data;
};

export const subscribePlan = async (userId, planName) => {
  const res = await axios.post(`${API_URL}/subscribe-plan`, { userId, planName });
  return res.data;
};

export const markAsSold = async (listingId, buyerId, token) => {
  const res = await axios.put(`${API_URL}/${listingId}/sold`, { buyerId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}; 