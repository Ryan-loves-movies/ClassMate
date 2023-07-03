import React from 'react';

export default function LocalError({ message }: { message: string }) {
    return (
        <div className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">
            {message}
        </div>
    );
}
