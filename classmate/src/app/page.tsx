'use client'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import LoginField from '@/components/LoginField';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { regPassword, regUsername } from '@/utils/validation';
import { useForm } from 'react-hook-form';
import Error from '@/components/Error';

export default function Home() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleLogin = (event: React.MouseEvent<HTMLInputElement>) => {
        if (event.target) {
            const username = (event.target as HTMLFormElement).username;
            const password = (event.target as HTMLFormElement).password;

            return axios.post("http://localhost:8000/login", {
                username: username,
                password: password
            })
                .then((res: AxiosResponse) => {
                    if (res.status === 200) {
                        sessionStorage.setItem("token", res.data.get("token"));
                        window.location.href = '/authorized/dashboard';
                    } else {
                        alert("Invalid username or password");
                    }
                })
                .catch((err: AxiosError) => {

                    console.error(err)
                });
        };
    };

    const handleReg = (data: Object) => console.log(data);

    return (
        <main>
            <img src="/timetable.jpg" className="background" />
            <img src="/nusmods.png" className="flex-col flex ml-auto mr-auto items-center top" />
            <div className="flex-col flex ml-auto mr-auto items-center w-full lg:w-2/3 md:w-3/5 top">
                <h1 className="font-bold text-10xl my-10 text-white"> Login </h1>
                <form action="localhost:8000/users" className="mt-2 flex flex-col lg:w-1/2 w-8/12" onSubmit={handleSubmit(handleReg)}>
                    <LoginField leftIcon="bi bi-person-circle" rightIcon="">
                        <input
                            type='text'
                            className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border-0 h-10 px-3 relative self-center font-roboto text-xl outline-none"
                            placeholder='Username'
                            // name input is specified in register block
                            {...register('username', {
                                required: { value: true, message: `$(name) Required` },
                                pattern: { value: regUsername, message: 'Invalid $(name)' },
                            })}
                        />
                        <div>{errors.username && <Error message={errors.username.message as string} />}</div>
                    </LoginField>
                    <LoginField leftIcon="bi bi-key" rightIcon="bi bi-eye-slash-fill">
                        <input
                            type='password'
                            className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border-0 h-10 px-3 relative self-center font-roboto text-xl outline-none"
                            placeholder='Password'
                            // name input is specified in register block
                            {...register('password', {
                                required: { value: true, message: `$(name) Required` },
                                pattern: { value: regPassword, message: 'Invalid $(name)' },
                            })}
                        />
                        <div>{errors.password && <Error message={errors.password.message as string} />}</div>
                    </LoginField>
                    <div className="flex flex-wrap justify-between">
                        <a href="registration" className="text-base text-white text-left font-roboto leading-normal hover:underline mb-6">Register</a>
                        <a href="#" className="text-base text-white text-right font-roboto leading-normal hover:underline mb-6 self-end">Forgot Password?</a>
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
