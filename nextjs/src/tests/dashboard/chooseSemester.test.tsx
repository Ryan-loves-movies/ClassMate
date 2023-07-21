import React from 'react';
import { render } from '@testing-library/react';
import ChooseSemester from '@components/dashboard/layout/ChooseSemester';
import '@testing-library/jest-dom';

// beforeEach(function() {
//     global.sessionStorage = jest.genMockFunction();
//     global.sessionStorage.setItem = jest.genMockFunction();
//     global.sessionStorage.getItem = jest.genMockFunction();
// }

test('renders status bar with correct descriptor', () => {
    const color = '#404040';
    const height = '20px';
    const descriptor = 'Test Descriptor';

    const { getByText } = render(<ChooseSemester />);

    const descriptorElement = getByText(descriptor);
    expect(descriptorElement).toBeInTheDocument();
});

test('calculates the width correctly based on the descriptor length', () => {
    const color = '#404040';
    const height = '20px';
    const descriptor = 'Test Descriptor sdjknjdnkadnsnkjnasfnn';

    const { container } = render(<ChooseSemester />);

    const wrapperElement = container.firstChild;
    const backgroundElement = container.firstChild?.firstChild;

    // Check if the width is dynamically calculated based on the descriptor length
    expect(wrapperElement).toHaveStyle({ width: '47px' }); // Expected width: (descriptor length + 25)px + 5px for padding
    expect(backgroundElement).toHaveStyle({ width: '42px' }); // Expected width: descriptor length + 5px for padding
});
