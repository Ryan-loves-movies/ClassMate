import React from 'react';
import Timetable from '@components/dashboard/timetable/Timetable';
import { render, fireEvent, screen } from '@testing-library/react';
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
const localStorageMock = (() => {
    let store = new Map<string, string | number>([
        ['username', 'mockUsername'],
        ['ay', 2023],
        ['sem', 1],
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
jest.spyOn(window, 'alert').mockImplementation(() => {});

jest.mock('axios');
const axios = actAxios as jest.Mocked<typeof actAxios>;

import lesson, { lessonFixedChosen } from '@models/lesson';
import { moduleWithLessonsFixedChosen } from '@models/module';

// Mock your dependencies if needed
jest.mock('axios');
const setOverflowY = jest.fn();

// Sample activities data for testing
const activities: moduleWithLessonsFixedChosen[] = [
    {
        code: 'BT1101',
        name: 'Introduction to Biotechnology',
        lessons: [
            {
                id: 1,
                lessonId: '1',
                moduleCode: 'BT1101',
                lessonType: 'Tutorial[C1]',
                sem: 1,
                weeks: [1, 2, 3, 4, 5, 6, 7],
                venue: 'TUTORIAL ROOM 1',
                day: 'Monday',
                startTime: '0800',
                endTime: '1000',
                size: 30,
                fixed: false,
                chosen: false
            },
            {
                id: 2,
                lessonId: '2',
                moduleCode: 'BT1101',
                lessonType: 'Lecture',
                sem: 1,
                weeks: [1, 3, 5, 7, 9, 11],
                venue: 'LECTURE THEATRE 20',
                day: 'Monday',
                startTime: '1000',
                endTime: '1200',
                size: 200,
                fixed: false,
                chosen: false
            }
        ]
    },
    {
        code: 'CS1010S',
        name: 'Programming Methodology',
        lessons: [
            {
                id: 3,
                lessonId: '1',
                moduleCode: 'CS1010S',
                lessonType: 'Lecture',
                sem: 1,
                weeks: [1, 3, 5, 7, 9, 11],
                venue: 'LECTURE THEATRE 19',
                day: 'Tuesday',
                startTime: '0800',
                endTime: '1000',
                size: 200,
                fixed: false,
                chosen: false
            },
            {
                id: 4,
                lessonId: '2',
                moduleCode: 'CS1010S',
                lessonType: 'Tutorial[T1]',
                sem: 1,
                weeks: [1, 3, 5, 7, 9, 11],
                venue: 'TUTORIAL ROOM 2',
                day: 'Tuesday',
                startTime: '1000',
                endTime: '1200',
                size: 30,
                fixed: false,
                chosen: false
            }
        ]
    }
];

describe('Timetable Component', () => {
    it('should render the timetable with activities', () => {
        const setMods = jest.fn();
        const { getByText } = render(
            <Timetable
                activities={activities}
                setMods={setMods}
                setOverflowY={setOverflowY}
            />
        );

        // Assertions for each lesson within the modules
        expect(getByText('Tutorial[C1] [1]')).toBeInTheDocument();
        expect(getByText('Tutorial[T1] [2]')).toBeInTheDocument();
        expect(getByText('TUTORIAL ROOM 1')).toBeInTheDocument();
        expect(getByText('LECTURE THEATRE 19')).toBeInTheDocument();
    });

    it('should handle click on unchosen activity button correctly', async () => {
        const setMods = jest.fn();
        axios.put.mockResolvedValueOnce({
            status: 200
        });
        axios.put.mockResolvedValueOnce({
            status: 200
        });

        render(
            <Timetable
                activities={activities}
                setMods={setMods}
                setOverflowY={setOverflowY}
            />
        );

        (await screen.findAllByRole('button'))
            .filter(
                (elem) =>
                    elem.nextElementSibling?.nextElementSibling
                        ?.nextElementSibling?.textContent ===
                        'Tutorial[T1] [2]' ||
                    elem.nextElementSibling?.nextElementSibling
                        ?.nextElementSibling?.textContent === 'Tutorial[C1] [1]'
            )
            .map((elem) => {
                fireEvent.click(elem);
            });

        await act(() => Promise.resolve());

        // expect(setMods).toHaveBeenCalledTimes(2);

        // Assertions for setMods function being called correctly with the updated activities
        expect(axios.put).toHaveBeenNthCalledWith(
            1,
            `${expressHost}/authorized/lessons`,
            {
                username: sessionStorage.getItem('username'),
                lessonIds: [1]
            },
            {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                }
            }
        );
        expect(axios.put).toHaveBeenNthCalledWith(
            2,
            `${expressHost}/authorized/lessons`,
            {
                username: sessionStorage.getItem('username'),
                lessonIds: [4]
            },
            {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                }
            }
        );
        expect(setMods).toHaveBeenCalledTimes(2);
        expect(setMods).toHaveBeenNthCalledWith(
            1,
            // Expected activities after clicking BT1101 Lecture
            [
                {
                    code: 'BT1101',
                    name: 'Introduction to Biotechnology',
                    lessons: [
                        {
                            id: 2,
                            lessonId: '2',
                            moduleCode: 'BT1101',
                            lessonType: 'Lecture',
                            sem: 1,
                            weeks: [1, 3, 5, 7, 9, 11],
                            venue: 'LECTURE THEATRE 20',
                            day: 'Monday',
                            startTime: '1000',
                            endTime: '1200',
                            size: 200,
                            fixed: false,
                            chosen: false
                        },
                        {
                            id: 1,
                            lessonId: '1',
                            moduleCode: 'BT1101',
                            lessonType: 'Tutorial[C1]',
                            sem: 1,
                            weeks: [1, 2, 3, 4, 5, 6, 7],
                            venue: 'TUTORIAL ROOM 1',
                            day: 'Monday',
                            startTime: '0800',
                            endTime: '1000',
                            size: 30,
                            fixed: false,
                            chosen: true // Now true
                        }
                    ]
                },
                {
                    code: 'CS1010S',
                    name: 'Programming Methodology',
                    lessons: [
                        {
                            id: 3,
                            lessonId: '1',
                            moduleCode: 'CS1010S',
                            lessonType: 'Lecture',
                            sem: 1,
                            weeks: [1, 3, 5, 7, 9, 11],
                            venue: 'LECTURE THEATRE 19',
                            day: 'Tuesday',
                            startTime: '0800',
                            endTime: '1000',
                            size: 200,
                            fixed: false,
                            chosen: false
                        },
                        {
                            id: 4,
                            lessonId: '2',
                            moduleCode: 'CS1010S',
                            lessonType: 'Tutorial[T1]',
                            sem: 1,
                            weeks: [1, 3, 5, 7, 9, 11],
                            venue: 'TUTORIAL ROOM 2',
                            day: 'Tuesday',
                            startTime: '1000',
                            endTime: '1200',
                            size: 30,
                            fixed: false,
                            chosen: false
                        }
                    ]
                }
            ]
        );
        expect(setMods).toHaveBeenNthCalledWith(
            2,
            // Expected activities after clicking BT1101 Lecture
            [
                {
                    code: 'BT1101',
                    name: 'Introduction to Biotechnology',
                    lessons: [
                        {
                            id: 1,
                            lessonId: '1',
                            moduleCode: 'BT1101',
                            lessonType: 'Tutorial[C1]',
                            sem: 1,
                            weeks: [1, 2, 3, 4, 5, 6, 7],
                            venue: 'TUTORIAL ROOM 1',
                            day: 'Monday',
                            startTime: '0800',
                            endTime: '1000',
                            size: 30,
                            fixed: false,
                            chosen: false
                        },
                        {
                            id: 2,
                            lessonId: '2',
                            moduleCode: 'BT1101',
                            lessonType: 'Lecture',
                            sem: 1,
                            weeks: [1, 3, 5, 7, 9, 11],
                            venue: 'LECTURE THEATRE 20',
                            day: 'Monday',
                            startTime: '1000',
                            endTime: '1200',
                            size: 200,
                            fixed: false,
                            chosen: false
                        }
                    ]
                },
                {
                    code: 'CS1010S',
                    name: 'Programming Methodology',
                    lessons: [
                        {
                            id: 3,
                            lessonId: '1',
                            moduleCode: 'CS1010S',
                            lessonType: 'Lecture',
                            sem: 1,
                            weeks: [1, 3, 5, 7, 9, 11],
                            venue: 'LECTURE THEATRE 19',
                            day: 'Tuesday',
                            startTime: '0800',
                            endTime: '1000',
                            size: 200,
                            fixed: false,
                            chosen: false
                        },
                        {
                            id: 4,
                            lessonId: '2',
                            moduleCode: 'CS1010S',
                            lessonType: 'Tutorial[T1]',
                            sem: 1,
                            weeks: [1, 3, 5, 7, 9, 11],
                            venue: 'TUTORIAL ROOM 2',
                            day: 'Tuesday',
                            startTime: '1000',
                            endTime: '1200',
                            size: 30,
                            fixed: false,
                            chosen: true // Now true
                        }
                    ]
                }
            ]
        );
    });

    it('should handle click on chosen activity button correctly', async () => {
        const setMods = jest.fn();
        axios.get.mockResolvedValue({
            status: 200,
            data: {
                lessons: []
            }
        });

        // Simulate that a lesson is already chosen
        const chosenActivities: moduleWithLessonsFixedChosen[] = [
            {
                code: 'BT1101',
                name: 'Introduction to Biotechnology',
                lessons: [
                    {
                        id: 1,
                        lessonId: '1',
                        moduleCode: 'BT1101',
                        lessonType: 'Tutorial[C1]',
                        sem: 1,
                        weeks: [1, 2, 3, 4, 5, 6, 7],
                        venue: 'TUTORIAL ROOM 1',
                        day: 'Monday',
                        startTime: '0800',
                        endTime: '1000',
                        size: 30,
                        fixed: false,
                        chosen: true // This lesson is already chosen
                    },
                    {
                        id: 2,
                        lessonId: '2',
                        moduleCode: 'BT1101',
                        lessonType: 'Lecture',
                        sem: 1,
                        weeks: [1, 3, 5, 7, 9, 11],
                        venue: 'LECTURE THEATRE 19',
                        day: 'Monday',
                        startTime: '1000',
                        endTime: '1200',
                        size: 200,
                        fixed: false,
                        chosen: false
                    }
                ]
            }
            // Add more moduleWithLessonsFixedChosen objects here for additional modules with chosen lessons
        ];

        render(
            <Timetable
                activities={chosenActivities}
                setMods={setMods}
                setOverflowY={setOverflowY}
            />
        );

        // Mocking click event on a chosen activity button
        fireEvent.click(
            (await screen.findAllByRole('button')).find(
                (elem) =>
                    elem.nextElementSibling?.nextElementSibling
                        ?.nextElementSibling?.textContent === 'Tutorial[C1] [1]'
            ) as Node
        );

        await act(() => Promise.resolve());

        // Assertions for setMods function being called correctly with the updated activities
        expect(setMods).toHaveBeenCalledTimes(1);
        expect(setMods).toHaveBeenNthCalledWith(1, [
            {
                code: 'BT1101',
                lessons: [],
                name: 'Introduction to Biotechnology'
            }
        ]);
        expect(axios.get).toHaveBeenLastCalledWith(
            `${expressHost}/authorized/module/lessons`,
            {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                },
                params: {
                    ay: 2023,
                    semester: 1,
                    username: 'mockUsername',
                    moduleCode: 'BT1101',
                    lessonType: 'Tutorial[C1]'
                }
            }
        );
    });
});
