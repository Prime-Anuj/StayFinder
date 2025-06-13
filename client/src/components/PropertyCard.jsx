import React from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ listing }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/listing/${listing._id}`);
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
            onClick={handleClick}
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={listing.images[0] || '/placeholder-image.jpg'}
                    alt={listing.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-white rounded-full p-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
            </div>
            
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {listing.title}
                    </h3>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">{listing.rating || '4.8'}</span>
                    </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">
                    {listing.address?.city}, {listing.address?.country}
                </p>
                
                <p className="text-gray-600 text-sm mb-3">
                    {listing.accommodates} guests • {listing.bedrooms} bedrooms • {listing.bathrooms} bathrooms
                </p>
                
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-lg font-bold text-gray-900">${listing.pricePerNight}</span>
                        <span className="text-gray-600"> / night</span>
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{listing.propertyType}</span>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
