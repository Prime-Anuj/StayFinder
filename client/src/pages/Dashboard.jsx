import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import listingService from '../services/listingService';
import bookingService from '../services/bookingService';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalListings: 0,
        totalBookings: 0,
        totalRevenue: 0,
        averageRating: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch user's listings
            const listingsResponse = await listingService.getUserListings();
            const userListings = listingsResponse.data;
            setListings(userListings);

            // Fetch bookings
            const bookingsResponse = await bookingService.getHostBookings();
            const hostBookings = bookingsResponse.data;
            setBookings(hostBookings);

            // Calculate stats
            const totalRevenue = hostBookings
                .filter(booking => booking.status === 'completed')
                .reduce((sum, booking) => sum + booking.totalPrice, 0);

            const completedBookings = hostBookings.filter(booking => booking.status === 'completed');
            const averageRating = userListings.length > 0 
                ? userListings.reduce((sum, listing) => sum + (listing.rating || 0), 0) / userListings.length
                : 0;

            setStats({
                totalListings: userListings.length,
                totalBookings: hostBookings.length,
                totalRevenue,
                averageRating: averageRating.toFixed(1)
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookingAction = async (bookingId, action) => {
        try {
            await bookingService.updateBookingStatus(bookingId, action);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Failed to update booking status');
        }
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Listings</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalListings}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Bookings</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Average Rating</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.averageRating}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                </div>
                <div className="p-6">
                    {bookings.slice(0, 5).length > 0 ? (
                        <div className="space-y-4">
                            {bookings.slice(0, 5).map(booking => (
                                <div key={booking._id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{booking.listing?.title}</p>
                                        <p className="text-sm text-gray-600">
                                            {booking.guest?.name} • {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${booking.totalPrice}</p>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No bookings yet</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderListings = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
                <Link
                    to="/create-listing"
                    className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
                >
                    Add New Listing
                </Link>
            </div>

            {listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map(listing => (
                        <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={listing.images[0] || '/placeholder-image.jpg'}
                                alt={listing.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">
                                    {listing.address?.city}, {listing.address?.country}
                                </p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-bold">${listing.pricePerNight}/night</span>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-sm">{listing.rating || '4.8'}</span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        to={`/listing/${listing._id}`}
                                        className="flex-1 bg-gray-100 text-gray-800 px-3 py-2 rounded text-center text-sm hover:bg-gray-200"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        to={`/edit-listing/${listing._id}`}
                                        className="flex-1 bg-pink-500 text-white px-3 py-2 rounded text-center text-sm hover:bg-pink-600"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">You haven't created any listings yet</p>
                    <Link
                        to="/create-listing"
                        className="bg-pink-500 text-white px-6 py-3 rounded-md hover:bg-pink-600"
                    >
                        Create Your First Listing
                    </Link>
                </div>
            )}
        </div>
    );

    const renderBookings = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Booking Requests</h2>

            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="font-semibold text-lg">{booking.listing?.title}</h3>
                                    <p className="text-gray-600">Guest: {booking.guest?.name}</p>
                                    <p className="text-gray-600">Email: {booking.guest?.email}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-600">Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600">Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600">Guests: {booking.guests}</p>
                                    <p className="text-lg font-semibold mt-2">Total: ${booking.totalPrice}</p>
                                </div>
                                
                                <div className="flex flex-col justify-center">
                                    <div className="mb-4">
                                        <span className={`px-3 py-1 text-sm rounded-full ${
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                    
                                    {booking.status === 'pending' && (
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleBookingAction(booking._id, 'confirmed')}
                                                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleBookingAction(booking._id, 'cancelled')}
                                                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">No booking requests yet</p>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.name}!</p>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: 'overview', name: 'Overview' },
                                { id: 'listings', name: 'My Listings' },
                                { id: 'bookings', name: 'Bookings' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-pink-500 text-pink-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'listings' && renderListings()}
                {activeTab === 'bookings' && renderBookings()}
            </div>
        </div>
    );
};

export default Dashboard;
