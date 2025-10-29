const Listing = require('../models/Listing');
const User = require('../models/User');
const Plan = require('../models/Plan');

// Create a new listing
exports.createListing = async (req, res) => {
  try {
    const { title, description, category, price, image, department, seller } = req.body;
    // Fetch seller
    const user = await User.findById(seller);
    if (!user) return res.status(404).json({ message: 'Seller not found' });

    // Get plan info
    let planInfo = { listingLimit: 3 }; // Default for free
    if (user.plan && user.plan !== 'free') {
      const plan = await Plan.findOne({ name: user.plan });
      if (plan) planInfo = plan;
    }

    // Check if plan expired (for paid plans)
    if (user.plan !== 'free' && user.planExpiresAt && user.planExpiresAt < new Date()) {
      user.plan = 'free';
      user.listingsThisPeriod = 0;
      user.planExpiresAt = null;
      await user.save();
      planInfo = { listingLimit: 3 };
    }

    // Check quota
    if (user.listingsThisPeriod >= planInfo.listingLimit) {
      return res.status(403).json({ message: 'Listing limit reached. Please upgrade your plan to list more items.' });
    }

    // Create listing
    const listing = new Listing({
      title,
      description,
      category,
      price,
      image: image || '',
      seller: user._id,
      department,
    });
    await listing.save();
    // Increment user's listingsThisPeriod
    user.listingsThisPeriod += 1;
    await user.save();
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

// Get current user's plan/quota info
exports.getUserPlanInfo = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    let planInfo = { name: 'free', listingLimit: 3, price: 0, durationDays: null };
    if (user.plan && user.plan !== 'free') {
      const plan = await Plan.findOne({ name: user.plan });
      if (plan) planInfo = plan;
    }
    // Check if plan expired
    let expired = false;
    if (user.plan !== 'free' && user.planExpiresAt && user.planExpiresAt < new Date()) {
      expired = true;
    }
    res.json({
      plan: user.plan,
      listingsThisPeriod: user.listingsThisPeriod,
      planExpiresAt: user.planExpiresAt,
      planInfo,
      expired
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all available plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Subscribe user to a plan (no payment integration)
exports.subscribePlan = async (req, res) => {
  try {
    const { userId, planName } = req.body;
    if (!userId || !planName) return res.status(400).json({ message: 'User ID and plan name required' });
    const user = await User.findById(userId);
    const plan = await Plan.findOne({ name: planName });
    if (!user || !plan) return res.status(404).json({ message: 'User or plan not found' });
    user.plan = plan.name;
    user.listingsThisPeriod = 0;
    if (plan.durationDays) {
      user.planExpiresAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);
    } else {
      user.planExpiresAt = null;
    }
    await user.save();
    res.json({ message: 'Plan subscribed successfully', plan: user.plan, planExpiresAt: user.planExpiresAt });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark listing as sold
exports.markAsSold = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Check if user is the seller
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the seller can mark item as sold' });
    }

    listing.isSold = true;
    listing.buyer = req.body.buyerId || null; // Optional: specify buyer
    await listing.save();

    res.json({ message: 'Item marked as sold', listing });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 