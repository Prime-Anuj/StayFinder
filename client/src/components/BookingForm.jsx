import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const BookingForm = ({ listing, onSubmit }) => {
    const { isAuthenticated } = useAuth();
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        specialRequests: ''
    });
    const [totalPrice, setTotalPrice] = useState(0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: value
        }));

        // Calculate total price when dates change
        if (name === 'checkIn' || name === 'checkOut') {
            calculateTotalPrice(
                name === 'checkIn' ? value : bookingData.checkIn,
                name === 'checkOut' ? value : bookingData.checkOut
            );
        }
    };

    const calculateTotalPrice = (checkIn, checkOut) => {
        if (checkIn && checkOut) {
            const startDate = new Date(checkIn);
            const endDate = new Date(checkOut);
            const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            
            if (nights > 0) {
                setTotalPrice(nights * listing.pricePerNight);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            alert('Please login to make a booking');
            return;
        }

        const nights = Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24));
        
        onSubmit({
            ...bookingData,
            totalPrice,
            nights
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in
                    </label>
                    <input
                        type="date"
                        name="checkIn"
                        value={bookingData.checkIn}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out
                    </label>
                    <input
                        type="date"
                        name="checkOut"
                        value={bookingData.checkOut}
                        onChange={handleInputChange}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                </label>
                <select
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                >
                    {Array.from({ length: listing.accommodates }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                            {num} {num === 1 ? 'guest' : 'guests'}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                </label>
                <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Any special requests or questions for the host?"
                />
            </div>

            {totalPrice > 0 && (
                <div className="border-t pt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>${listing.pricePerNight} x {Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))} nights</span>
                        <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                    </div>
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-pink-500 text-white py-3 px-4 rounded-md hover:bg-pink-600 transition-colors font-medium"
            >
                {isAuthenticated ? 'Reserve' : 'Login to Reserve'}
            </button>
        </form>
    );
};

export default BookingForm;
