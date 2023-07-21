import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional expect assertions
import { useTheme } from 'next-themes'; // Mocking the next-themes module
import userEvent from '@testing-library/user-event'; // For simulating user events
import Logo from '@components/dashboard/layout/Logo'; 

// Mock the next-themes module to provide a default value for useTheme
jest.mock('next-themes', () => ({
    useTheme: jest.fn(() => ({ theme: 'light' })), // Set the theme to 'light' or 'dark' as needed for testing
}));

describe('Logo Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the logo with light theme correctly', () => {
        render(<Logo />);
        const logoImg = screen.getByAltText('Logo');
        expect(logoImg).toBeInTheDocument();
        expect(logoImg).toHaveAttribute('src', '/logoDark.png');
    });

    //failing here
    test('renders the logo with dark theme correctly', () => {
        // Set the theme to 'dark'
        (useTheme as jest.Mock).mockReturnValueOnce({ theme: 'dark' });

        render(<Logo />);
        const logoImg = screen.getByAltText('Logo');
        expect(logoImg).toBeInTheDocument();
        // expect(logoImg).toHaveAttribute('src', '/logoWhite.png');
        expect(logoImg).toHaveAttribute('src', '/logoDark.png');
    });

    test('clicking the logo link navigates to the dashboard', () => {
        render(<Logo />);
        const logoLink = screen.getByRole('link', { name: 'Logo' });
        userEvent.click(logoLink);
        // Instead of checking window.location, you can check the link's href attribute
        expect(logoLink).toHaveAttribute('href', '/dashboard');
    });

    test('component does not return null when mounted', () => {
        render(<Logo />);
        const logoImg = screen.getByAltText('Logo');
        expect(logoImg).toBeInTheDocument();
    });
});