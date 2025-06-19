const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    // Basic booking information
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: [true, 'Listing is required']
    },
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Guest is required']
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Host is required']
    },

    // Date information
    checkIn: {
        type: Date,
        required: [true, 'Check-in date is required'],
        validate: {
            validator: function(value) {
                return value >= new Date();
            },
            message: 'Check-in date must be in the future'
        }
    },
    checkOut: {
        type: Date,
        required: [true, 'Check-out date is required'],
        validate: {
            validator: function(value) {
                return value > this.checkIn;
            },
            message: 'Check-out date must be after check-in date'
        }
    },

    // Guest information
    guests: {
        type: Number,
        required: [true, 'Number of guests is required'],
        min: [1, 'At least 1 guest is required']
    },

    // Pricing
    totalPrice: {
        type: Number,
        required: true,
        min: [0, 'Total price cannot be negative']
    },

    // Booking status
    status: {
        type: String,
        enum: [
            'pending',      // Waiting for host approval
            'confirmed',    // Host approved, payment successful
            'checked_in',   // Guest has checked in
            'checked_out',  // Guest has checked out
            'completed',    // Booking finished, can be reviewed
            'cancelled',    // Cancelled by guest or host
            'expired',      // Booking request expired
            'declined'      // Host declined the request
        ],
        default: 'pending'
    },

    // Payment information
    paymentInfo: {
        paymentMethod: {
            type: String,
            enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'],
            default: 'credit_card'
        },
        transactionId: String,
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        paidAt: Date
    },

    // Communication
    specialRequests: {
        type: String,
        maxlength: [1000, 'Special requests cannot exceed 1000 characters']
    },

    // Cancellation details
    cancellation: {
        cancelledBy: {
            type: String,
            enum: ['guest', 'host', 'admin']
        },
        reason: String,
        cancellationDate: Date,
        refundAmount: Number
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ guest: 1, status: 1 });
bookingSchema.index({ host: 1, status: 1 });
bookingSchema.index({ status: 1 });

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
    return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

// Instance method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
    const now = new Date();
    const checkInDate = new Date(this.checkIn);
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

    // Can cancel if more than 24 hours before check-in and status allows
    return hoursUntilCheckIn > 24 && ['pending', 'confirmed'].includes(this.status);
};

module.exports = mongoose.model('Booking', bookingSchema);