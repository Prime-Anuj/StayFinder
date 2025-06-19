# StayFinder - Full-Stack Airbnb Clone

StayFinder is a comprehensive full-stack web application built as an Airbnb clone, providing property listing, booking, and management functionality. This project demonstrates modern web development practices using the MERN stack.

## 🚀 Features

### Core Functionality
- **User Authentication**: Registration, login, and secure JWT-based authentication
- **Property Listings**: Create, view, edit, and delete property listings
- **Booking System**: Complete booking workflow with date validation and conflict checking
- **Host Dashboard**: Comprehensive management interface for hosts
- **Guest Dashboard**: Booking management and trip planning for guests
- **Review System**: Bidirectional reviews between hosts and guests
- **Search & Filters**: Advanced search with location, price, and amenity filters

### Technical Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Image Upload**: Secure file upload with image optimization
- **Real-time Validation**: Form validation on both frontend and backend
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: Rate limiting, input sanitization, and secure authentication

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern functional components with hooks
- **React Router DOM**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API communication
- **Context API**: State management for authentication

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling library
- **JWT**: JSON Web Tokens for authentication
- **Multer**: Middleware for handling file uploads
- **bcryptjs**: Password hashing library

### Development Tools
- **Nodemon**: Development server auto-restart
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: API rate limiting
- **Express Validator**: Input validation middleware

## 📁 Project Structure

```
stayfinder/
├── client/                 # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Navbar.js
│   │   │   ├── PropertyCard.js
│   │   │   ├── SearchBar.js
│   │   │   ├── BookingForm.js
│   │   │   ├── ImageGallery.js
│   │   │   ├── ReviewList.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/         # Route-based page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── ListingDetail.js
│   │   │   ├── CreateListing.js
│   │   │   ├── Dashboard.js
│   │   │   └── Bookings.js
│   │   ├── context/       # React Context for state management
│   │   │   └── AuthContext.js
│   │   ├── services/      # API service functions
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── listingService.js
│   │   │   └── bookingService.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   │   ├── database.js
│   │   ├── config.js
│   │   └── cors.js
│   ├── controllers/      # Business logic handlers
│   │   ├── authController.js
│   │   ├── listingController.js
│   │   ├── bookingController.js
│   │   └── userController.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js
│   │   ├── upload.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Listing.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── Message.js
│   ├── routes/          # API endpoint definitions
│   │   ├── auth.js
│   │   ├── listings.js
│   │   ├── bookings.js
│   │   └── users.js
│   ├── uploads/         # File storage directory
│   │   ├── listings/
│   │   ├── avatars/
│   │   └── thumbnails/
│   ├── .env
│   ├── server.js
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stayfinder
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/stayfinder
   JWT_SECRET=your-super-secure-jwt-secret-key
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=5000000
   UPLOAD_PATH=./uploads (if needed)
   CLIENT_URL=http://localhost:3000
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   cd client
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Listing Endpoints
- `GET /api/listings` - Get all listings with filters
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing (protected)
- `PUT /api/listings/:id` - Update listing (protected)
- `DELETE /api/listings/:id` - Delete listing (protected)
- `GET /api/listings/user/my-listings` - Get user's listings (protected)
- `POST /api/listings/:id/reviews` - Add review to listing (protected)

### Booking Endpoints
- `POST /api/bookings` - Create new booking (protected)
- `GET /api/bookings/user` - Get user's bookings as guest (protected)
- `GET /api/bookings/host` - Get user's bookings as host (protected)
- `GET /api/bookings/:id` - Get booking by ID (protected)
- `PUT /api/bookings/:id/status` - Update booking status (protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)

### User Endpoints
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/password` - Change password (protected)
- `DELETE /api/users/account` - Delete user account (protected)
- `GET /api/users/:id` - Get public user profile

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: File type and size validation
- **CORS Configuration**: Properly configured cross-origin requests

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive design inspired by Airbnb
- **Interactive Components**: Smooth animations and transitions
- **Form Validation**: Real-time validation with user-friendly error messages
- **Image Gallery**: Interactive image viewing with modal support
- **Search Functionality**: Advanced search with multiple filters

## 🔧 Development Features

- **Hot Reloading**: Automatic page refresh during development
- **Error Handling**: Comprehensive error handling and logging
- **Code Organization**: Modular, maintainable code structure
- **Environment Configuration**: Separate configurations for development and production
- **API Testing**: RESTful API design ready for testing

## 🚀 Deployment

### Backend Deployment
1. Set up production MongoDB database
2. Configure environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Set up file storage (AWS S3, Cloudinary, etc.)

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or GitHub Pages
3. Configure environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## 👥 Authors

- **StayFinder Team** - Full-stack development

## 🙏 Acknowledgments

- Inspired by Airbnb's user experience and functionality
- Built with modern web development best practices
- Uses open-source libraries and frameworks


**StayFinder** - Your gateway to amazing stays around the world! 🏠✨
