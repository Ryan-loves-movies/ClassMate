'use client'
import { ThemeProvider } from 'next-themes';
import { ReactElement } from 'react';

export default function ThemeProviderLocal({ children }: { children: ReactElement }) {
    return (
        <ThemeProvider defaultTheme='light' enableSystem={false}>
            {children}
        </ThemeProvider>
    );
}
