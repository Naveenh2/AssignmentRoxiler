import React, { useState } from 'react';
import api from '../api/axiosConfig';

const PasswordUpdate = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match.');
            return;
        }

        // Basic client-side validation check (must match backend rules)
        // Password: 8-16 characters, must include at least one uppercase letter and one special character.
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('Password must be 8-16 characters, include one uppercase letter, and one special character.');
            return;
        }

        try {
            // The API call is protected by the JWT token set in the Authorization header
            const res = await api.put('/auth/update-password', { newPassword });
            
            setMessage(res.data.message || 'Password updated successfully!');
            
            // Clear fields on success
            setNewPassword('');
            setConfirmPassword('');

        } catch (err) {
            console.error("Password Update Error:", err);
            // Safely retrieve error message from the backend
            setError(err.response?.data?.message || 'Failed to update password. Please try logging out and back in.');
        }
    };

    return (
        <div className="card p-4 mx-auto mt-5 shadow-lg" style={{ maxWidth: '450px' }}>
            <h2 className="text-center mb-4 text-primary">Update Password</h2>
            
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        minLength="8"
                        maxLength="16"
                    />
                </div>
                <div className="mb-4">
                    <label className="form-label">Confirm New Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        minLength="8"
                        maxLength="16"
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100 fs-5">Update Password</button>
            </form>
        </div>
    );
};

export default PasswordUpdate;