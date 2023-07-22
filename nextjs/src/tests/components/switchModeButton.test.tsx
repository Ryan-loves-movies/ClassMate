import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useTheme } from 'next-themes'; // Import the actual useTheme hook
import SwitchModeButton from '@components/dashboard/layout/SwitchModeButton';

// Mock the next-themes module
jest.mock('next-themes', () => ({
    useTheme: jest.fn()
}));

describe('SwitchModeButton Component', () => {
    test('toggles theme on button click', () => {
        // Mock the useTheme hook return values
        const setTheme = jest.fn();
        const theme = 'light'; // Initial theme

        (useTheme as jest.Mock).mockReturnValue({
            theme,
            setTheme
        });

        const { getByTitle } = render(<SwitchModeButton />);

        // Find the button element and click it
        const buttonElement = getByTitle('Switch Theme');
        fireEvent.click(buttonElement);

        // Check if setTheme was called with the correct theme after the click
        expect(setTheme).toHaveBeenCalledWith('dark');
    });

    test('renders with the correct class name when theme is active', () => {
        // Mock the useTheme hook return values
        const setTheme = jest.fn();
        const theme = 'dark'; // Active theme

        (useTheme as jest.Mock).mockReturnValue({
            theme,
            setTheme
        });

        const { getByTestId } = render(<SwitchModeButton />);

        // Check if the button element has the 'active' class name when theme is active
        const buttonElement = getByTestId('switch-mode-button');
        expect(buttonElement).toHaveClass('active');
    });

    test('renders with the correct class name when theme is not active', () => {
        // Mock the useTheme hook return values
        const setTheme = jest.fn();
        const theme = 'light'; // Inactive theme

        (useTheme as jest.Mock).mockReturnValue({
            theme,
            setTheme
        });

        const { getByTestId } = render(<SwitchModeButton />);

        // Check if the button element does not have the 'active' class name when theme is not active
        const buttonElement = getByTestId('switch-mode-button');
        expect(buttonElement).not.toHaveClass('active');
    });
});
