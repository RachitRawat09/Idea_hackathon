const Listing = require('../models/Listing');

// Create a new listing
exports.createListing = async (req, res) => {
  try {
    const { title, description, category, price, image, department } = req.body;
    const listing = new Listing({
      title,
      description,
      category,
      price,
      image: image || '',
      seller: req.body.seller,
      department,
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all listings
exports.getListings = async (req, res) => {
  try {
    const { category, department, search, seller } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (department) filter.department = department;
    if (seller) filter.seller = seller;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const listings = await Listing.find(filter).populate('seller', 'name email');
    res.json(listings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a listing
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a listing
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all unique categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Listing.distinct('category', { category: { $exists: true, $ne: null, $ne: '' } });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all unique departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Listing.distinct('department', { department: { $exists: true, $ne: null, $ne: '' } });
    res.json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all purchases for a user
exports.getPurchasesByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    const purchases = await Listing.find({ buyer: userId }).populate('seller', 'name email');
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a review to a listing
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    // Prevent duplicate reviews by the same user
    if (listing.reviews.some(r => r.reviewer.toString() === req.user.id)) {
      return res.status(400).json({ message: 'You have already reviewed this listing.' });
    }
    const review = {
      reviewer: req.user.id,
      rating,
      comment,
    };
    listing.reviews.push(review);
    await listing.save();
    res.status(201).json({ message: 'Review added', reviews: listing.reviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reviews for a listing
exports.getReviews = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('reviews.reviewer', 'name email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing.reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 