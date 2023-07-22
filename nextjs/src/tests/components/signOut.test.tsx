import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignOut from '@components/dashboard/layout/SignOut';
import { useRouter } from 'next/router';
import React from 'react';

// Mock useRouter hook to return a dummy router object
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => {
        return {
            push: mockPush
        };
    }
}));

const removeSpy = jest.spyOn(window.sessionStorage.__proto__, 'removeItem');

describe('SignOut Component', () => {
    test('redirects to root URL after clicking the "Sign out" link', () => {
        const { getByText } = render(<SignOut />);

        const signOutLink = getByText('Sign out');
        fireEvent.click(signOutLink);

        expect(removeSpy).toHaveBeenCalledWith('token');
        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith('/');
    });
});
