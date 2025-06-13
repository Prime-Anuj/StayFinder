import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import listingService from '../services/listingService';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        fetchListings();
    }, [filters]);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const response = await listingService.getAllListings(filters);
            setListings(response.data.listings);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchFilters) => {
        setFilters(searchFilters);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-4">Find Your Perfect Stay</h1>
                    <p className="text-xl mb-8">Discover amazing places to stay around the world</p>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            {/* Listings Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Destinations</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {listings.map((listing) => (
                            <PropertyCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                )}

                {!loading && listings.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No properties found. Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
