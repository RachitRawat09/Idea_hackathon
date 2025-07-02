import axios from 'axios';

const API_URL = 'http://localhost:5000/api/listings';

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