import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import ProfileMenuButton from '@components/dashboard/layout/ProfileMenuButton';

// Mock axios get method
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock next/router
jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock SignOut component
jest.mock('@components/dashboard/layout/SignOut', () => {
    return () => <div>SignOut component</div>;
});

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
        mockedAxios.get.mockResolvedValueOnce({
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
            expect(photoElement).toHaveAttribute('src', 'data:image/*;base64,AQID');
            expect(usernameElements).toHaveLength(2); // Expecting 2 occurrences of "testuser" in this case
            // You can further assert on specific elements within usernameElements, if needed.
        });
    });


    test('renders the button with the username when photo data is missing', async () => {
        // Set sessionStorage mock
        window['sessionStorage'].setItem('username', 'testuser');

        // Mock the axios get method to return a successful response without photo data
        mockedAxios.get.mockResolvedValueOnce({
            status: 200,
            data: {},
        });

        const component = render(<ProfileMenuButton />);

        // Wait for axios to resolve
        const dropdownContainer = component.container.firstChild?.childNodes[1]
        expect(dropdownContainer).toContainHTML('<div><span>testuser</span></div><div><a href="/settings">Profile</a><div>SignOut component</div></div>');

        // Check if the photo renderer is not present
        const photoRenderer = screen.queryByAltText('Profile');
        expect(photoRenderer).not.toBeInTheDocument();
    });


    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    test('displays an error message when there is an Axios error', async () => {
        // Set sessionStorage mock
        window['sessionStorage'].setItem('username', 'testuser');
        window['sessionStorage'].setItem('token', 'testtoken');

        // Mock the axios get method to return an error response
        mockedAxios.get.mockRejectedValueOnce(new Error('Axios Error'));

        render(<ProfileMenuButton />);

        // Wait for axios to resolve (or reject in this case)
        expect(alertSpy).toHaveBeenLastCalledWith(
            'Sorry! A problem occurred! Your email could not be found.'
        );
    });
});