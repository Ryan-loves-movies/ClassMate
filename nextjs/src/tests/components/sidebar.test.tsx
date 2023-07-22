import React from 'react';
import {
    render,
    screen
} from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '@components/dashboard/layout/Sidebar';

const pathname = jest.fn();
jest.mock('next/navigation', () => ({
    usePathname: () => {
        return {
            includes: pathname
        };
    }
}));

describe('Sidebar Component', () => {
    test('renders the correct links and applies the "active" class to the appropriate link', () => {
        pathname.mockReturnValueOnce(true);
        pathname.mockReturnValueOnce(false);
        pathname.mockReturnValueOnce(false);
        render(<Sidebar />);

        expect(pathname).toHaveBeenCalledTimes(3)
        // Check if the links are rendered correctly
        screen.getAllByRole('link').map((elem) => {
            if (elem.lastChild?.textContent === 'Home') {
                return expect(elem).toHaveClass('active');
            }
            expect(elem).not.toHaveClass('active');
        });
    });

    test('applies the "active" class to the "Timetable" link for "/timetable" pathName', () => {
        pathname.mockReturnValueOnce(false);
        pathname.mockReturnValueOnce(true);
        pathname.mockReturnValueOnce(false);

        render(<Sidebar />);

        expect(pathname).toHaveBeenCalledTimes(6)
        // Check if the links are rendered correctly
        screen.getAllByRole('link').map((elem) => {
            if (elem.lastChild?.textContent === 'Timetable') {
                return expect(elem).toHaveClass('active');
            }
            expect(elem).not.toHaveClass('active');
        });
    });
});
