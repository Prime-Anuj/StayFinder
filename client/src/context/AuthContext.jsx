import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setToken(token);
            setUser(user);

            navigate('/dashboard');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setToken(token);
            setUser(user);

            navigate('/dashboard');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/');
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
