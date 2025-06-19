const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [10, 'Title must be at least 10 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [50, 'Description must be at least 50 characters long'],
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Address and location
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        },
        country: {
            type: String,
            required: [true, 'Country is required']
        },
        zipCode: {
            type: String,
            required: [true, 'ZIP code is required']
        }
    },

    // GeoJSON for location-based queries
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
            index: '2dsphere'
        }
    },

    // Images
    images: [{
        type: String,
        required: true
    }],

    // Property details
    propertyType: {
        type: String,
        enum: ['apartment', 'house', 'villa', 'condo', 'studio', 'townhouse', 'guesthouse', 'cabin', 'loft'],
        required: [true, 'Property type is required']
    },

    accommodates: {
        type: Number,
        required: [true, 'Number of guests is required'],
        min: [1, 'Must accommodate at least 1 guest'],
        max: [20, 'Cannot accommodate more than 20 guests']
    },

    bedrooms: {
        type: Number,
        required: [true, 'Number of bedrooms is required'],
        min: [0, 'Bedrooms cannot be negative']
    },

    bathrooms: {
        type: Number,
        required: [true, 'Number of bathrooms is required'],
        min: [0.5, 'Must have at least 0.5 bathroom']
    },

    // Amenities
    amenities: [{
        type: String
    }],

    // Pricing
    pricePerNight: {
        type: Number,
        required: [true, 'Price per night is required'],
        min: [1, 'Price must be at least $1']
    },

    // Bookings
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],

    // Reviews and ratings
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            maxlength: [1000, 'Review comment cannot exceed 1000 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Status and visibility
    isActive: {
        type: Boolean,
        default: true
    },

    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
listingSchema.index({ location: '2dsphere' });
listingSchema.index({ 'address.city': 1 });
listingSchema.index({ propertyType: 1 });
listingSchema.index({ pricePerNight: 1 });
listingSchema.index({ isActive: 1 });
listingSchema.index({ host: 1 });

// Virtual for total reviews count
listingSchema.virtual('totalReviews').get(function() {
    return this.reviews ? this.reviews.length : 0;
});

// Method to check availability
listingSchema.methods.isAvailable = function(checkIn, checkOut) {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // Check for conflicting bookings
    return !this.bookings.some(booking => {
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);

        return (startDate < bookingEnd && endDate > bookingStart);
    });
};

module.exports = mongoose.model('Listing', listingSchema);