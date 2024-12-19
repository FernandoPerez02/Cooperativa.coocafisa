"use client";
import { useEffect } from 'react';
import { useAuth } from '@/api/auth/authContext';

export function ProtectedRoute({ children, allowedRoles = []}) {
    const auth = useAuth();
    const { user, loading, role } = auth || {};
    useEffect(() => {
        if (!loading) {
            if (!user) {
                console.log('No estás autenticado.');
            } else if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
                console.log('No tiene permiso para acceder a esta ruta.');
            }
        }
    }, [user, loading, role, allowedRoles]);
  
    if (loading) {
        return null;
    }   

    return user && (!allowedRoles.length === 0 || allowedRoles.includes(role)) ? children : null;
}
