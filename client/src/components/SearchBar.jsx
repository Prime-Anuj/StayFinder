import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchData, setSearchData] = useState({
        city: '',
        checkIn: '',
        checkOut: '',
        guests: 1
    });

    const handleInputChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Where
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={searchData.city}
                        onChange={handleInputChange}
                        placeholder="Search destinations"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in
                    </label>
                    <input
                        type="date"
                        name="checkIn"
                        value={searchData.checkIn}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out
                    </label>
                    <input
                        type="date"
                        name="checkOut"
                        value={searchData.checkOut}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guests
                    </label>
                    <select
                        name="guests"
                        value={searchData.guests}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? 'guest' : 'guests'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="mt-6 text-center">
                <button
                    type="submit"
                    className="bg-pink-500 text-white px-8 py-3 rounded-md hover:bg-pink-600 transition-colors font-medium"
                >
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
