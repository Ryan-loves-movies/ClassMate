import React from 'react';
import { Toaster } from 'react-hot-toast';
import '@app/(login)/globals.css';

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app'
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
            <Toaster />
        </html>
    );
}
