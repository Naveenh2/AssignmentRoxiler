import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const OwnerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/owner/dashboard');
                setDashboardData(res.data);
            } catch (err) {
                console.error("Owner Dashboard Error:", err);
                setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center mt-5">Loading Dashboard...</div>;
    if (error) return <div className="alert alert-danger mt-5">Error: {error}</div>;
    if (!dashboardData) return <div className="alert alert-warning mt-5">No store linked to this account.</div>;

    return (
        <div className="container py-5">
            <h1 className="mb-2 text-success">Dashboard for Store: {dashboardData.storeName}</h1>
            <hr className="mb-4" />

            {/* Average Rating Card */}
            <div className="card text-white bg-success shadow-lg mb-5 mx-auto" style={{ maxWidth: '350px' }}>
                <div className="card-header text-center fs-5">Overall Store Performance</div>
                <div className="card-body text-center">
                    <p className="card-text display-1 fw-bold">{dashboardData.averageRating}</p>
                    <p className="card-text fs-5">({dashboardData.totalRatings} total ratings)</p>
                </div>
            </div>

            {/* Users Who Rated List */}
            <h2 className="mb-4 text-secondary">Users Who Submitted Ratings</h2>
            <div className="table-responsive">
                <table className="table table-hover table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>Rating Submitted</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData.usersWhoRated.map((item, index) => (
                            <tr key={index}>
                                <td>{item.user.name}</td>
                                <td>{item.user.email}</td>
                                <td><span className="badge bg-primary fs-6 py-2 px-3">{item.rating} / 5</span></td>
                                <td>{new Date(item.submissionDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {dashboardData.usersWhoRated.length === 0 && <div className="alert alert-info mt-3">No ratings submitted yet.</div>}
        </div>
    );
};

export default OwnerDashboard;