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
        adults: {
            type: Number,
            required: true,
            min: [1, 'At least 1 adult is required']
        },
        children: {
            type: Number,
            default: 0,
            min: 0
        },
        infants: {
            type: Number,
            default: 0,
            min: 0
        },
        pets: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    
    // Pricing breakdown
    pricing: {
        basePrice: {
            type: Number,
            required: true
        },
        nightlyRate: {
            type: Number,
            required: true
        },
        nights: {
            type: Number,
            required: true
        },
        fees: {
            cleaning: {
                type: Number,
                default: 0
            },
            service: {
                type: Number,
                default: 0
            },
            security: {
                type: Number,
                default: 0
            },
            taxes: {
                type: Number,
                default: 0
            }
        },
        discounts: {
            weekly: {
                type: Number,
                default: 0
            },
            monthly: {
                type: Number,
                default: 0
            },
            firstTime: {
                type: Number,
                default: 0
            },
            coupon: {
                code: String,
                amount: {
                    type: Number,
                    default: 0
                }
            }
        },
        totalPrice: {
            type: Number,
            required: true,
            min: [0, 'Total price cannot be negative']
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    
    // Booking status and lifecycle
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
            enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto'],
            required: true
        },
        paymentProcessor: {
            type: String,
            enum: ['stripe', 'paypal', 'square'],
            default: 'stripe'
        },
        transactionId: String,
        paymentIntentId: String,
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
            default: 'pending'
        },
        paidAt: Date,
        refundAmount: {
            type: Number,
            default: 0
        },
        refundReason: String,
        refundedAt: Date
    },
    
    // Communication and special requests
    guestMessage: {
        type: String,
        maxlength: [1000, 'Guest message cannot exceed 1000 characters']
    },
    
    hostMessage: {
        type: String,
        maxlength: [1000, 'Host message cannot exceed 1000 characters']
    },
    
    specialRequests: {
        earlyCheckIn: {
            requested: Boolean,
            time: String,
            approved: Boolean,
            fee: Number
        },
        lateCheckOut: {
            requested: Boolean,
            time: String,
            approved: Boolean,
            fee: Number
        },
        extraServices: [{
            service: String,
            description: String,
            price: Number,
            approved: Boolean
        }]
    },
    
    // Check-in/Check-out details
    checkInDetails: {
        actualTime: Date,
        keyHandover: {
            method: {
                type: String,
                enum: ['in_person', 'lockbox', 'smart_lock', 'concierge']
            },
            instructions: String,
            code: String
        },
        checkedInBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    
    checkOutDetails: {
        actualTime: Date,
        checkedOutBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        propertyCondition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor']
        },
        issues: [String],
        securityDepositReturn: {
            amount: Number,
            reason: String,
            returnedAt: Date
        }
    },
    
    // Reviews (bidirectional)
    reviews: {
        guestReview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        },
        hostReview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    },
    
    // Cancellation details
    cancellation: {
        cancelledBy: {
            type: String,
            enum: ['guest', 'host', 'admin']
        },
        reason: String,
        cancellationDate: Date,
        refundAmount: Number,
        cancellationPolicy: String
    },
    
    // Important dates
    dates: {
        bookingRequested: {
            type: Date,
            default: Date.now
        },
        paymentDue: Date,
        lastModified: {
            type: Date,
            default: Date.now
        },
        expiresAt: Date
    },
    
    // Metadata
    metadata: {
        source: {
            type: String,
            enum: ['web', 'mobile_app', 'api'],
            default: 'web'
        },
        ipAddress: String,
        userAgent: String,
        referralCode: String
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
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ 'dates.expiresAt': 1 }, { expireAfterSeconds: 0 });

// Virtual for total guests
bookingSchema.virtual('totalGuests').get(function() {
    return this.guests.adults + this.guests.children + this.guests.infants;
});

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
    return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

// Virtual for days until check-in
bookingSchema.virtual('daysUntilCheckIn').get(function() {
    const today = new Date();
    const checkInDate = new Date(this.checkIn);
    return Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
bookingSchema.pre('save', function(next) {
    // Update last modified date
    this.dates.lastModified = new Date();
    
    // Set expiration for pending bookings (24 hours)
    if (this.status === 'pending' && !this.dates.expiresAt) {
        this.dates.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
    
    // Calculate total guests
    const totalGuests = this.guests.adults + this.guests.children + this.guests.infants;
    this.guests.total = totalGuests;
    
    next();
});

// Instance method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
    const now = new Date();
    const checkInDate = new Date(this.checkIn);
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);
    
    // Can cancel if more than 24 hours before check-in and status allows
    return hoursUntilCheckIn > 24 && ['pending', 'confirmed'].includes(this.status);
};

// Instance method to calculate refund amount
bookingSchema.methods.calculateRefund = function(cancellationPolicy) {
    const now = new Date();
    const checkInDate = new Date(this.checkIn);
    const daysUntilCheckIn = Math.ceil((checkInDate - now) / (1000 * 60 * 60 * 24));
    
    let refundPercentage = 0;
    
    switch (cancellationPolicy || 'moderate') {
        case 'flexible':
            refundPercentage = daysUntilCheckIn >= 1 ? 100 : 0;
            break;
        case 'moderate':
            if (daysUntilCheckIn >= 5) refundPercentage = 100;
            else if (daysUntilCheckIn >= 1) refundPercentage = 50;
            else refundPercentage = 0;
            break;
        case 'strict':
            if (daysUntilCheckIn >= 7) refundPercentage = 100;
            else if (daysUntilCheckIn >= 1) refundPercentage = 50;
            else refundPercentage = 0;
            break;
        case 'super_strict':
            if (daysUntilCheckIn >= 30) refundPercentage = 100;
            else if (daysUntilCheckIn >= 7) refundPercentage = 50;
            else refundPercentage = 0;
            break;
    }
    
    return (this.pricing.totalPrice * refundPercentage) / 100;
};

module.exports = mongoose.model('Booking', bookingSchema);
