import React from 'react';

export default function SignOut() {
    const handleLogout = () => {
        // Remove the "token" key from Session Storage
        sessionStorage.removeItem('token');

        // Redirect to the root URL
        window.location.href = "/";
    };

    return (
        <a onClick={handleLogout}>Sign out</a>
    );
};
