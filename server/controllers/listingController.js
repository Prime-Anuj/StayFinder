const Listing = require('../models/Listing');
const User = require('../models/User');

exports.createListing = async (req, res) => {
    try {
        const {
            title,
            description,
            address,
            propertyType,
            accommodates,
            bedrooms,
            bathrooms,
            amenities,
            pricePerNight
        } = req.body;

        const images = req.files ? req.files.map(file => file.path) : [];

        const listing = new Listing({
            title,
            description,
            host: req.user.userId,
            address,
            images,
            propertyType,
            accommodates,
            bedrooms,
            bathrooms,
            amenities: amenities ? amenities.split(',') : [],
            pricePerNight
        });

        await listing.save();

        // Update user to be a host
        await User.findByIdAndUpdate(req.user.userId, {
            isHost: true,
            $push: { listings: listing._id }
        });

        res.status(201).json({
            message: 'Listing created successfully',
            listing
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllListings = async (req, res) => {
    try {
        const {
            city,
            checkIn,
            checkOut,
            guests,
            minPrice,
            maxPrice,
            propertyType,
            page = 1,
            limit = 12
        } = req.query;

        let query = { isActive: true };

        // Location filter
        if (city) {
            query['address.city'] = new RegExp(city, 'i');
        }

        // Guest capacity filter
        if (guests) {
            query.accommodates = { $gte: parseInt(guests) };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.pricePerNight = {};
            if (minPrice) query.pricePerNight.$gte = parseInt(minPrice);
            if (maxPrice) query.pricePerNight.$lte = parseInt(maxPrice);
        }

        // Property type filter
        if (propertyType) {
            query.propertyType = propertyType;
        }

        const listings = await Listing.find(query)
            .populate('host', 'name avatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Listing.countDocuments(query);

        res.json({
            listings,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('host', 'name email phone avatar')
            .populate('reviews.user', 'name avatar');

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
