import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone
        });

        if (!result.success) {
            setErrors({ general: result.error });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join StayFinder and start your journey
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {errors.general}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                                    errors.name ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number (Optional)
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                                    errors.phone ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                                    errors.password ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating account...
                                </div>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/login" className="text-pink-600 hover:text-pink-500 font-medium">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
