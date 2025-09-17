const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  studentIdImage: {
    type: String, // URL to uploaded student ID image
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
<<<<<<< HEAD
  plan: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
=======
  // Subscription/plan fields
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
  listingsThisPeriod: {
    type: Number,
    default: 0,
  },
  planExpiresAt: {
    type: Date,
  },
>>>>>>> 8988633f61644774413f34ef95eed483c1044a98
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 