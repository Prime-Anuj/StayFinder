const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // Basic information
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    
    // Review type
    reviewType: {
        type: String,
        enum: ['guest_to_host', 'host_to_guest'],
        required: true
    },
    
    // Ratings (1-5 scale)
    ratings: {
        overall: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        // For guest reviews of listings
        cleanliness: {
            type: Number,
            min: 1,
            max: 5
        },
        accuracy: {
            type: Number,
            min: 1,
            max: 5
        },
        communication: {
            type: Number,
            min: 1,
            max: 5
        },
        location: {
            type: Number,
            min: 1,
            max: 5
        },
        checkIn: {
            type: Number,
            min: 1,
            max: 5
        },
        value: {
            type: Number,
            min: 1,
            max: 5
        },
        // For host reviews of guests
        cleanliness_guest: {
            type: Number,
            min: 1,
            max: 5
        },
        communication_guest: {
            type: Number,
            min: 1,
            max: 5
        },
        respect_rules: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    
    // Written review
    comment: {
        type: String,
        required: true,
        minlength: [10, 'Review comment must be at least 10 characters'],
        maxlength: [2000, 'Review comment cannot exceed 2000 characters']
    },
    
    // Private feedback (only visible to the platform)
    privateFeedback: {
        type: String,
        maxlength: [1000, 'Private feedback cannot exceed 1000 characters']
    },
    
    // Response from reviewee
    response: {
        comment: {
            type: String,
            maxlength: [1000, 'Response cannot exceed 1000 characters']
        },
        createdAt: Date
    },
    
    // Review status
    status: {
        type: String,
        enum: ['pending', 'published', 'hidden', 'flagged'],
        default: 'pending'
    },
    
    // Helpful votes
    helpful: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        votedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Moderation
    moderation: {
        flagged: {
            type: Boolean,
            default: false
        },
        flagReason: String,
        moderatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        moderatedAt: Date
    },
    
    // Metadata
    language: {
        type: String,
        default: 'en'
    },
    
    isPublic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes
reviewSchema.index({ listing: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ booking: 1 });
reviewSchema.index({ reviewType: 1 });
reviewSchema.index({ 'ratings.overall': -1 });

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
    return this.helpful ? this.helpful.length : 0;
});

// Ensure one review per booking per reviewer
reviewSchema.index({ booking: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
