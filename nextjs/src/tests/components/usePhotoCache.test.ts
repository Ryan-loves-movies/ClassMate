import { renderHook } from '@testing-library/react';
import { usePhotoCache } from '@components/dashboard/photoCache';

describe('usePhotoCache', () => {
    it('returns the correct base64 image URL for a given arrBuffer', () => {
        const arrBuffer = [1, 2, 3];
        const { result } = renderHook(() => usePhotoCache(arrBuffer));

        const expectedBase64URL = 'data:image/*;base64,AQID';
        expect(result.current).toBe(expectedBase64URL);
    });

    it('caches and returns the previously fetched image URL for the same arrBuffer', () => {
        const arrBuffer = [1, 2, 3];
        const { result, rerender } = renderHook(() => usePhotoCache(arrBuffer));

        const firstResult = result.current;

        // Re-render with the same arrBuffer, expect the same result as before
        rerender();
        expect(result.current).toBe(firstResult);
    });

    it('fetches the image again for a different arrBuffer', () => {
        const arrBuffer1 = [1, 2, 3];
        const arrBuffer2 = [4, 5, 6];
        const hook = renderHook((props) => usePhotoCache(props), {
            initialProps: arrBuffer1
        });

        const hook2 = renderHook((props) => usePhotoCache(props), {
            initialProps: arrBuffer2
        });

        // Re-render with a different arrBuffer, expect a different result
        expect(hook2.result.current).not.toBe(hook.result.current);
    });

    // Test edge cases or error scenarios if any
    // For example, if the arrBuffer is empty or null, how does the hook behave?
    // Add specific tests to handle such scenarios.
});
