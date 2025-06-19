const config = require('./config');

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests from the client URL and localhost for development
        const allowedOrigins = [
            config.CLIENT_URL,
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ];

        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;