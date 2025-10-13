import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const initialFormState = { name: '', email: '', password: '', address: '' };

const Signup = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            // Note: Validation rules should be enforced on the backend via Express-Validator
            await api.post('/auth/signup', formData);
            
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error("Signup Error:", err);
            // Handle specific validation errors returned from the backend (errors array)
            const backendErrors = err.response?.data?.errors?.map(e => e.msg).join('; ');
            setError(backendErrors || err.response?.data?.message || 'Signup failed. Please check input.');
        }
    };

    return (
        <div className="card p-4 mx-auto mt-5 shadow-lg" style={{ maxWidth: '500px' }}>
            <h2 className="text-center mb-4 text-success">Normal User Registration</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3"><label className="form-label">Name (20-60 chars)</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required /></div>
                <div className="mb-3"><label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required /></div>
                <div className="mb-3"><label className="form-label">Address (Max 400 chars)</label>
                    <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required /></div>
                <div className="mb-3"><label className="form-label">Password (8-16 chars, Uppercase, Special)</label>
                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required /></div>
                
                <button type="submit" className="btn btn-success w-100 fs-5">Sign Up</button>
            </form>
            <p className="mt-3 text-center">Already have an account? <Link to="/login">Log In</Link></p>
        </div>
    );
};

export default Signup;