import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TimetableMain from '@app/(dashboard)/timetable/page';
import actAxios from 'axios';
import config from '@/config';

// Mock axios.put and axios.get to simulate successful and unsuccessful requests
jest.mock('axios');
const axios = actAxios as jest.Mocked<typeof actAxios>;
axios.put.mockImplementation((url, data, config) => {
    // Simulate successful response
    if (url.includes('/authorized/module')) {
        return Promise.resolve({ data: {} });
    } else {
        // Simulate unsuccessful response
        return Promise.reject(
            new Error('Oops! Something went wrong when adding that mod!')
        );
    }
});
axios.get.mockImplementation((url, config) => {
    // Simulate successful response
    if (url.includes('/authorized/lessons')) {
        return Promise.resolve({ status: 200, data: { modules: [] } });
    } else if (url.includes('/authorized/search/modules')) {
        return Promise.resolve({
            data: {
                modules: [
                    {
                        code: 'CS1010',
                        name: 'test name'
                    }
                ]
            }
        });
    } else {
        // Simulate unsuccessful response
        return Promise.reject(
            new Error(
                'Sorry! A problem occurred! Your mods could not be found in the database.'
            )
        );
    }
});

// Mock the sessionStorage for the tests
const localStorageMock = (() => {
    let store = new Map<string, string | number>([
        ['username', 'mockUsername'],
        ['ay', '2023'],
        ['sem', '1'],
        ['token', 'mockToken']
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

// Mock alert
const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('TimetableMain component', () => {
    it('can handle adding a module', async () => {
        render(<TimetableMain />);

        await waitFor(() => {
            const searchBarInput = screen.getByPlaceholderText('Add module');

            fireEvent.change(searchBarInput, {
                target: { value: 'CS1010' }
            });
        });

        await waitFor(() => {
            const searchResultItem = screen
                .getAllByRole('listitem')
                .find(
                    (elem) =>
                        elem.firstChild?.textContent === 'CS1010' &&
                        elem.lastChild?.textContent === 'test name'
                ) as HTMLElement;

            fireEvent.mouseDown(searchResultItem);
        });

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledTimes(1);
            expect(axios.put).toHaveBeenLastCalledWith(
                `${config.expressHost}/authorized/module`,
                {
                    username: 'mockUsername',
                    moduleCode: 'CS1010',
                    lessons: [],
                    ay: '2023',
                    semester: '1'
                },
                {
                    headers: {
                        Authorization: 'mockToken'
                    }
                }
            );
        });
    });

    it('shows an alert for an error when adding a module', async () => {
        render(<TimetableMain />);

        await waitFor(() => {
            const searchBarInput = screen.getByPlaceholderText('Add module');

            fireEvent.change(searchBarInput, {
                target: { value: 'CS1010' }
            });
        });

        await waitFor(() => {
            const searchResultItem = screen
                .getAllByRole('listitem')
                .find(
                    (elem) =>
                        elem.firstChild?.textContent === 'CS1010' &&
                        elem.lastChild?.textContent === 'test name'
                ) as HTMLElement;

            // Mock a rejected response
            axios.put.mockRejectedValueOnce('Oops! Something went wrong!');

            fireEvent.mouseDown(searchResultItem);
        });

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledTimes(2);
            expect(axios.put).toHaveBeenLastCalledWith(
                `${config.expressHost}/authorized/module`,
                {
                    username: 'mockUsername',
                    moduleCode: 'CS1010',
                    lessons: [],
                    ay: '2023',
                    semester: '1'
                },
                {
                    headers: {
                        Authorization: 'mockToken'
                    }
                }
            );
        });

        expect(alertSpy).toHaveBeenCalledWith(
            'Oops! Something went wrong when adding that mod! Error: Oops! Something went wrong!'
        );
    });
});
