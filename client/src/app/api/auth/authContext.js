"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from './authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await api.get('/session');     
                console.log(response);
                const data = await response.json();
                if (data.user) setUser(data.user);
            } catch {
                setUser(null);
            }
        };
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
