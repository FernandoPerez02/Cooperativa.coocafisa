"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { getSession } from '../authenticated/sessionService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    const resetAuth = () => {
        setUser(null);
        setRole(null);
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                
                const { isAuthenticated, user, role } = await getSession();

                if (isAuthenticated) {
                    setUser(user);
                    setRole(role);
                } else {
                    resetAuth();
                }
            } catch (error){
                resetAuth();
            } finally {
                    setLoading(false);
            }
        };
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
