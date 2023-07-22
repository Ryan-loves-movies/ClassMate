import React from 'react';
import PhotoRenderer from '@components/dashboard/PhotoRenderer';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the usePhotoCache hook
const usePhotoMock = jest.fn();
jest.mock('@components/dashboard/photoCache', () => ({
    usePhotoCache: (args: number[]) => usePhotoMock(args)
}));

describe('PhotoRenderer', () => {
    it('renders the photo with correct alt text', () => {
        // Mock usePhotoCache to return the base64 image URL
        const base64ImageURL =
            'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD';
        usePhotoMock.mockReturnValueOnce(base64ImageURL);
        const arrBuffer = [1, 2, 3];
        const altText = 'Test Photo';

        const { getByAltText } = render(
            <PhotoRenderer arrBuffer={arrBuffer} alt={altText} />
        );

        // Expect the photo to be rendered with the correct alt text
        expect(getByAltText(altText)).toBeInTheDocument();
        expect(getByAltText(altText).getAttribute('src')).toBe(base64ImageURL);
        expect(usePhotoMock).toHaveBeenCalledWith(arrBuffer);
    });
});
