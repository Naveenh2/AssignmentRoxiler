import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddRedirect = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate('/login');

        switch (user.role) {
            case 'Admin':
                return navigate('/admin/dashboard');
            case 'StoreOwner':
                return navigate('/owner/dashboard');
            case 'NormalUser':
                return navigate('/stores');
            default:
                return navigate('/login');
        }
    }, [user, loading, navigate]);

    return <div>Redirecting...</div>;
};

export default AddRedirect;
