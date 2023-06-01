'use client'
import axios, { AxiosResponse } from 'axios';
import config from '@/config';
import { useState, useEffect, ReactElement } from 'react';

interface childrenElems {
    children?: ReactElement | ReactElement[];
}
export default function AuthenticationComponent({ children }: childrenElems): ReactElement {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const authenticateUser = () => {
        try {
            // Perform the authentication logic, e.g., send JWT token to the server
            // and validate it
            axios.get(`${config.expressHost}/authenticate`, {
                headers: {
                    Authorization: sessionStorage.getItem("token")
                }
            })
                .then((res: AxiosResponse) => {
                    if (res.status === 200) {
                        // If the authentication is successful, set isAuthenticated to true
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                        window.location.href = '/';
                        console.log('Authorization error', res.statusText);
                    }
                });
        } catch (error) {
            console.error('Axios authentication error:', error);
        }
    };

    authenticateUser();

    // Render the children components if the user is authenticated
    return <>{children}</>;
};
