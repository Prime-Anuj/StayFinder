const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const bookingValidation = [
    body('listing').notEmpty().withMessage('Listing ID is required'),
    body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
    body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
    body('guests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1')
];

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, bookingValidation, bookingController.createBooking);

// @route   GET /api/bookings/user
// @desc    Get current user's bookings (as guest)
// @access  Private
router.get('/user', auth, bookingController.getUserBookings);

// @route   GET /api/bookings/host
// @desc    Get current user's bookings (as host)
// @access  Private
router.get('/host', auth, bookingController.getHostBookings);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, bookingController.getBookingById);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', auth, bookingController.updateBookingStatus);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', auth, bookingController.cancelBooking);

module.exports = router;