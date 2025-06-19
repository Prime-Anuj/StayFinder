const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
    },
    avatar: {
        type: String,
        default: ''
    },
    dateOfBirth: {
        type: Date
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    isHost: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    // Address information
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },

    // References to other models
    listings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    }],

    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    }],

    // Account status
    isActive: {
        type: Boolean,
        default: true
    },

    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ isHost: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);