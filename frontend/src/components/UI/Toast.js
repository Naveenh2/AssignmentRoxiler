import React from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
    if (!message) return null;
    const className = type === 'error' ? 'alert alert-danger' : 'alert alert-success';
    return (
        <div className={className} role="alert">
            <div className="d-flex justify-content-between align-items-center">
                <div>{message}</div>
                <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Toast;
