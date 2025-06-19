module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/stayfinder',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

    // File upload settings
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5000000, // 5MB
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',

    // Email settings (for future implementation)
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT || 587,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,

    // Payment settings (for future implementation)
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    // Client URL
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

    // Development settings
    NODE_ENV: process.env.NODE_ENV || 'development'
};