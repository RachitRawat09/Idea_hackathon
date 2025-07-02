import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBookOpen, 
  FaLaptop, 
  FaCalculator, 
  FaFlask, 
  FaShieldAlt, 
  FaRegCommentDots, 
  FaDollarSign 
} from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Campus Connect
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            The marketplace for college students to buy and sell second-hand academic items.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-indigo-600 rounded-md font-bold hover:bg-indigo-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/browse"
              className="px-8 py-3 bg-indigo-700 text-white rounded-md font-bold hover:bg-indigo-800 transition-colors"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You Can Find
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                <FaBookOpen size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Textbooks</h3>
              <p className="text-gray-600">
                Find affordable textbooks for all your courses.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <FaLaptop size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Electronics</h3>
              <p className="text-gray-600">
                Laptops, tablets, and other tech essentials.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-block p-3 bg-yellow-100 rounded-full mb-4">
                <FaCalculator size={32} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calculators</h3>
              <p className="text-gray-600">
                Scientific and graphing calculators for math and engineering.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
                <FaFlask size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lab Equipment</h3>
              <p className="text-gray-600">
                Lab coats, goggles, and other scientific supplies.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <FaShieldAlt size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Sign Up</h3>
              <p className="text-gray-600">
                Register with your college email or upload your student ID for verification.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <FaRegCommentDots size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Connect</h3>
              <p className="text-gray-600">
                Browse listings or post items. Chat with sellers or buyers securely.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <FaDollarSign size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Exchange</h3>
              <p className="text-gray-600">
                Meet on campus, exchange the item, and leave a rating for the seller.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already saving money and making sustainable choices.
          </p>
          <Link
            to="/register"
            className="px-8 py-3 bg-white text-indigo-600 rounded-md font-bold hover:bg-indigo-100 transition-colors inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing; 