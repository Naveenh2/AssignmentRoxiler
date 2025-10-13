import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import UserStoreTable from './UserStoreTable';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setAnalytics(res.data);
            } catch (err) {
                console.error("Error fetching analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="text-center mt-5">Loading Admin Dashboard...</div>;

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-secondary">System Administrator Dashboard</h1>
            
            {/* Analytics Section */}
            <div className="row mb-5 g-4">
                {['Total Users', 'Total Stores', 'Total Ratings'].map((title, index) => (
                    <div className="col-md-4" key={index}>
                        <div className={`card text-white bg-${index === 0 ? 'primary' : index === 1 ? 'success' : 'info'} shadow-sm h-100`}>
                            <div className="card-body">
                                <h5 className="card-title">{title}</h5>
                                <p className="card-text display-4 fw-bold">{analytics ? analytics[Object.keys(analytics)[index]] : '...'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <h2 className="mt-5 mb-3 text-secondary">User Management</h2>
            <UserStoreTable type="users" /> 
            
            <h2 className="mt-5 mb-3 text-secondary">Store Management</h2>
            <UserStoreTable type="stores" />
        </div>
    );
};

export default AdminDashboard;