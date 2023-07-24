import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import actAxios from 'axios';
import ProfileMenuButton from '@components/dashboard/layout/ProfileMenuButton';

// Mock axios get method
jest.mock('axios');
const axios = actAxios as jest.Mocked<typeof actAxios>;

// Mock next/router
jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn()
    })
}));

// Mock SignOut component
const mockSignOut = () => <div>SignOut component</div>;
jest.mock('@components/dashboard/layout/SignOut', () => {
    return () => mockSignOut();
});

// Mock toast (alert)
const toastPromise = jest.fn();
const toastError = jest.fn();
const toastSuccess = jest.fn();
jest.mock('react-hot-toast', () => ({
    toast: {
        promise: (args: any) => toastPromise(args),
        error: (args: any) => toastError(args),
        success: (args: any) => toastSuccess(args)
    }
}));
describe('ProfileMenuButton Component', () => {
    beforeEach(() => {
        // Clear sessionStorage mock before each test
        window['sessionStorage'].clear();
    });

    test('renders the button with the username and photo correctly', async () => {
        const username = 'testuser';
        const photoArrBuffer = [1, 2, 3]; // Mock photo array buffer

        // Set sessionStorage mock
        window['sessionStorage'].setItem('username', username);

        // Mock the axios get method response
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                photo: {
                    data: photoArrBuffer
                }
            }
        });

        render(<ProfileMenuButton />);

        // Wait for axios to resolve
        await waitFor(() => {
            // Check if the photo and username are rendered correctly
            const photoElement = screen.getByAltText('Profile');
            const usernameElements = screen.getAllByText(username);

            expect(photoElement).toBeInTheDocument();
            expect(photoElement).toHaveAttribute(
                'src',
                'data:image/*;base64,AQID'
            );
            expect(usernameElements).toHaveLength(2); // Expecting 2 occurrences of "testuser" in this case

            expect(screen.getByRole('button').lastChild).toHaveClass(
                'dropdown-wrapper'
            );
        });
    });

    test('displays an error message when there is an Axios error', async () => {
        // Set sessionStorage mock
        window['sessionStorage'].setItem('username', 'testuser');
        window['sessionStorage'].setItem('token', 'testtoken');

        // Mock the axios get method to return an error response
        axios.get.mockRejectedValueOnce(new Error('Axios Error'));

        render(<ProfileMenuButton />);

        await waitFor(() => {
            // Check if the photo renderer is not present
            const photoRenderer = screen.queryByAltText('Profile');
            expect(photoRenderer).not.toBeInTheDocument();
            // Wait for axios to resolve (or reject in this case)
            expect(toastError).toHaveBeenLastCalledWith(
                'Sorry! A problem occurred! Your photo could not be found!'
            );
        });
    });
});
