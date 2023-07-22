import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional expect assertions
import Logo from '@components/dashboard/layout/Logo';

let setTheme = 'light';
// Mock the next-themes module to provide a default value for useTheme
jest.mock('next-themes', () => ({
    useTheme: () => {
        return {
            theme: setTheme
        };
    }
}));

describe('Logo Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the logo with light theme correctly', () => {
        setTheme = 'light';
        render(<Logo />);
        const logoImg = screen.getByAltText('Logo');
        expect(logoImg).toBeInTheDocument();
        expect(logoImg).toHaveAttribute('src', '/logoDark.png');
    });

    //failing here
    test('renders the logo with dark theme correctly', () => {
        setTheme = 'dark';

        render(<Logo />);
        const logoImg = screen.getByAltText('Logo');
        expect(logoImg).toBeInTheDocument();
        expect(logoImg).toHaveAttribute('src', '/logoWhite.png');
    });

    test('clicking the logo link navigates to the dashboard', () => {
        render(<Logo />);
        const logoLink = screen.getByRole('link', { name: 'Logo' });
        fireEvent.click(logoLink);
        // Instead of checking window.location, you can check the link's href attribute
        expect(logoLink).toHaveAttribute('href', '/dashboard');
    });

    test('component does not return null when mounted', () => {
        render(<Logo />);
        const logoImg = screen.getByAltText('Logo');
        expect(logoImg).toBeInTheDocument();
    });
});
