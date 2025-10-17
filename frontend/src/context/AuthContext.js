import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const init = async () => {
            setLoading(true);
            if (token) {
                try {
                    const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (!res.ok) throw new Error('Failed to fetch profile');
                    const data = await res.json();
                    setUser({ token, ...data });
                } catch (err) {
                    // If profile fetch fails, clear local token
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        init();
    }, []);

    const login = async (token, role) => {
        localStorage.setItem('token', token);
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch profile');
            const data = await res.json();
            setUser({ token, ...data });
            setLoading(false);
            return data;
        } catch (err) {
            // fallback: set minimal user object with role
            setUser({ token, role });
            setLoading(false);
            return { role };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};