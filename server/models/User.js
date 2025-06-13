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
    languages: [{
        type: String,
        trim: true
    }],
    isHost: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    // Host-specific fields
    hostInfo: {
        responseRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        responseTime: {
            type: String,
            enum: ['within an hour', 'within a few hours', 'within a day', 'a few days or more'],
            default: 'within a day'
        },
        joinedDate: {
            type: Date,
            default: Date.now
        },
        superhost: {
            type: Boolean,
            default: false
        }
    },
    
    // Address information
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    
    // Social media links
    socialMedia: {
        facebook: String,
        instagram: String,
        linkedin: String,
        website: String
    },
    
    // Preferences
    preferences: {
        currency: {
            type: String,
            default: 'INR'
        },
        language: {
            type: String,
            default: 'en'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: false
            },
            push: {
                type: Boolean,
                default: true
            }
        }
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
userSchema.index({ 'address.city': 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        // Hash password with cost of 12
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

// Instance method to generate reset token
userSchema.methods.getResetPasswordToken = function() {
    const crypto = require('crypto');
    
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    // Set expire time (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
};

// Virtual for full name
userSchema.virtual('fullAddress').get(function() {
    if (!this.address) return '';
    const { street, city, state, country, zipCode } = this.address;
    return `${street}, ${city}, ${state} ${zipCode}, ${country}`.replace(/,\s*,/g, ',').trim();
});

module.exports = mongoose.model('User', userSchema);
