import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import listingService from '../services/listingService';

const CreateListing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        },
        propertyType: '',
        accommodates: 1,
        bedrooms: 1,
        bathrooms: 1,
        amenities: [],
        pricePerNight: '',
        images: []
    });

    const propertyTypes = [
        { value: 'apartment', label: 'Apartment' },
        { value: 'house', label: 'House' },
        { value: 'villa', label: 'Villa' },
        { value: 'condo', label: 'Condo' },
        { value: 'studio', label: 'Studio' }
    ];

    const availableAmenities = [
        'WiFi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning', 'Heating',
        'Pool', 'Hot tub', 'Gym', 'Parking', 'TV', 'Workspace',
        'Fireplace', 'Balcony', 'Garden', 'Beach access'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            
            // Append form data
            Object.keys(formData).forEach(key => {
                if (key === 'address') {
                    Object.keys(formData.address).forEach(addressKey => {
                        formDataToSend.append(`address.${addressKey}`, formData.address[addressKey]);
                    });
                } else if (key === 'amenities') {
                    formDataToSend.append('amenities', formData.amenities.join(','));
                } else if (key === 'images') {
                    formData.images.forEach(image => {
                        formDataToSend.append('images', image);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await listingService.createListing(formDataToSend);
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to create listing. Please try again.');
            console.error('Error creating listing:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Tell us about your place</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Property Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Beautiful apartment in downtown"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Describe your space..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Property Type
                            </label>
                            <select
                                name="propertyType"
                                value={formData.propertyType}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            >
                                <option value="">Select property type</option>
                                {propertyTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Where is your place located?</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State/Province
                                </label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    name="address.country"
                                    value={formData.address.country}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ZIP Code
                                </label>
                                <input
                                    type="text"
                                    name="address.zipCode"
                                    value={formData.address.zipCode}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Guests
                                </label>
                                <input
                                    type="number"
                                    name="accommodates"
                                    value={formData.accommodates}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bedrooms
                                </label>
                                <input
                                    type="number"
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bathrooms
                                </label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={handleInputChange}
                                    min="1"
                                    step="0.5"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">What amenities do you offer?</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableAmenities.map(amenity => (
                                <div
                                    key={amenity}
                                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                        formData.amenities.includes(amenity)
                                            ? 'border-pink-500 bg-pink-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    onClick={() => handleAmenityToggle(amenity)}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.amenities.includes(amenity)}
                                            onChange={() => handleAmenityToggle(amenity)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">{amenity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Set your price and add photos</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price per night (USD)
                            </label>
                            <input
                                type="number"
                                name="pricePerNight"
                                value={formData.pricePerNight}
                                onChange={handleInputChange}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Photos
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Upload at least 3 photos to showcase your space
                            </p>
                        </div>

                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Step {currentStep} of 4</span>
                        <span className="text-sm text-gray-600">{Math.round((currentStep / 4) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / 4) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleSubmit}>
                        {renderStep()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Listing'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateListing;
