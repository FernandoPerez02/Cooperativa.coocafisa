"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/api/auth/authContext';

export function ProtectedRoute({ children }) {
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (user === null) {
            router.push('/');
        }
    }, [user, router]);
    

    return user ? children : null;
}
