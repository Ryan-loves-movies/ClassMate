import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import jwt from 'jsonwebtoken';
import actAxios from 'axios'; // Import axios for mocking
import Dashboard from '@app/(dashboard)/dashboard/page';
import config from '@/config';
import { act } from 'react-dom/test-utils';

// Mocking axios.get and axios.put
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
const localStorageMock = (() => {
    let store = new Map<string, string>([
        ['username', 'mockUsername'],
        ['ay', '2023'],
        ['sem', '1'],
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

const groups = [
    { id: 1, name: 'Group 1', moduleCode: 'CS2030', color: 'red' },
    { id: 2, name: 'Group 2', moduleCode: 'BT1101', color: 'blue' }
];
const defResp = {
    status: 200,
    data: {
        groups: groups
    }
};
describe('Dashboard page', () => {
    it('renders the Dashboard component', async () => {
        // Mock the axios.get call for fetching groups
        axios.get.mockResolvedValueOnce(defResp);
        // axios.getUsersInGroup() calls
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });

        render(<Dashboard />);
        await act(() => Promise.resolve());
    });

    it('displays the "Groups" section header', async () => {
        axios.get.mockResolvedValueOnce(defResp);
        // axios.getUsersInGroup() calls
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });
        const { getByText } = render(<Dashboard />);
        await waitFor(() => {
            const headerElement = getByText('Groups');
            expect(headerElement).toBeInTheDocument();
        });
    });

    it('displays the "Find others!" header when no group is chosen', async () => {
        axios.get.mockResolvedValueOnce(defResp);
        // axios.getUsersInGroup() calls
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });
        const { getByText } = render(<Dashboard />);
        await waitFor(() => {
            const headerElement = getByText('Find others!');
            expect(headerElement).toBeInTheDocument();
        });
    });

    it('displays the "Add user to GroupName" header when a group is chosen', async () => {
        axios.get.mockResolvedValueOnce(defResp);
        // axios.getUsersInGroup() calls
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });
        const { getByText } = render(<Dashboard />);
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(12);
            fireEvent.click(screen.getAllByTitle('Add Friend')[0]);
            // Assuming the groupChosen state is set to a group with name "GroupName"
            const headerElement = getByText('Add user to Group 1:');
            expect(headerElement).toBeInTheDocument();
            expect(axios.get).toHaveBeenCalledTimes(12);
        });
    });

    it('fetches groups associated with the user', async () => {
        // Mock axios.get response data
        const mockResponseData = {
            data: {
                groups: [
                    {
                        id: 1,
                        moduleCode: 'CS1010',
                        name: 'Group 1',
                        color: 'red',
                        users: []
                    },
                    {
                        id: 2,
                        moduleCode: 'CS2030',
                        name: 'Group 2',
                        color: 'blue',
                        users: []
                    }
                ]
            },
            status: 200
        };

        // Mock the axios.get call for fetching groups
        axios.get.mockResolvedValueOnce(mockResponseData);
        // axios.getUsersInGroup() calls
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });

        // Render the component
        const { getByText } = render(<Dashboard />);

        // Wait for axios.get to resolve and update state
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(15);
            // Check if the group names are rendered
            const group1Element = getByText('Group 1');
            const group2Element = getByText('Group 2');
            expect(group1Element).toBeInTheDocument();
            expect(group2Element).toBeInTheDocument();
        });
    });

    it('adds user to a group when userChosen and groupChosen are both defined', async () => {
        // Mock the axios.put call for adding user to group
        axios.post.mockResolvedValue({
            status: 200
        });

        // axios.getGroups() call
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                groups: groups
            }
        });

        // axios.getUsersInGroup() calls
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });

        // axios.searchUsers() call
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: [
                    {
                        username: 'testuser',
                        photo: {
                            type: 'Buffer',
                            data: [1, 2, 3]
                        }
                    }
                ]
            }
        });

        // getGroups in PeopleBar -> Get groups user is in
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                groups: []
            }
        });
        // getGroups in page.tsx -> re-render
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                groups: groups
            }
        });
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });

        // Render the component
        render(<Dashboard />);
        await waitFor(() => {
            fireEvent.click(
                screen
                    .getAllByRole('button')
                    .find(
                        (elem) => elem.lastChild?.textContent === 'Add Friend'
                    ) as HTMLElement
            ); // Click on groupbox
            fireEvent.change(
                screen
                    .getAllByRole('textbox')
                    .find(
                        (elem) =>
                            elem.nextSibling?.lastChild?.textContent ===
                            'Search users'
                    ) as HTMLElement,
                {
                    target: {
                        value: 'testSearch'
                    }
                }
            );
        });
        await waitFor(() => {
            fireEvent.click(
                screen
                    .getAllByRole('button')
                    .find(
                        (elem) =>
                            elem.firstChild?.lastChild?.textContent ===
                            'Add Friend for Group'
                    ) as HTMLElement
            );
        });
        // Wait for axios.put to resolve and update state
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledTimes(23);
            expect(axios.post).toHaveBeenLastCalledWith(
                `${config.expressHost}/authorized/notifications`,
                {
                    username: 'mockUsername',
                    requestee: 'testuser',
                    groupId: 1
                },
                {
                    headers: {
                        Authorization: auth
                    }
                }
            );
        });
    });

    it('displays error alert if error occurs when userChosen and groupChosen are both defined', async () => {
        // Mock the axios.put call for adding user to group
        axios.post.mockRejectedValueOnce({
            status: 500
        });

        // axios.getGroups() call
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                groups: groups
            }
        });

        // axios.getUsersInGroup() calls
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: []
            }
        });

        // axios.searchUsers() call
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                users: [
                    {
                        username: 'testuser',
                        photo: {
                            type: 'Buffer',
                            data: [1, 2, 3]
                        }
                    }
                ]
            }
        });

        // getGroups in PeopleBar -> Get groups user is in
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                groups: []
            }
        });
        // This time, there is no further re-rendering since axios call fails

        // Render the component
        render(<Dashboard />);
        await waitFor(() => {
            fireEvent.click(
                screen
                    .getAllByRole('button')
                    .find(
                        (elem) => elem.lastChild?.textContent === 'Add Friend'
                    ) as HTMLElement
            ); // Click on groupbox
            fireEvent.change(
                screen
                    .getAllByRole('textbox')
                    .find(
                        (elem) =>
                            elem.nextSibling?.lastChild?.textContent ===
                            'Search users'
                    ) as HTMLElement,
                {
                    target: {
                        value: 'testSearch'
                    }
                }
            );
        });
        await waitFor(() => {
            fireEvent.click(
                screen
                    .getAllByRole('button')
                    .find(
                        (elem) =>
                            elem.firstChild?.lastChild?.textContent ===
                            'Add Friend for Group'
                    ) as HTMLElement
            );
        });
        // Wait for axios.put to resolve and update state
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(2);
            expect(axios.get).toHaveBeenCalledTimes(28);
            expect(axios.post).toHaveBeenLastCalledWith(
                `${config.expressHost}/authorized/notifications`,
                {
                    username: 'mockUsername',
                    requestee: 'testuser',
                    groupId: 1
                },
                {
                    headers: {
                        Authorization: auth
                    }
                }
            );

            expect(toastPromise).toHaveBeenCalledTimes(2);
        });
    });
});
