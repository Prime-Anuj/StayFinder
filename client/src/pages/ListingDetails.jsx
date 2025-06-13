import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import listingService from '../services/listingService';
import bookingService from '../services/bookingService';
import BookingForm from '../components/BookingForm';
import ImageGallery from '../components/ImageGallery';
import ReviewList from '../components/ReviewList';

const ListingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showBookingForm, setShowBookingForm] = useState(false);

    useEffect(() => {
        fetchListing();
    }, [id]);

    const fetchListing = async () => {
        try {
            setLoading(true);
            const response = await listingService.getListingById(id);
            setListing(response.data);
        } catch (error) {
            setError('Failed to load listing details');
            console.error('Error fetching listing:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookingSubmit = async (bookingData) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            const response = await bookingService.createBooking({
                ...bookingData,
                listing: listing._id,
                host: listing.host._id
            });
            
            alert('Booking request sent successfully!');
            setShowBookingForm(false);
            navigate('/bookings');
        } catch (error) {
            alert('Failed to create booking. Please try again.');
            console.error('Booking error:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {error || 'Listing not found'}
                    </h2>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{listing.rating || '4.8'} ({listing.reviews?.length || 0} reviews)</span>
                    </div>
                    <span>•</span>
                    <span>{listing.address?.city}, {listing.address?.country}</span>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-8">
                <ImageGallery images={listing.images} />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Property Details */}
                <div className="lg:col-span-2">
                    {/* Host Info */}
                    <div className="border-b pb-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {listing.propertyType} hosted by {listing.host?.name}
                                </h2>
                                <p className="text-gray-600">
                                    {listing.accommodates} guests • {listing.bedrooms} bedrooms • {listing.bathrooms} bathrooms
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-lg font-semibold">
                                    {listing.host?.name?.charAt(0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-b pb-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About this place</h3>
                        <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                    </div>

                    {/* Amenities */}
                    <div className="border-b pb-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">What this place offers</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {listing.amenities?.map((amenity, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 capitalize">{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="border-b pb-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Where you'll be</h3>
                        <p className="text-gray-700">
                            {listing.address?.street}, {listing.address?.city}, {listing.address?.state} {listing.address?.zipCode}
                        </p>
                        <div className="mt-4 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Map integration coming soon</span>
                        </div>
                    </div>

                    {/* Reviews */}
                    <ReviewList reviews={listing.reviews} rating={listing.rating} />
                </div>

                {/* Right Column - Booking Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="border rounded-lg p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className="text-2xl font-bold">${listing.pricePerNight}</span>
                                    <span className="text-gray-600"> / night</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span>{listing.rating || '4.8'}</span>
                                </div>
                            </div>

                            {user?.id === listing.host?._id ? (
                                <div className="text-center py-4">
                                    <p className="text-gray-600 mb-4">This is your listing</p>
                                    <button
                                        onClick={() => navigate(`/edit-listing/${listing._id}`)}
                                        className="w-full bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600"
                                    >
                                        Edit Listing
                                    </button>
                                </div>
                            ) : (
                                <BookingForm
                                    listing={listing}
                                    onSubmit={handleBookingSubmit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;
