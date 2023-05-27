import React from 'react';

export default function LogOut() {
    const handleLogout = () => {
        // Remove the "token" key from Session Storage
        sessionStorage.removeItem('token');

        // Redirect to the root URL
        window.location.href = "/";
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};
