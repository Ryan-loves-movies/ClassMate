'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function SignOut() {
    const router = useRouter();
    const handleLogout = () => {
        // Remove the "token" key from Session Storage
        sessionStorage.removeItem('token');

        // Redirect to the root URL
        router.push('/');
    };

    return (
        <a onClick={handleLogout} type="button">
            Sign out
        </a>
    );
}
