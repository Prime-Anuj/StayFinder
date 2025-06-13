const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import configurations
const connectDB = require('./config/database');
const corsOptions = require('./config/cors');
const config = require('./config/config');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
app.use(generalLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'StayFinder API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = config.PORT;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Uploads directory: ${config.UPLOAD_PATH}`);
    console.log(`🌍 Environment: ${config.NODE_ENV}`);
});

module.exports = app;
