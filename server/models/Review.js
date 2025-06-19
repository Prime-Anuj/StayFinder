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
        }
    },

    // Written review
    comment: {
        type: String,
        required: true,
        minlength: [10, 'Review comment must be at least 10 characters'],
        maxlength: [2000, 'Review comment cannot exceed 2000 characters']
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

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
    return this.helpful ? this.helpful.length : 0;
});

// Ensure one review per booking per reviewer
reviewSchema.index({ booking: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);