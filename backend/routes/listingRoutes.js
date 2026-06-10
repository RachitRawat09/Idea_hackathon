const express = require('express');
const router = express.Router();

const listingController = require('../controllers/listingController');
const upload = require('../middlewares/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const authMiddleware = require('../middlewares/auth');

// =======================
// 📦 LISTINGS CRUD ROUTES
// =======================

// Create listing (protected for now disabled)
router.post('/', listingController.createListing);

// Get all listings
router.get('/', listingController.getListings);

// ✅ Get all purchases for a user (must come BEFORE /:id)
router.get('/purchases', authMiddleware, listingController.getPurchasesByUser);

// Get single listing by ID
router.get('/:id', listingController.getListingById);

// Update listing
router.put('/:id', listingController.updateListing);

// Delete listing (protected)
router.delete('/:id', authMiddleware, listingController.deleteListing);

// Mark listing as sold (protected)
router.put('/:id/sold', authMiddleware, listingController.markAsSold);

// =======================
// 🖼️ IMAGE UPLOAD ROUTES
// =======================

// Upload a single image
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    console.log('FILE RECEIVED:', req.file);

    const result = await uploadToCloudinary(req.file.path, 'listings');
    fs.unlinkSync(req.file.path);

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

// Test single upload (for debugging)
router.post('/upload-test', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file received' });
  }
  res.json({
    message: 'File received successfully!',
    file: req.file
  });
});

// Multi-image upload (max 4)
router.post('/upload-images', upload.array('images', 4), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files received' });
    }

    const uploaded = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.path, 'listings');
      fs.unlinkSync(file.path);
      uploaded.push(result.secure_url);
    }

    res.json({ imageUrls: uploaded });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

// =======================
// 🗂️ FILTER ROUTES
// =======================

// Get all unique categories
router.get('/categories', listingController.getCategories);

// Get all unique departments
router.get('/departments', listingController.getDepartments);

// =======================
// ⭐ REVIEW ROUTES
// =======================

// Add a review (protected)
router.post('/:id/reviews', authMiddleware, listingController.addReview);

// Get all reviews for a listing
router.get('/:id/reviews', listingController.getReviews);

// =======================
// 🚫 PLANS DISABLED
// =======================
// (No plan routes currently)

module.exports = router;