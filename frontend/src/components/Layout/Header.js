import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// import './Header.css'; // Optional: Use a separate CSS file for Header

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper to determine the dashboard link
    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'Admin': return '/admin/dashboard';
            case 'StoreOwner': return '/owner/dashboard';
            case 'NormalUser': return '/stores';
            default: return '/';
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <Link className="navbar-brand fs-4 fw-bold" to={getDashboardLink()}>Store Rating Platform</Link>
                
                <div className="collapse navbar-collapse show">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {user ? (
                            <>
                                <li className="nav-item me-3">
                                    <span className="nav-link text-warning fw-bold">Role: {user.role}</span>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-sm btn-outline-light me-2" to="/update-password">Update Password</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-sm btn-danger" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/signup">Sign Up</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;