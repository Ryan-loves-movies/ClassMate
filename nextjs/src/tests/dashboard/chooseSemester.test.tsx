import ChooseSemester from '@components/dashboard/layout/ChooseSemester';

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';


// Mock sessionStorage.setItem
const setItemMock = jest.fn();
const getItemMock = jest.fn();
jest.mock('next/navigation', () => ({
    usePathName: () => '/timetable',
}));
Object.defineProperty(window, 'sessionStorage', {
    value: {
        setItem: setItemMock,
        getItem: getItemMock,
    },
    writable: true,
});


test('renders semester information correctly', () => {
    render(<ChooseSemester />);

    const ayText = screen.getByText(/AY 2023\/2024/i);
    const semText = screen.getByText(/Semester 1/i);

    expect(ayText).toBeInTheDocument();
    expect(semText).toBeInTheDocument();
});


// test('clicking left arrow changes semester', () => {
//     const component = render(<ChooseSemester />);

//     const leftArrowButton = component.getByTestId('left-arrow-button');
//     fireEvent.click(leftArrowButton);

//     // Check if setAy and setSem are called with the correct arguments
//     //expect(setItemMock).toHaveBeenCalledTimes(2);
//     expect(setItemMock).toHaveBeenCalledWith('ay', '2023');
//     expect(setItemMock).toHaveBeenCalledWith('sem', '2');
//   });

test('clicking right arrow changes semester', () => {
    const component = render(<ChooseSemester />);

    const rightArrowButton = component.getByTestId('right-arrow-button');
    fireEvent.click(rightArrowButton);

    // Check if setAy and setSem are called with the correct arguments
    //expect(setItemMock).toHaveBeenCalledTimes(2);
    expect(setItemMock).toHaveBeenCalledWith('ay', '2023');
    expect(setItemMock).toHaveBeenCalledWith('sem', '2');
});