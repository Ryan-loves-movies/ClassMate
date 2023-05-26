'use client'
import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import { document } from "postcss";
import LoginField from "@/components/LoginField";

export default function Home() {
    const register = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    //     const { username, password, confirmPassword, email } = document.forms["register"];
    //     const regUsername = /^[a-z][^\W_]{7,14}$/i;
    //     const regPassword = /^(?=[^a-z]*[a-z])(?=\D*\d)[^:&.~\s]{5,20}$/;
    //     const regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    //     if (!(
    //         regUsername.test(username) &&
    //         regPassword.test(password) && 
    //         regEmail.test(email) &&
    //         password === confirmPassword)) {
    //         alert("Problems!");
    //         return false;
    //     }
        return true;
    }
    return (
        <main>
            <img src="/timetable.jpg" className="background" />
            <img src="/nusmods.png" className="flex-col flex ml-auto mr-auto items-center top" />
            <div className="flex-col flex ml-auto mr-auto items-center w-full lg:w-2/3 md:w-3/5 top">
                <h1 className="font-bold text-10xl my-10 text-white"> Sign up! </h1>
                <form name="register" action="localhost:8000/users" method="POST" onSubmit={register} className="mt-2 flex flex-col lg:w-1/2 w-8/12">
                    <LoginField type="text" placeholder="Email" name="email" leftIcon="bi bi-envelope" rightIcon="" />
                    <LoginField type="text" placeholder="Username" name="username" leftIcon="bi bi-person-circle" rightIcon="" />
                    <LoginField type="password" placeholder="Password" name="password" leftIcon="bi bi-key" rightIcon="bi bi-eye-slash-fill" />
                    <LoginField type="password" placeholder="Confirm Password" name="confirmPassword" leftIcon="bi bi-key" rightIcon="bi bi-eye-slash-fill" />
                    <input
                        type="submit"
                        className="bg-blue-400 py-4 text-center px-17 md:px-12 md:py-4 text-white rounded leading-tight text-xl md:text-base font-sans mt-4 mb-20"
                        value="Register"
                    / >
                </form>
            </div>
        </main>
    );
}
