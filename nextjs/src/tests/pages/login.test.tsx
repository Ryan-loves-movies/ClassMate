import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '@app/(login)/page';

// Mock useRouter from next/navigation
const nextPage = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: nextPage
    })
}));

// Mock axios.post to simulate successful and unsuccessful requests
jest.mock('axios', () => ({
    post: jest.fn((url, data) => {
        if (url.includes('/login')) {
            if (
                data.username === 'validUser' &&
                data.password === 'validPassword123'
            ) {
                return Promise.resolve({
                    status: 200,
                    data: { token: 'mockedToken' }
                });
            } else if (data.username === 'invalidUser') {
                return Promise.reject({ response: { status: 404 } });
            } else if (
                data.username === 'validUser' &&
                data.password === 'invalidPassword123'
            ) {
                return Promise.reject({ response: { status: 401 } });
            } else {
                return Promise.reject({ response: { status: 500 } });
            }
        } else if (url.includes('/register')) {
            if (
                data.email === 'validEmail' &&
                data.username === 'validUser' &&
                data.password === 'validPassword123'
            ) {
                return Promise.resolve({ status: 201 });
            } else {
                return Promise.reject({ response: { status: 409 } });
            }
        }
    })
}));

// Mock sessionStorage.setItem
const setItemMock = jest.fn();
const getItemMock = jest.fn();
Object.defineProperty(window, 'sessionStorage', {
    value: {
        setItem: setItemMock,
        getItem: getItemMock
    },
    writable: true
});

// Mock alert
const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('Login component', () => {
    it('renders without crashing', () => {
        render(<Login />);
        const logoElement = screen.getByAltText('Logo');
        expect(logoElement).toBeInTheDocument();
    });

    it('can handle log in with valid credentials', async () => {
        render(<Login />);
        const usernameInput = screen.getByTestId('login-username');
        const passwordInput = screen.getByTestId('login-password');
        const loginButton = screen.getByTestId('login-submit');

        fireEvent.change(usernameInput, { target: { value: 'validUser' } });
        fireEvent.change(passwordInput, {
            target: { value: 'validPassword123' }
        });

        fireEvent.submit(loginButton);

        await waitFor(() => {
            expect(setItemMock).toHaveBeenCalledWith('token', 'mockedToken');
            expect(setItemMock).toHaveBeenCalledWith('username', 'validUser');
            expect(setItemMock).toHaveBeenCalledWith('ay', '2023');
            expect(setItemMock).toHaveBeenCalledWith('ay', '1');
            expect(
                screen.getAllByText(
                    'One click away from matching modules with your friends!'
                ).length
            ).toEqual(2);
            expect(nextPage).toHaveBeenCalledTimes(1);
        });
    });

    it('shows an alert for invalid username during log in', async () => {
        render(<Login />);
        const usernameInput = screen.getByTestId('login-username');
        const passwordInput = screen.getByTestId('login-password');
        const loginButton = screen.getByTestId('login-submit');

        fireEvent.change(usernameInput, { target: { value: 'invalidUser' } });
        fireEvent.change(passwordInput, {
            target: { value: 'anyPassword123' }
        });

        fireEvent.submit(loginButton);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                'Username could not be found. Have you signed up yet?'
            );
        });
    });

    it('shows an alert for invalid password during log in', async () => {
        render(<Login />);
        const usernameInput = screen.getByTestId('login-username');
        const passwordInput = screen.getByTestId('login-password');
        const loginButton = screen.getByTestId('login-submit');

        fireEvent.change(usernameInput, { target: { value: 'validUser' } });
        fireEvent.change(passwordInput, {
            target: { value: 'invalidPassword123' }
        });

        fireEvent.submit(loginButton);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenLastCalledWith('Wrong password!');
        });
    });

    it('shows an alert for any other error during log in', async () => {
        render(<Login />);
        const usernameInput = screen.getByTestId('login-username');
        const passwordInput = screen.getByTestId('login-password');
        const loginButton = screen.getByTestId('login-submit');

        fireEvent.change(usernameInput, { target: { value: 'validUser' } });
        fireEvent.change(passwordInput, {
            target: { value: 'anyPassword123' }
        });

        fireEvent.submit(loginButton);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                'Wrong username or password!'
            );
        });
    });

    it('can handle successful registration', async () => {
        render(<Login />);
        const usernameInput = screen.getByTestId('register-username');
        const passwordInput = screen.getByTestId('register-password');
        const emailInput = screen.getByTestId('register-email');
        const signupButton = screen.getByTestId('register-submit');

        fireEvent.change(emailInput, { target: { value: 'validEmail' } });
        fireEvent.change(usernameInput, { target: { value: 'validUser' } });
        fireEvent.change(passwordInput, {
            target: { value: 'validPassword123' }
        });

        fireEvent.submit(signupButton);

        await waitFor(() => {
            expect(
                screen.getAllByText(
                    'One click away from matching modules with your friends!'
                ).length
            ).toEqual(2);
        });
    });

    it('shows an alert for registration when the user already exists', async () => {
        render(<Login />);
        const usernameInput = screen.getByTestId('register-username');
        const passwordInput = screen.getByTestId('register-password');
        const emailInput = screen.getByTestId('register-email');
        const signupButton = screen.getByTestId('register-submit');

        fireEvent.change(emailInput, { target: { value: 'invalidEmail' } });
        fireEvent.change(usernameInput, { target: { value: 'invalidUser' } });
        fireEvent.change(passwordInput, {
            target: { value: 'invalidPassword' }
        });

        fireEvent.submit(signupButton);

        await waitFor(() => {
            // To be changed to 'User already exists'
            expect(alertSpy).toHaveBeenLastCalledWith(
                'Wrong username or password!'
            );
        });
    });
});
