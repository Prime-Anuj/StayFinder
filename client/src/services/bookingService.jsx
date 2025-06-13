import api from './api';

const bookingService = {
    createBooking: (bookingData) => api.post('/bookings', bookingData),
    getUserBookings: () => api.get('/bookings/user'),
    getHostBookings: () => api.get('/bookings/host'),
    updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
    cancelBooking: (id) => api.put(`/bookings/${id}/cancel`)
};

export default bookingService;
