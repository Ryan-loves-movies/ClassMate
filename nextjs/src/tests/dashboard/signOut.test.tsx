import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignOut from '@components/dashboard/layout/SignOut';
import { useRouter } from 'next/router';
import React from 'react';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SignOut Component', () => {
  test('redirects to root URL after clicking the "Sign out" link', () => {
    // Mock the useRouter hook
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    const { getByText } = render(<SignOut />);

    const signOutLink = getByText('Sign out');
    fireEvent.click(signOutLink);

    expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});

// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import SignOut from '@components/dashboard/layout/SignOut';

// // Mock the next/router module
// jest.mock('next/router', () => ({
//   useRouter: () => ({
//     push: jest.fn(),
//   }),
// }));

// describe('SignOut Component', () => {
//   test('calls handleLogout and redirects to root URL when "Sign out" link is clicked', () => {
//     // Mock the sessionStorage
//     const sessionStorageMock: { [key: string]: string } = {};

//     jest.spyOn(window.sessionStorage, 'getItem').mockImplementation((key) => sessionStorageMock[key] || null);
//     jest.spyOn(window.sessionStorage, 'setItem').mockImplementation((key, value) => {
//       sessionStorageMock[key] = value;
//     });
//     jest.spyOn(window.sessionStorage, 'removeItem').mockImplementation((key) => {
//       delete sessionStorageMock[key];
//     });
//     jest.spyOn(window.sessionStorage, 'clear').mockImplementation(() => {
//       for (const key in sessionStorageMock) {
//         delete sessionStorageMock[key];
//       }
//     });

//     // Mock the useRouter hook
//     const pushMock = jest.fn();
//     jest.mock('next/router', () => ({
//       useRouter: () => ({
//         push: pushMock,
//       }),
//     }));

//     // Render the component
//     const { getByText } = render(<SignOut />);

//     // Click the "Sign out" link
//     const signOutLink = getByText('Sign out');
//     fireEvent.click(signOutLink);

//     // Check if sessionStorage.removeItem was called with the correct key
//     expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('token');

//     // Check if router.push was called with the correct URL
//     expect(window.location.href).toBe('/');
//   });
// });


// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import SignOut from '@components/dashboard/layout/SignOut';

// // Mock the next/router module
// jest.mock('next/router', () => ({
//   useRouter: () => ({
//     push: jest.fn(),
//   }),
// }));

// describe('SignOut Component', () => {
//   test('calls handleLogout and redirects to root URL when "Sign out" link is clicked', () => {
//     // Mock the sessionStorage
//     const sessionStorageMock: { [key: string]: string } = {};

//     // Mock sessionStorage methods
//     const mockGetItem = (key: string) => sessionStorageMock[key] || null;
//     const mockSetItem = (key: string, value: string) => {
//       sessionStorageMock[key] = value;
//     };
//     const mockRemoveItem = (key: string) => {
//       delete sessionStorageMock[key];
//     };
//     const mockClear = () => {
//       for (const key in sessionStorageMock) {
//         delete sessionStorageMock[key];
//       }
//     };

//     // Assign mock implementations to the sessionStorage object
//     Object.defineProperty(window, 'sessionStorage', {
//       value: {
//         getItem: mockGetItem,
//         setItem: mockSetItem,
//         removeItem: mockRemoveItem,
//         clear: mockClear,
//       },
//       writable: true,
//     });

//     // Render the component inside the custom wrapper
//     const { getByText } = render(<SignOut />);

//     // Click the "Sign out" link
//     const signOutLink = getByText('Sign out');
//     fireEvent.click(signOutLink);

//     // Check if sessionStorage.removeItem was called with the correct key
//     expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('token');

//     // Check if router.push was called with the correct URL
//     expect(require('next/router').useRouter().push).toHaveBeenCalledWith('/');
//   });
// });
