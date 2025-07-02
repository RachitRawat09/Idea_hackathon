import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Product ID: {id}</p>
        <p className="text-gray-500">Product details will be displayed here.</p>
      </div>
    </div>
  );
};

export default ProductDetail; 