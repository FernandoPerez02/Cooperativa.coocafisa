"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/api/auth/authContext';

export function ProtectedRoute({ children }) {
    const auth = useAuth();
    const { user, loading } = auth || {};
    const router = useRouter();
    useEffect(() => {
        if (!loading && user === null) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return null;
    }   

    return user ? children : null;
}
