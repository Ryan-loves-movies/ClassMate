import React from 'react';
import ProfilePhotoButton from '@components/dashboard/settings/ProfilePhotoButton';
import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import actAxios from 'axios'; // Import axios directly for mocking
import jwt from 'jsonwebtoken';
import config from '@/config';

const { expressHost } = config;
const auth = jwt.sign(
    {
        username: 'modTest',
        password: 'test123'
    },
    'your_secret_value',
    { expiresIn: '5m' } // Expiry in 5 minutes
);

// Mock the sessionStorage for the tests
const localStorageMock = (() => {
    let store = new Map<string, string>([
        ['username', 'mockUsername'],
        ['token', auth]
    ]);

    return {
        getItem(key: string) {
            return (store.get(key) as string) || null;
        }
    };
})();
Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock
});

Object.defineProperty(global, 'FileReader', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        readAsArrayBuffer: function (blob: Blob) {
            // Trigger the onload callback
            this.onload();
        },
        onload: null as
            | ((this: FileReader, ev: ProgressEvent<FileReader>) => any)
            | null,
        result: new ArrayBuffer(42)
    }))
});

// Spy on alert status
const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

// Mock the axios.put method
jest.mock('axios');
const axios = actAxios as jest.Mocked<typeof actAxios>;

// Mock the fake file to be used - NOTE: data contained here is NOT read
const blob = new Blob([], { type: 'image/png' });
const fakeF = blob as File;

describe('ProfilePhotoButton Component', () => {
    it('should call updateProfilePhoto when a file is selected', async () => {
        // Implement custom mock for axios.put
        axios.put.mockResolvedValue({
            status: 200,
            message: 'Photo updated!'
        });

        // Arrange: Render the component
        const component = render(<ProfilePhotoButton />);
        // Act: Trigger the file input change event
        const inputElement = component.container.firstChild?.firstChild as Node;
        fireEvent.change(inputElement, { target: { files: [fakeF] } });

        // Wait for the promises to resolve
        await act(() => Promise.resolve());

        // Assert: Check if updateProfilePhoto is called with the correct arguments
        expect(axios.put).toHaveBeenCalledWith(
            `${expressHost}/authorized/profile/photo`,
            {
                username: 'mockUsername',
                photo: Buffer.from(new ArrayBuffer(42))
            },
            {
                headers: {
                    Authorization: auth
                }
            }
        );

        // Assert: Check if the alert function is called with the correct message
        expect(alertSpy).toHaveBeenCalledWith('Photo updated!');
    });

    it('should show an error alert when updateProfilePhoto fails', async () => {
        // Implement custom mock for axios.put to simulate a failed request
        axios.put.mockRejectedValue(new Error('Failed to update photo'));

        // Arrange: Render the component
        const component = render(<ProfilePhotoButton />);

        // Act: Trigger the file input change event
        const inputElement = component.container.firstChild?.firstChild as Node;
        fireEvent.change(inputElement, { target: { files: [fakeF] } });

        // Wait for the promises to resolve
        await act(() => Promise.resolve());

        // Assert: Check if the alert function is called with the correct error message
        expect(alertSpy).toHaveBeenLastCalledWith(
            'Error occurred when updating photo! Error: Failed to update photo'
        );
    });
});
