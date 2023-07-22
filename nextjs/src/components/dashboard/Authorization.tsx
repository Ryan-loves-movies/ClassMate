'use client';
import React from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ReactNode, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@components/Loading';
import config from '@/config';

interface childrenElems {
    children?: ReactNode | ReactNode[];
}
export default function AuthorizationComponent({
    children
}: childrenElems): JSX.Element {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Perform the authentication logic, e.g., send JWT token to the server
    // and validate it
    useLayoutEffect(() => {
        const updateAuthorization = async () => {
            if (!isAuthorized && isLoading) {
                await axios
                    .get(`${config.expressHost}/authorized/user`, {
                        headers: {
                            Authorization:
                                window['sessionStorage'].getItem('token')
                        }
                    })
                    .then((res: AxiosResponse) => {
                        if (res.status === 200) {
                            // Render the children components if the user is authenticated
                            setIsAuthorized(true);
                            setIsLoading(false);
                        } else {
                            router.push('/');
                        }
                    })
                    .catch((err: AxiosError) => {
                        router.push('/');
                        if (err.status === 401) {
                            alert('Token expired, Please sign back in!');
                        } else {
                            alert('Something went wrong! Please sign back in!');
                        }
                    });
            }
        };
        updateAuthorization();
    });
    if (isLoading) {
        return <Loading />;
    }
    if (isAuthorized) {
        return <>{children}</>;
    } else {
        return (
            <div>
                <h1>You are an unauthorized user!</h1>
            </div>
        );
    }
}
