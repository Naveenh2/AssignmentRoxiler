import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="loading-screen">Loading...</div>;

    if (!user) {
        // Not logged in -> Redirect to login
        return <Navigate to="/login" replace />; 
    }

    if (!allowedRoles.includes(user.role)) {
        // Logged in, but unauthorized role -> Redirect to a safe path (e.g., home/login)
        alert("Access Denied: You do not have permission to view this page.");
        return <Navigate to="/login" replace />; 
    }

    return <Outlet />;
};

export default ProtectedRoute;