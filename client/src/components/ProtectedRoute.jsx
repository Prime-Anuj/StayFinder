import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireHost = false }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireHost && !user?.isHost) {
        // Redirect to dashboard if user is not a host
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
