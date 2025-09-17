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
import { FaMoneyBillWave, FaClock, FaGift, FaClipboardList } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";


const Landing = () => {
  const benefits = [
    {
      icon: <FaMoneyBillWave className="text-blue-600" size={28} />,
      title: "Save Money",
      desc: "Find budget-friendly deals and save up to 60% compared to retail prices on textbooks, electronics, and essentials.",
      bg: "bg-blue-100"
    },
    {
      icon: <FaClock className="text-green-600" size={28} />,
      title: "Save Time",
      desc: "Everything you need right on campus. No more traveling to different stores or waiting for online deliveries.",
      bg: "bg-green-100"
    },
    {
      icon: <FaLocationCrosshairs  className="text-purple-600" size={28} />,
      title: "Connect Locally",
      desc: "Connect with seniors, peers, and juniors in your college to build a valuable campus network.",
      bg: "bg-purple-100"
    },
    {
      icon: <FaShieldAlt className="text-yellow-600" size={28} />,
      title: "Student Verified",
      desc: "All users are verified students, ensuring a trusted and safe community.",
      bg: "bg-yellow-100"
    },
    {
      icon: <FaGift className="text-red-600" size={28} />,
      title: "Exclusive Deals",
      desc: "Access student-only offers and discounts available just for your campus.",
      bg: "bg-red-100"
    },
    {
      icon: <FaClipboardList className="text-indigo-600" size={28} />,
      title: "Request Anything",
      desc: "Looking for something specific? Post a request and connect with students who can help.",
      bg: "bg-indigo-100"
    }
  ];
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
          <div className="bg-blue-200 p-6 rounded-lg text-center hover:shadow-lg transition-shadow text-black">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <FaBookOpen size={32} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Textbooks</h3>
            <p className="text-black-300">
              Find affordable textbooks for all your courses.
            </p>
          </div>

          <div className="bg-blue-200 p-6 rounded-lg text-center hover:shadow-lg transition-shadow text-black">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <FaLaptop size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Electronics</h3>
            <p className="text-black-300">
              Laptops, tablets, and other tech essentials.
            </p>
          </div>

          <div className="bg-blue-200 p-6 rounded-lg text-center hover:shadow-lg transition-shadow text-black">
            <div className="inline-block p-3 bg-yellow-100 rounded-full mb-4">
              <FaCalculator size={32} className="text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Calculators</h3>
            <p className="text-black-300">
              Scientific and graphing calculators for math and engineering.
            </p>
          </div>

          <div className="bg-blue-200 p-6 rounded-lg text-center hover:shadow-lg transition-shadow text-black">
            <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
              <FaFlask size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lab Equipment</h3>
            <p className="text-black-300">
              Lab coats, goggles, and other scientific supplies.
            </p>
          </div>
        </div>

        </div>
      </section>
      {/* Benefits Section */}
      <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-2">Benefits</h2>
        <p className="text-gray-600 mb-12">
          Join thousands of students transforming their campus experience
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div
                className={`inline-block p-3 rounded-full mb-4 ${item.bg}`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
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
      {/* Know Pricing Section */}
      <section id="know-pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Know Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="border rounded-lg p-8 shadow text-center flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-4xl font-extrabold text-indigo-600 mb-4">₹0</p>
              <ul className="text-gray-700 mb-6 space-y-2 text-left">
                <li>✔️ List up to 3 items</li>
                <li>✔️ Access to all categories</li>
                <li>✔️ In-app chat</li>
                <li>✔️ Basic support</li>
              </ul>
              <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-semibold">Best for new users</span>
            </div>
            {/* Paid Plan */}
            <div className="border-2 border-indigo-600 rounded-lg p-8 shadow-lg text-center flex flex-col items-center bg-indigo-50">
              <h3 className="text-2xl font-bold mb-2 text-indigo-700">Pro</h3>
              <p className="text-4xl font-extrabold text-indigo-700 mb-4">₹99 <span className="text-lg font-normal">/month</span></p>
              <ul className="text-gray-700 mb-6 space-y-2 text-left">
                <li>✔️ Unlimited listings</li>
                <li>✔️ Featured placement</li>
                <li>✔️ Priority support</li>
                <li>✔️ Early access to new features</li>
              </ul>
              <span className="inline-block bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-semibold">Most Popular</span>
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