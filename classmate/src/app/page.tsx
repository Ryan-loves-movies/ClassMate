import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import LoginField from '@/components/LoginField';
import jwt from 'jsonwebtoken';

export default function Home() {
    
   const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = (event: React.MouseEvent<HTMLInputElement>) => {
        if (event.target) {
            const username = (event.target as HTMLFormElement).username;
            const password = (event.target as HTMLFormElement).password;
        
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        };

        fetch("http://localhost:8000/auth/login", requestOptions)
        .then((response) => {
            if (response.status === 200) {
                // ?? is the nullish coalescing operator
                // ?? will return value of Authorization header if not null, and return empty string if null or undefined 
                const token = response.headers.get("Authorization") ?? "";
                localStorage.setItem("token", token);
            } else {
                alert("Invalid username or password");
            }
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const Login = () => {
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        return (
            <main>
                <img src="/timetable.jpg" className="background" />
                <img src="/nusmods.png" className="flex-col flex ml-auto mr-auto items-center top" />
                <div className="flex-col flex ml-auto mr-auto items-center w-full lg:w-2/3 md:w-3/5 top">
                    <h1 className="font-bold text-10xl my-10 text-white"> Login </h1>
                    <form action="localhost:8000/users" className="mt-2 flex flex-col lg:w-1/2 w-8/12"> *
    
                        <LoginField type="text" placeholder="Username" name="username" leftIcon="bi bi-person-circle" rightIcon="" />
                        <LoginField type="password" placeholder="Password" name="password" leftIcon="bi bi-key" rightIcon="bi bi-eye-slash-fill" />
                        <div className="flex flex-wrap justify-between">
                            <a href="registration" className="text-base text-white text-left font-roboto leading-normal hover:underline mb-6">Register</a>
                            <a href="#" className="text-base text-white text-right font-roboto leading-normal hover:underline mb-6 self-end">Forget Password?</a>
                        </div>
                        <input
                            type="submit"
                            className="bg-blue-400 py-4 text-center px-17 md:px-12 md:py-4 text-white rounded leading-tight text-xl md:text-base font-sans mt-4 mb-20"
                            value="Login"
                            onClick={handleLogin}
                        />
                    </form>
                </div>
            </main>
        );
    } 
    }
}