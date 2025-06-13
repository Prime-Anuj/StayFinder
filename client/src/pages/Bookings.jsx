import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';

const Bookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getUserBookings();
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await bookingService.cancelBooking(bookingId);
                fetchBookings(); // Refresh bookings
            } catch (error) {
                console.error('Error cancelling booking:', error);
                alert('Failed to cancel booking');
            }
        }
    };

    const filterBookings = (status) => {
        const now = new Date();
        switch (status) {
            case 'upcoming':
                return bookings.filter(booking => 
                    (booking.status === 'confirmed' || booking.status === 'pending') && 
                    new Date(booking.checkIn) > now
                );
            case 'past':
                return bookings.filter(booking => 
                    booking.status === 'completed' || 
                    (booking.status === 'confirmed' && new Date(booking.checkOut) < now)
                );
            case 'cancelled':
                return bookings.filter(booking => booking.status === 'cancelled');
            default:
                return bookings;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderBookingCard = (booking) => (
        <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
                <div className="md:w-1/3">
                    <img
                        src={booking.listing?.images?.[0] || '/placeholder-image.jpg'}
                        alt={booking.listing?.title}
                        className="w-full h-48 md:h-full object-cover"
                    />
                </div>
                <div className="p-6 md:w-2/3">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {booking.listing?.title}
                            </h3>
                            <p className="text-gray-600">
                                {booking.listing?.address?.city}, {booking.listing?.address?.country}
                            </p>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-sm text-gray-600">Check-in</p>
                            <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Check-out</p>
                            <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Guests</p>
                            <p className="font-medium">{booking.guests}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Price</p>
                            <p className="font-medium text-lg">${booking.totalPrice}</p>
                        </div>
                    </div>

                    {booking.specialRequests && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">Special Requests</p>
                            <p className="text-gray-800">{booking.specialRequests}</p>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to={`/listing/${booking.listing?._id}`}
                            className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 text-sm"
                        >
                            View Listing
                        </Link>
                        
                        {booking.status === 'confirmed' && new Date(booking.checkIn) > new Date() && (
                            <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                            >
                                Cancel Booking
                            </button>
                        )}
                        
                        {booking.status === 'completed' && (
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
                                Write Review
                            </button>
                        )}
                        
                        <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 text-sm">
                            Contact Host
                        </button>
                    </div>
                </div>
            </div>
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
                    <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-600">Manage your travel reservations</p>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: 'upcoming', name: 'Upcoming', count: filterBookings('upcoming').length },
                                { id: 'past', name: 'Past', count: filterBookings('past').length },
                                { id: 'cancelled', name: 'Cancelled', count: filterBookings('cancelled').length }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                        activeTab === tab.id
                                            ? 'border-pink-500 text-pink-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span>{tab.name}</span>
                                    {tab.count > 0 && (
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            activeTab === tab.id
                                                ? 'bg-pink-100 text-pink-600'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-6">
                    {filterBookings(activeTab).length > 0 ? (
                        filterBookings(activeTab).map(renderBookingCard)
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No {activeTab} bookings
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {activeTab === 'upcoming' 
                                    ? "You don't have any upcoming trips planned."
                                    : activeTab === 'past'
                                    ? "You haven't completed any trips yet."
                                    : "You haven't cancelled any bookings."
                                }
                            </p>
                            <Link
                                to="/"
                                className="bg-pink-500 text-white px-6 py-3 rounded-md hover:bg-pink-600"
                            >
                                Explore Stays
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Bookings;
