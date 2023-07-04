import { useState } from 'react';

class CustomMap {
    private data: [number[], string][];
    private compareFn: (arr1: number[], arr2: number[]) => boolean;

    constructor(compareFn: (arr1: number[], arr2: number[]) => boolean) {
        this.data = [];
        this.compareFn = compareFn;
    }

    has(key: number[]) {
        return this.data.some(([existingKey]) =>
            this.compareFn(existingKey, key)
        );
    }

    get(key: number[]) {
        const foundPair = this.data.find(([existingKey]) =>
            this.compareFn(existingKey, key)
        );
        return foundPair ? foundPair[1] : undefined;
    }

    set(key: number[], value: string) {
        const existingPairIndex = this.data.findIndex(([existingKey]) =>
            this.compareFn(existingKey, key)
        );
        if (existingPairIndex !== -1) {
            this.data[existingPairIndex][1] = value;
        } else {
            this.data.push([key, value]);
        }
    }
}

// Example usage
const cache = new CustomMap((a, b) => {
    if (a === b) return true; // If the arrays are the same reference, they are equal
    if (a.length !== b.length) return false; // If the lengths are different, they are not equal

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false; // If any element is different, they are not equal
    }

    return true; // If no differences found, arrays are equal
});

export function usePhotoCache(arrBuffer: number[]): string {
    const [photoBase64] = useState<string>(() => {
        console.time('bufferToBase64');

        const cacheAns = cache.get(arrBuffer);
        if (cacheAns) {
            console.timeEnd('bufferToBase64');
            return cacheAns;
        }
        const ans = `data:image/*;base64,${btoa(
            arrBuffer.reduce(
                (data: string, byte: number) =>
                    data + String.fromCharCode(byte),
                ''
            )
        )}`;
        cache.set(arrBuffer, ans);
        console.timeEnd('bufferToBase64');
        return ans;
    });

    return photoBase64;
}
