import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PeopleBar from '@components/PeopleBar';
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
const setItemMock = jest.fn();
const getItemMock = jest.fn();
Object.defineProperty(window, 'sessionStorage', {
    value: {
        setItem: setItemMock,
        getItem: getItemMock
    },
    writable: true
});

// Mock toast (alert)
const toastPromise = jest.fn();
const toastError = jest.fn();
const toastSuccess = jest.fn();
jest.mock('react-hot-toast', () => ({
    promise: (args: any) => toastPromise(args),
    error: (args: any) => toastError(args),
    success: (args: any) => toastSuccess(args)
}));

describe('PeopleBar() component', () => {
    test("displays the user's name and bio", async () => {
        const groups = [
            { id: 1, name: 'Group 1', color: 'red' },
            { id: 2, name: 'Group 2', color: 'blue' }
        ];
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                groups: groups
            }
        });

        getItemMock.mockReturnValueOnce(auth);
        getItemMock.mockReturnValueOnce('2023');
        getItemMock.mockReturnValueOnce('1');
        const user = {
            username: 'JohnDoe',
            photo: { type: 'Buffer', data: [1, 2, 3] }
        };
        const bio = 'Test Bio';
        const setUserChosen = jest.fn();

        const { getByText } = render(
            <PeopleBar user={user} bio={bio} setUserChosen={setUserChosen} />
        );

        await waitFor(() => {
            const nameElement = getByText('JohnDoe');
            const bioElement = getByText('Test Bio');

            expect(nameElement).toBeInTheDocument();
            expect(bioElement).toBeInTheDocument();
        });
    });

    test('calls axios and setUserChosen when rendered', async () => {
        const groups = [
            { id: 1, name: 'Group 1', color: 'red' },
            { id: 2, name: 'Group 2', color: 'blue' }
        ];
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                groups: groups
            }
        });
        getItemMock.mockReturnValueOnce(auth);
        getItemMock.mockReturnValueOnce('2023');
        getItemMock.mockReturnValueOnce('1');
        const user = {
            username: 'JohnDoe',
            photo: { type: 'Buffer', data: [1, 2, 3] }
        };
        const bio = 'Test Bio';
        const setUserChosen = jest.fn();

        render(
            <PeopleBar user={user} bio={bio} setUserChosen={setUserChosen} />
        );

        await waitFor(() => {
            const addButton = screen.getByRole('button');
            fireEvent.click(addButton);
        });

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(2);
            expect(axios.get).toHaveBeenLastCalledWith(
                `${config.expressHost}/authorized/group/user`,
                {
                    headers: {
                        Authorization: auth
                    },
                    params: {
                        username: 'JohnDoe',
                        ay: '2023',
                        semester: '1'
                    }
                }
            );
            expect(setUserChosen).toHaveBeenCalledTimes(1);
            expect(setUserChosen).toHaveBeenCalledWith(user);
        });
    });

    test('displays the groups', async () => {
        const groups = [
            { id: 1, name: 'Group 1', color: 'red' },
            { id: 2, name: 'Group 2', color: 'blue' }
        ];
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                groups: groups
            }
        });
        const user = {
            username: 'JohnDoe',
            photo: { type: 'Buffer', data: [1, 2, 3] }
        };
        const bio = 'Test Bio';
        const setUserChosen = jest.fn();

        const { getByText } = render(
            <PeopleBar user={user} bio={bio} setUserChosen={setUserChosen} />
        );

        await waitFor(() => {
            const group1Element = getByText('Group 1');
            const group2Element = getByText('Group 2');

            expect(group1Element).toBeInTheDocument();
            expect(group2Element).toBeInTheDocument();
        });
    });

    test('displays alert when axios returns status!==200', async () => {
        axios.get.mockResolvedValueOnce({
            status: 201
        });
        const user = {
            username: 'JohnDoe',
            photo: { type: 'Buffer', data: [1, 2, 3] }
        };
        const bio = 'Test Bio';
        const setUserChosen = jest.fn();

        render(
            <PeopleBar user={user} bio={bio} setUserChosen={setUserChosen} />
        );

        await waitFor(() => {
            expect(toastError).toHaveBeenCalledTimes(1);
            expect(toastError).toHaveBeenLastCalledWith(
                'Problem occurred when retrieving groups of user!'
            );
        });
    });

    test('displays alert when axios returns error', async () => {
        axios.get.mockRejectedValueOnce({
            status: 500
        });
        const user = {
            username: 'JohnDoe',
            photo: { type: 'Buffer', data: [1, 2, 3] }
        };
        const bio = 'Test Bio';
        const setUserChosen = jest.fn();

        render(
            <PeopleBar user={user} bio={bio} setUserChosen={setUserChosen} />
        );

        await waitFor(() => {
            expect(toastError).toHaveBeenCalledTimes(2);
            expect(toastError).toHaveBeenLastCalledWith(
                'Problem occurred when retrieving groups of user!'
            );
        });
    });
});
