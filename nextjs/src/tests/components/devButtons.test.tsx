import React from 'react';
import DevButtons from '@components/dashboard/settings/DevButtons';
import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import actAxios from 'axios';
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
jest.spyOn(window.sessionStorage.__proto__, 'getItem').mockReturnValue(auth);
jest.spyOn(window, 'alert').mockImplementation(() => {});

jest.mock('axios');
const axios = actAxios as jest.Mocked<typeof actAxios>;

describe('DevButtons Component', () => {
    it('should call updateModules and updateLessons when button is clicked', async () => {
        axios.post
            .mockResolvedValueOnce({
                status: 201,
                message: 'database updated!'
            })
            .mockResolvedValueOnce({
                status: 200,
                message: 'database updated!'
            });
        // Arrange: Render the component
        const { getByText } = render(<DevButtons />);

        // Act: Simulate a click on the button
        fireEvent.click(getByText('Update Modules and Lessons in Database'));

        await act(() => Promise.resolve());

        // Assert: Check if updateModules and updateLessons are called with the correct arguments
        expect(axios.post).toHaveBeenNthCalledWith(
            1,
            `${expressHost}/authorized/allModules`,
            { ay: 2023 },
            { headers: { Authorization: auth } }
        );
        expect(axios.post).toHaveBeenNthCalledWith(
            2,
            `${expressHost}/authorized/allLessons`,
            { ay: 2023 },
            { headers: { Authorization: auth } }
        );
    });

    it('should show alert with "Modules Updated!" message, then a second alert with "Lessons Updated!" on successful API call', async () => {
        // Mock the successful API call
        axios.post
            .mockResolvedValueOnce({
                status: 200,
                message: 'database updated!'
            })
            .mockResolvedValueOnce({
                status: 200,
                message: 'database updated!'
            });

        // Spy on the global alert function
        const alertSpy = jest.spyOn(window, 'alert');

        // Arrange: Render the component
        const { getByText } = render(<DevButtons />);

        // Act: Simulate a click on the button
        fireEvent.click(getByText('Update Modules and Lessons in Database'));

        // Wait for the promises to resolve
        await act(() => Promise.resolve());

        // Assert: Check if the alert function is called with the correct message
        expect(alertSpy).toHaveBeenNthCalledWith(3, 'Modules Updated!');
        expect(alertSpy).toHaveBeenNthCalledWith(4, 'Lessons Updated!');
    });

    it('should show alert with error message on failed API call', async () => {
        // Mock the failed API call
        axios.post
            .mockRejectedValueOnce(
                new Error('Error occurred when updating modules!')
            )
            .mockRejectedValueOnce(
                new Error('Error occurred when updating lessons!')
            );

        // Spy on the global alert function
        const alertSpy = jest.spyOn(window, 'alert');

        // Arrange: Render the component
        const { getByText } = render(<DevButtons />);

        // Act: Simulate a click on the button
        fireEvent.click(getByText('Update Modules and Lessons in Database'));

        // Wait for the promises to resolve
        await act(() => Promise.resolve());

        // Assert: Check if the alert function is called with the correct error message
        expect(alertSpy).toHaveBeenNthCalledWith(
            5,
            'Error occurred when updating modules! Error: Error occurred when updating modules!'
        );
        expect(alertSpy).toHaveBeenNthCalledWith(
            6,
            'Error occurred when updating lessons! Error: Error occurred when updating lessons!'
        );
    });
});
