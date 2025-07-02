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
    const { category, department, search } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (department) filter.department = department;
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
    const categories = await Listing.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all unique departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Listing.distinct('department');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 