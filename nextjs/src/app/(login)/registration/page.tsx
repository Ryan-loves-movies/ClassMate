'use client'
import React from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { FieldValues, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import { regEmail, regPassword, regUsername } from "@app/(login)/validation";
import LoginField from "@/components/LoginField";
import Error from "@/components/Error";
import config from '@/config';

export default function Home() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleReg = async (data: FieldValues) => {
        const { email, username, password } = data;
        return axios.post(`${config.expressHost}/register`, {
            email: email,
            username: username,
            password: password
        })
            .then((res: AxiosResponse) => {
                if (res.status === 201) {
                    // should show pop-up window for a few seconds that redirect to login page
                    window.location.href = '/';
                } else {
                    alert("User already exists!");
                }
            })
            .catch((err: AxiosError) => {
                console.error(err)
            });
    }

    return (
        <main>
            <div className="flex-col flex ml-auto mr-auto items-center w-full lg:w-2/3 md:w-3/5 top">
                <h1 className="font-bold text-10xl my-10 text-white"> Sign up! </h1>
                <form name="register" action="localhost:8000/users" method="POST" onSubmit={handleSubmit(handleReg)} className="mt-2 flex flex-col lg:w-1/2 w-8/12">
                    <LoginField leftIcon="bi bi-envelope" rightIcon="">
                        <input
                            type='text'
                            className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border-0 h-10 px-3 relative self-center font-roboto text-xl outline-none"
                            placeholder='Email'
                            // name input is specified in register block
                            {...register('email', {
                                required: { value: true, message: `Email required` },
                                pattern: { value: regEmail, message: 'Invalid email' },
                            })}
                        />
                        <div>{errors.email && <Error message={errors.email.message as string} />}</div>
                    </LoginField>
                    <LoginField leftIcon="bi bi-person-circle" rightIcon="">
                        <input
                            type='text'
                            className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border-0 h-10 px-3 relative self-center font-roboto text-xl outline-none"
                            placeholder='Username'
                            // name input is specified in register block
                            {...register('username', {
                                required: { value: true, message: `Username required` },
                                pattern: { value: regUsername, message: 'Invalid username' },
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
                                required: { value: true, message: `Password required` },
                                pattern: { value: regPassword, message: 'Invalid password' },
                            })}
                        />
                        <div>{errors.password && <Error message={errors.password.message as string} />}</div>
                    </LoginField>
                    <LoginField leftIcon="bi bi-key" rightIcon="bi bi-eye-slash-fill">
                        <input
                            type='password'
                            className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border-0 h-10 px-3 relative self-center font-roboto text-xl outline-none"
                            placeholder='Confirm Password'
                            // name input is specified in register block
                            {...register('confirmPassword', {
                                required: { value: true, message: `Confirmation required` },
                                pattern: { value: regPassword, message: 'Invalid password' },
                            })}
                        />
                        <div>{errors.confirmPassword && <Error message={errors.confirmPassword.message as string} />}</div>
                    </LoginField>
                    <input
                        type="submit"
                        className="bg-blue-400 py-4 text-center px-17 md:px-12 md:py-4 text-white rounded leading-tight text-xl md:text-base font-sans mt-4 mb-20"
                        value="Register"
                    />
                </form>
            </div>
        </main>
    );
}
