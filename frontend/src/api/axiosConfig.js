import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to check if JWT token is expired
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (error) {
        // If token is malformed, consider it expired
        return true;
    }
};

// Request Interceptor: Attaches JWT token for protected routes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Check if token is expired before using it
            if (isTokenExpired(token)) {
                // Token is expired, clear storage and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
                return Promise.reject(new Error('Token expired'));
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401 responses (expired/invalid tokens)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid or expired, clear storage and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;