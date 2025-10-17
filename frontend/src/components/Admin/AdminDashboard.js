import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import UserStoreTable from './UserStoreTable';
// import { useState, useEffect } from 'react';

// Simple small-form components for Admin add actions are included inline below

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [ownerOptions, setOwnerOptions] = useState([]);

    // Form state for creating user
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'NormalUser' });
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });

    const fetchOwners = async () => {
        try {
            // Fetch users and filter StoreOwners for owner select
            const res = await api.get('/admin/users');
            const owners = res.data.filter(u => u.role === 'StoreOwner');
            setOwnerOptions(owners);
        } catch (err) {
            console.error('Failed to fetch owners', err);
        }
    };

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setAnalytics(res.data);
                // fetch owners for create store select
                await fetchOwners();
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
            {/* Add User Form */}
            <div className="card p-3 mb-4">
                <h5>Add new user</h5>
                {message && <div className="alert alert-info">{message}</div>}
                <div className="row g-2">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Name (20-60 chars)" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                    </div>
                    <div className="col-md-2">
                        <select className="form-control" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                            <option value="NormalUser">NormalUser</option>
                            <option value="StoreOwner">StoreOwner</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="col-12 mt-2">
                        <input className="form-control" placeholder="Address" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} />
                    </div>
                    <div className="col-12 mt-2">
                        <button className="btn btn-primary" onClick={async () => {
                            try {
                                await api.post('/admin/users', newUser);
                                setMessage('User created successfully');
                                setNewUser({ name: '', email: '', password: '', address: '', role: 'NormalUser' });
                            } catch (err) {
                                console.error('Create user failed', err);
                                setMessage(err.response?.data?.message || 'Failed to create user');
                            }
                        }}>Create User</button>
                    </div>
                </div>
            </div>

            <UserStoreTable type="users" /> 
            
            <h2 className="mt-5 mb-3 text-secondary">Store Management</h2>
            {/* Add Store Form */}
            <div className="card p-3 mb-4">
                <h5>Add new store</h5>
                <div className="row g-2">
                    <div className="col-md-3">
                        <input className="form-control" placeholder="Store Name" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" placeholder="Email" value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Address" value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} />
                    </div>
                    <div className="col-md-2">
                        <select className="form-control" value={newStore.ownerId} onChange={e => setNewStore({...newStore, ownerId: e.target.value})}>
                            <option value="">Select Owner</option>
                            {ownerOptions.map(o => <option value={o.id} key={o.id}>{o.name} ({o.email})</option>)}
                        </select>
                    </div>
                    <div className="col-12 mt-2">
                        <button className="btn btn-success" onClick={async () => {
                            try {
                                await api.post('/admin/stores', newStore);
                                setMessage('Store created successfully');
                                setNewStore({ name: '', email: '', address: '', ownerId: '' });
                            } catch (err) {
                                console.error('Create store failed', err);
                                setMessage(err.response?.data?.message || 'Failed to create store');
                            }
                        }}>Create Store</button>
                    </div>
                </div>
            </div>

            <UserStoreTable type="stores" />
        </div>
    );
};

export default AdminDashboard;