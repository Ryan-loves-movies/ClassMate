'use client';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { ReactElement } from 'react';

export default function ThemeProviderLocal({
    children
}: {
    children: ReactElement;
}) {
    return (
        <ThemeProvider
            defaultTheme="system"
            enableColorScheme={true}
            themes={['light', 'dark']}
            attribute="data-theme"
        >
            {children}
        </ThemeProvider>
    );
}
