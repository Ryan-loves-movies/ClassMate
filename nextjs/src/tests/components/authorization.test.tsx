import React from 'react';
import AuthorizationComponent from '@components/dashboard/Authorization';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import actAxios from 'axios';
import jwt from 'jsonwebtoken';
import config from '@/config';

const auth = jwt.sign(
    {
        username: 'modTest',
        password: 'test123'
    },
    'your_secret_value',
    { expiresIn: '5m' } // Expiry in 5 minutes
);
jest.mock('axios');
const axios = actAxios as jest.Mocked<typeof actAxios>;

// Mock the sessionStorage for the tests
jest.spyOn(window.sessionStorage.__proto__, 'getItem').mockReturnValue(auth);
const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

// Mock useRouter hook to return a dummy router object
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => {
        return {
            push: mockPush
        };
    }
}));

describe('AuthorizationComponent', () => {
    beforeEach(() => {
        // Reset the mock implementations before each test
        jest.clearAllMocks();
    });

    it('should render the children if user is authorized', async () => {
        // Mock the axios.get() function to return a successful response
        axios.get.mockResolvedValueOnce({ status: 200 });

        render(
            <AuthorizationComponent>
                <div>Authorized content</div>
            </AuthorizationComponent>
        );

        await act(() => Promise.resolve());
        // Wait for the authorization logic to complete
        await waitFor(() => {
            expect(screen.getByText('Authorized content')).toBeInTheDocument();
            // Assert that the authorized content is rendered
            expect(screen.getByText('Authorized content')).toBeInTheDocument();
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(
                `${config.expressHost}/authorized/user`,
                {
                    headers: {
                        Authorization: auth
                    }
                }
            );
            expect(mockPush).toHaveBeenCalledTimes(0);
        });
    });

    it('should redirect to homepage and show an error message if authorization fails', async () => {
        // Mock the axios.get() function to return an error response
        axios.get.mockRejectedValueOnce({ status: 401 });

        render(
            <AuthorizationComponent>
                <div>Authorized content</div>
            </AuthorizationComponent>
        );

        await act(() => Promise.resolve());
        // Wait for the authorization logic to complete
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledTimes(1);
            expect(alertSpy).toHaveBeenLastCalledWith(
                'Token expired, Please sign back in!'
            );
            expect(mockPush).toHaveBeenCalledTimes(1);
        });
    });

    it('should show an error message if an unexpected error occurs during authorization', async () => {
        // Mock the axios.get() function to throw an error
        axios.get.mockRejectedValueOnce({
            status: 400
        });

        render(
            <AuthorizationComponent>
                <div>Authorized content</div>
            </AuthorizationComponent>
        );

        await act(() => Promise.resolve());
        // Wait for the authorization logic to complete
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledTimes(1);
            expect(alertSpy).toHaveBeenLastCalledWith(
                'Something went wrong! Please sign back in!'
            );
        });
    });
});
