"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/api/auth/authContext';

export function ProtectedRoute({ children, allowedRoles = []}) {
    const auth = useAuth();
    const { user, loading, role } = auth || {};
    const router = useRouter();
    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/');
            } else if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
                router.push('/');
            }
        }
    }, [user, loading, role, router, allowedRoles]);

    if (loading) {
        return null;
    }   

    return user && (!allowedRoles.length === 0 || allowedRoles.includes(role)) ? children : null;
}
