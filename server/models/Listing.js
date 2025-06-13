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
        },
        neighborhood: String
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
        url: {
            type: String,
            required: true
        },
        caption: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    
    // Property details
    propertyType: {
        type: String,
        enum: ['apartment', 'house', 'villa', 'condo', 'studio', 'townhouse', 'guesthouse', 'cabin', 'loft'],
        required: [true, 'Property type is required']
    },
    
    roomType: {
        type: String,
        enum: ['entire_place', 'private_room', 'shared_room'],
        default: 'entire_place'
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
    
    beds: {
        type: Number,
        required: [true, 'Number of beds is required'],
        min: [1, 'Must have at least 1 bed']
    },
    
    bathrooms: {
        type: Number,
        required: [true, 'Number of bathrooms is required'],
        min: [0.5, 'Must have at least 0.5 bathroom'],
        step: 0.5
    },
    
    // Amenities
    amenities: [{
        type: String,
        enum: [
            'wifi', 'kitchen', 'washer', 'dryer', 'air_conditioning', 'heating',
            'pool', 'hot_tub', 'gym', 'parking', 'tv', 'workspace',
            'fireplace', 'balcony', 'garden', 'beach_access', 'elevator',
            'wheelchair_accessible', 'pets_allowed', 'smoking_allowed',
            'breakfast', 'laptop_friendly_workspace', 'iron', 'hair_dryer',
            'essentials', 'hangers', 'bed_linens', 'extra_pillows_blankets'
        ]
    }],
    
    // Safety features
    safetyFeatures: [{
        type: String,
        enum: [
            'smoke_detector', 'carbon_monoxide_detector', 'fire_extinguisher',
            'first_aid_kit', 'security_cameras', 'lockbox', 'self_checkin'
        ]
    }],
    
    // Pricing
    pricePerNight: {
        type: Number,
        required: [true, 'Price per night is required'],
        min: [1, 'Price must be at least $1']
    },
    
    currency: {
        type: String,
        default: 'USD'
    },
    
    // Additional fees
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
        }
    },
    
    // Booking rules
    rules: {
        checkInTime: {
            type: String,
            default: '3:00 PM'
        },
        checkOutTime: {
            type: String,
            default: '11:00 AM'
        },
        minimumStay: {
            type: Number,
            default: 1,
            min: 1
        },
        maximumStay: {
            type: Number,
            default: 365
        },
        instantBook: {
            type: Boolean,
            default: false
        },
        cancellationPolicy: {
            type: String,
            enum: ['flexible', 'moderate', 'strict', 'super_strict'],
            default: 'moderate'
        }
    },
    
    // House rules
    houseRules: [{
        type: String,
        maxlength: [200, 'House rule cannot exceed 200 characters']
    }],
    
    // Availability
    availability: [{
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        available: {
            type: Boolean,
            default: true
        }
    }],
    
    // Bookings
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    
    // Reviews and ratings
    rating: {
        overall: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        cleanliness: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        accuracy: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        communication: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        location: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        checkIn: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        value: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        }
    },
    
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        rating: {
            overall: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            cleanliness: Number,
            accuracy: Number,
            communication: Number,
            location: Number,
            checkIn: Number,
            value: Number
        },
        comment: {
            type: String,
            maxlength: [1000, 'Review comment cannot exceed 1000 characters']
        },
        response: {
            comment: String,
            date: Date
        },
        helpful: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
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
    
    isVerified: {
        type: Boolean,
        default: false
    },
    
    views: {
        type: Number,
        default: 0
    },
    
    // SEO and metadata
    slug: {
        type: String,
        unique: true
    },
    
    tags: [String],
    
    // Analytics
    analytics: {
        totalBookings: {
            type: Number,
            default: 0
        },
        totalRevenue: {
            type: Number,
            default: 0
        },
        averageOccupancy: {
            type: Number,
            default: 0
        }
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
listingSchema.index({ 'rating.overall': -1 });
listingSchema.index({ isActive: 1 });
listingSchema.index({ host: 1 });

// Virtual for total reviews count
listingSchema.virtual('totalReviews').get(function() {
    return this.reviews ? this.reviews.length : 0;
});

// Virtual for average rating calculation
listingSchema.virtual('averageRating').get(function() {
    if (!this.reviews || this.reviews.length === 0) return 0;
    
    const sum = this.reviews.reduce((acc, review) => acc + review.rating.overall, 0);
    return (sum / this.reviews.length).toFixed(1);
});

// Pre-save middleware to generate slug
listingSchema.pre('save', function(next) {
    if (this.isModified('title') || this.isNew) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
        
        // Append ID to ensure uniqueness
        if (this._id) {
            this.slug += `-${this._id.toString().slice(-6)}`;
        }
    }
    next();
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

// Method to calculate total price
listingSchema.methods.calculateTotalPrice = function(checkIn, checkOut, guests) {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    let totalPrice = this.pricePerNight * nights;
    
    // Add fees
    totalPrice += this.fees.cleaning || 0;
    totalPrice += this.fees.service || 0;
    totalPrice += this.fees.security || 0;
    
    return totalPrice;
};

module.exports = mongoose.model('Listing', listingSchema);
