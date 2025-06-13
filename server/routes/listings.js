const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/listings
// @desc    Get all listings with filters
// @access  Public
router.get('/', listingController.getAllListings);

// @route   GET /api/listings/:id
// @desc    Get listing by ID
// @access  Public
router.get('/:id', listingController.getListingById);

// @route   POST /api/listings
// @desc    Create a new listing
// @access  Private
router.post('/', auth, upload.array('images', 10), listingController.createListing);

// @route   PUT /api/listings/:id
// @desc    Update listing
// @access  Private
router.put('/:id', auth, upload.array('images', 10), listingController.updateListing);

// @route   DELETE /api/listings/:id
// @desc    Delete listing
// @access  Private
router.delete('/:id', auth, listingController.deleteListing);

// @route   GET /api/listings/user/my-listings
// @desc    Get current user's listings
// @access  Private
router.get('/user/my-listings', auth, listingController.getUserListings);

// @route   POST /api/listings/:id/reviews
// @desc    Add review to listing
// @access  Private
router.post('/:id/reviews', auth, listingController.addReview);

// @route   GET /api/listings/search/nearby
// @desc    Search listings by location
// @access  Public
router.get('/search/nearby', listingController.searchNearbyListings);

module.exports = router;
