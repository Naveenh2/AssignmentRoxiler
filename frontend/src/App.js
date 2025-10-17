import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Line 6 often refers to this line
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminDashboard from './components/Admin/AdminDashboard';
import StoreList from './components/User/StoreList';
import OwnerDashboard from './components/Owner/OwnerDashboard';
import AddRedirect from './components/AddRedirect';
import PasswordUpdate from './pages/PasswordUpdate';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 

const HomeRedirect = () => {
    const { user, loading } = useAuth();
    // While AuthContext is initializing (fetching profile), show a loader
    if (loading) return <div className="text-center mt-5">Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    // Redirect based on role after login
    switch (user.role) {
        case 'Admin': return <Navigate to="/admin/dashboard" replace />;
        case 'StoreOwner': return <Navigate to="/owner/dashboard" replace />;
        case 'NormalUser': return <Navigate to="/stores" replace />;
        default: return <Navigate to="/login" replace />;
    }
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<HomeRedirect />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        
                        {/* Password Update */}
                        <Route element={<ProtectedRoute allowedRoles={['Admin', 'StoreOwner', 'NormalUser']} />}>
                            <Route path="/update-password" element={<PasswordUpdate />} />
                        </Route>
                        
                        {/* Role-Specific Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        </Route>
                        <Route path="/add" element={<AddRedirect />} />
                        <Route element={<ProtectedRoute allowedRoles={['StoreOwner']} />}>
                            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                        </Route>
                        <Route element={<ProtectedRoute allowedRoles={['NormalUser']} />}>
                            <Route path="/stores" element={<StoreList />} />
                        </Route>

                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;