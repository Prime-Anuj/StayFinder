import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <div className="h-8 w-8 bg-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="ml-2 text-xl font-bold text-gray-900">StayFinder</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            to="/" 
                            className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Explore
                        </Link>
                        
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to="/bookings" 
                                    className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    My Bookings
                                </Link>
                                
                                {user?.isHost && (
                                    <Link 
                                        to="/dashboard" 
                                        className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Host Dashboard
                                    </Link>
                                )}
                                
                                <Link 
                                    to="/create-listing" 
                                    className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-600 transition-colors"
                                >
                                    Become a Host
                                </Link>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 focus:outline-none"
                                    >
                                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                                <div className="font-medium">{user?.name}</div>
                                                <div className="text-gray-500">{user?.email}</div>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/login" 
                                    className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-600 transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
                            <Link
                                to="/"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Explore
                            </Link>
                            
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/bookings"
                                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Bookings
                                    </Link>
                                    {user?.isHost && (
                                        <Link
                                            to="/dashboard"
                                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Host Dashboard
                                        </Link>
                                    )}
                                    <Link
                                        to="/create-listing"
                                        className="block px-3 py-2 text-base font-medium text-pink-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Become a Host
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600"
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-3 py-2 text-base font-medium text-pink-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
