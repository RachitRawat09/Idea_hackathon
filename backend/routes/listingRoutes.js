const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const upload = require('../middlewares/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');
const fs = require('fs');

// Create listing (protected)
// router.post('/', authMiddleware, listingController.createListing);
router.post('/', listingController.createListing); // For now, no auth

// Get all listings
router.get('/', listingController.getListings);

// Get single listing
router.get('/:id', listingController.getListingById);

// Update listing (protected)
// router.put('/:id', authMiddleware, listingController.updateListing);
router.put('/:id', listingController.updateListing); // For now, no auth

// Delete listing (protected)
// router.delete('/:id', authMiddleware, listingController.deleteListing);
router.delete('/:id', listingController.deleteListing); // For now, no auth

// Image upload endpoint
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.path, 'listings');
    // Remove file from local uploads after upload
    fs.unlinkSync(req.file.path);
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

module.exports = router; 