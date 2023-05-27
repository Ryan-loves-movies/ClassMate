import axios, { AxiosResponse } from 'axios';
import { useState, useEffect, ReactElement } from 'react';

export default function AuthenticationComponent({ children }: { children: ReactElement }): ReactElement {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                // Perform the authentication logic, e.g., send JWT token to the server
                // and validate it
                axios.get("http://localhost:8000/authenticate", {
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
                            window.location.href = 'http://localhost:3000/login';
                            console.error('Authorization error', res.statusText);
                        }
                    });
            } catch (error) {
                console.error('Authentication error:', error);
            }
        };

        authenticateUser();
    }, []);

    if (!isAuthenticated) {
        // Render a loading state or a component for unauthorized access
        return (
            <div>
                <h1>You are an unauthorised user!</h1>
            </div>
        );
    }

    // Render the children components if the user is authenticated
    return children;
};
