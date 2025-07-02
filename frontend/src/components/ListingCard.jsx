import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ListingCard = ({
  id,
  title,
  price,
  image,
  category,
  condition,
  sellerName,
  sellerRating,
  date,
}) => {
  return (
    <Link to={`/product/${id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="h-48 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
            <span className="font-bold text-green-600">
              ${price.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
              {category}
            </span>
            <span className="mx-2">•</span>
            <span>{condition}</span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-sm">
                <p className="font-medium">{sellerName}</p>
                <div className="flex items-center">
                  <FaStar
                    size={14}
                    className="text-yellow-500"
                    fill="currentColor"
                  />
                  <span className="ml-1 text-gray-600">
                    {sellerRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard; 