import api from './api';

const listingService = {
    getAllListings: (filters = {}) => api.get('/listings', { params: filters }),
    getListingById: (id) => api.get(`/listings/${id}`),
    createListing: (formData) => api.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateListing: (id, formData) => api.put(`/listings/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteListing: (id) => api.delete(`/listings/${id}`),
    getUserListings: () => api.get('/listings/user/my-listings')
};

export default listingService;
