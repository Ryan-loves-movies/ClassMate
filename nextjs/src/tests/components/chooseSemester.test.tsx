import ChooseSemester from '@components/dashboard/layout/ChooseSemester';

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const pathname = jest.fn();
jest.mock('next/navigation', () => ({
    usePathname: () => {
        return {
            includes: pathname
        };
    }
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
describe('ChooseSemester() component', () => {
    it('renders semester information correctly', () => {
        render(<ChooseSemester />);

        const ayText = screen.getByText(/AY 2023\/2024/i);
        const semText = screen.getByText(/Semester 1/i);

        expect(ayText).toBeInTheDocument();
        expect(semText).toBeInTheDocument();
    });

    it('clicking left arrow changes semester', () => {
        // Mock return values for 2023/2023 semester 2
        getItemMock.mockReturnValueOnce(2023);
        getItemMock.mockReturnValueOnce(2);
        const component = render(<ChooseSemester />);

        // On first render, sessionStorage.getItem() is called twice, 2+2
        expect(getItemMock).toHaveBeenCalledTimes(4);
        expect(setItemMock).toHaveBeenCalledTimes(1);
        expect(setItemMock).toHaveBeenNthCalledWith(1, 'sem', '2');

        const leftArrowButton = component.getByTestId('left-arrow-button');
        fireEvent.click(leftArrowButton);

        // Component is not re-rendered - so getItem is not called again
        expect(getItemMock).toHaveBeenCalledTimes(4);
        expect(setItemMock).toHaveBeenCalledTimes(2);
        expect(setItemMock).toHaveBeenNthCalledWith(2, 'sem', '1');
    });

    it('clicking right arrow changes semester', () => {
        // Mock return values for 2023/2023 semester 2
        getItemMock.mockReturnValueOnce(2023);
        getItemMock.mockReturnValueOnce(1);
        const component = render(<ChooseSemester />);
        // On first render, sessionStorage.getItem() is called twice 4+2
        expect(getItemMock).toHaveBeenCalledTimes(6);
        expect(setItemMock).toHaveBeenCalledTimes(2);

        const rightArrowButton = component.getByTestId('right-arrow-button');
        fireEvent.click(rightArrowButton);

        // Check if setAy and setSem are called with the correct arguments
        expect(setItemMock).toHaveBeenCalledTimes(3);
        expect(setItemMock).toHaveBeenNthCalledWith(3, 'sem', '2');
    });
});
