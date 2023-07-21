import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '@components/dashboard/layout/Sidebar';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar Component', () => {
  test('renders the correct links and applies the "active" class to the appropriate link', () => {
    // Mock the useRouter hook with the desired pathName
    (useRouter as jest.Mock).mockReturnValue({ pathname: '/dashboard' });

    render(<Sidebar />);

    // Check if the links are rendered correctly
    const homeLink = screen.getByText('Home');
    const timetableLink = screen.getByText('Timetable');
    const settingsLink = screen.getByText('Settings');

    expect(homeLink).toBeInTheDocument();
    expect(timetableLink).toBeInTheDocument();
    expect(settingsLink).toBeInTheDocument();

    // Check if the "active" class is applied to the appropriate link
    expect(homeLink).toHaveClass('active');
    expect(timetableLink).not.toHaveClass('active');
    expect(settingsLink).not.toHaveClass('active');
  });

  test('applies the "active" class to the "Timetable" link for "/timetable" pathName', () => {
    // Mock the useRouter hook with the desired pathName
    (useRouter as jest.Mock).mockReturnValue({ pathname: '/timetable' });

    render(<Sidebar />);

    // Check if the "active" class is applied to the "Timetable" link
    const timetableLink = screen.getByText('Timetable');
    expect(timetableLink).toHaveClass('active');
  });
});
