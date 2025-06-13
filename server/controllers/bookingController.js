const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

exports.createBooking = async (req, res) => {
    try {
        const { listing, checkIn, checkOut, guests, specialRequests, totalPrice } = req.body;

        // Get listing details
        const listingDetails = await Listing.findById(listing);
        if (!listingDetails) {
            return res.status(404).json({
                success: false,
                message: 'Listing not found'
            });
        }

        // Check if guest capacity is not exceeded
        if (guests > listingDetails.accommodates) {
            return res.status(400).json({
                success: false,
                message: 'Number of guests exceeds property capacity'
            });
        }

        // Check for conflicting bookings
        const conflictingBooking = await Booking.findOne({
            listing,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                {
                    checkIn: { $lte: new Date(checkIn) },
                    checkOut: { $gt: new Date(checkIn) }
                },
                {
                    checkIn: { $lt: new Date(checkOut) },
                    checkOut: { $gte: new Date(checkOut) }
                },
                {
                    checkIn: { $gte: new Date(checkIn) },
                    checkOut: { $lte: new Date(checkOut) }
                }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({
                success: false,
                message: 'Property is not available for selected dates'
            });
        }

        // Create booking
        const booking = new Booking({
            listing,
            guest: req.user.userId,
            host: listingDetails.host,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            specialRequests
        });

        await booking.save();

        // Populate booking details
        await booking.populate('listing', 'title images address pricePerNight');
        await booking.populate('guest', 'name email phone');
        await booking.populate('host', 'name email phone');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ guest: req.user.userId })
            .populate('listing', 'title images address pricePerNight')
            .populate('host', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.getHostBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ host: req.user.userId })
            .populate('listing', 'title images address pricePerNight')
            .populate('guest', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user is the host
        if (booking.host.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this booking'
            });
        }

        booking.status = status;
        await booking.save();

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user is the guest or host
        if (booking.guest.toString() !== req.user.userId && booking.host.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
