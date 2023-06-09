'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { regPassword, regUsername, regEmail } from '@app/(login)/validation';
import LocalError from "@components/login/LocalError";
import config from '@/config';

export default function Home() {
    const router = useRouter();
    const [bounceDir, setBounceDir] = useState(0);
    const signUpHandler = () => setBounceDir(1);
    const logInHandler = () => setBounceDir(0);

    // Form for registration and login
    const {
        register: registerLogIn,
        handleSubmit: handleLogInSubmit,
        formState: { errors: errorsLogIn }
    } = useForm();
    const {
        register: registerRegistration,
        handleSubmit: handleRegistrationSubmit,
        formState: { errors: errorsRegistration }
    } = useForm();

    const handleLogIn = async (data: FieldValues) => {
        const {
            'usernameLogIn': username,
            'passwordLogIn': password
        } = data;
        return await axios.post(`${config.expressHost}/login`, {
            username: username,
            password: password
        })
            .then((res: AxiosResponse) => {
                if (res.status === 200) {
                    window['sessionStorage'].setItem("token", res.data.token);
                    window['sessionStorage'].setItem("username", username);
                    router.push("/dashboard");
                    // I BELIEVE THE BELOW ELSE CLAUSE IS NOT REQUIRED - Should not enter that clause based on how the api is currently set up
                } else {
                    alert("Invalid username or password");
                }
            })
            .catch((err: AxiosError) => {
                if (err.response?.status === 404) {
                    alert("Username could not be found. Have you signed up yet?")
                } else if (err.response?.status === 401) {
                    alert("Wrong password!")
                } else {
                    alert("Wrong username or password!")
                }
                console.error(err)
            });
    }

    const handleRegistration = async (data: FieldValues) => {
        const {
            'emailRegistration': email,
            'usernameRegistration': username,
            'passwordRegistration': password
        } = data;
        return axios.post(`${config.expressHost}/register`, {
            email: email,
            username: username,
            password: password
        })
            .then((res: AxiosResponse) => {
                if (res.status === 201) {
                    // should show pop-up window for a few seconds that redirect to login page
                    setBounceDir(0);
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
            <div className='float-end'>
                <img src="/logoWhiteWithCaptions.png" className="logo flex-col flex ml-auto mr-auto top" alt="Logo" />
            </div>
            <section className="user">
                <div className="user_options-container">
                    <div className="user_options-text">
                        <div className="user_options-unregistered">
                            <h2 className="user_unregistered-title">{`Don't have an account?`}</h2>
                            <p className="user_unregistered-text">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap.</p>
                            <button className="user_unregistered-signup" id="signup-button" onClick={signUpHandler} type="button">Sign up</button>
                        </div>

                        <div className="user_options-registered">
                            <h2 className="user_registered-title">Have an account?</h2>
                            <p className="user_registered-text">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap.</p>
                            <button className="user_registered-login" id="login-button" onClick={logInHandler} type="button">Login</button>
                        </div>
                    </div>

                    <div className={`user_options-forms ${(bounceDir ? 'bounceLeft' : 'bounceRight')}`} id="user_options-forms">
                        <div className="user_forms-login">
                            <h2 className="forms_title">Login</h2>
                            <form className="forms_form" onSubmit={handleLogInSubmit(handleLogIn)}>
                                <fieldset className="forms_fieldset">
                                    <div className="forms_field">
                                        <input
                                            type="text"
                                            className="forms_field-input"
                                            placeholder="Username"
                                            {...registerLogIn('usernameLogIn', {
                                                required: { value: true, message: "Username required" },
                                                pattern: { value: regUsername, message: "Invalid username" },
                                            })
                                            }
                                        />
                                        <div>{errorsLogIn.usernameLogIn && <LocalError message={errorsLogIn.usernameLogIn.message as string} />}</div>
                                    </div>
                                    <div className="forms_field">
                                        <input
                                            type="password"
                                            className="forms_field-input"
                                            placeholder="Password"
                                            {...registerLogIn('passwordLogIn', {
                                                required: { value: true, message: "Password required" },
                                                pattern: { value: regPassword, message: "Invalid password" },
                                            })
                                            }
                                        />
                                        <div>{errorsLogIn.passwordLogIn && <LocalError message={errorsLogIn.passwordLogIn.message as string} />}</div>
                                    </div>
                                </fieldset>
                                <div className="forms_buttons">
                                    <button type="button" className="forms_buttons-forgot">Forgot password?</button>
                                    <input type="submit" value="Log In" className="forms_buttons-action" />
                                </div>
                            </form>
                        </div>
                        <div className="user_forms-signup">
                            <h2 className="forms_title">Sign Up</h2>
                            <form className="forms_form" onSubmit={handleRegistrationSubmit(handleRegistration)}>
                                <fieldset className="forms_fieldset">
                                    <div className="forms_field">
                                        <input
                                            type="email"
                                            className="forms_field-input"
                                            placeholder="Email"
                                            {...registerRegistration('emailRegistration', {
                                                required: { value: true, message: "Email required" },
                                                pattern: { value: regEmail, message: `Please provide a valid email. Examples: 'test@gmail.com'` },
                                            })
                                            }
                                        />
                                        <div>{errorsRegistration.emailRegistration && <LocalError message={errorsRegistration.emailRegistration.message as string} />}</div>
                                    </div>
                                    <div className="forms_field">
                                        <input
                                            type="text"
                                            className="forms_field-input"
                                            placeholder="Username"
                                            {...registerRegistration('usernameRegistration', {
                                                required: { value: true, message: "Username required" },
                                                pattern: { value: regUsername, message: "Username has to start with a letter and be 6~15 characters long" },
                                            })
                                            }
                                        />
                                        <div>{errorsRegistration.usernameRegistration && <LocalError message={errorsRegistration.usernameRegistration.message as string} />}</div>
                                    </div>
                                    <div className="forms_field">
                                        <input
                                            type="password"
                                            className="forms_field-input"
                                            placeholder="Password"
                                            {...registerRegistration('passwordRegistration', {
                                                required: { value: true, message: "Password required" },
                                                pattern: { value: regPassword, message: "Password has to consist of alphabet and numbers. Spaces are not allowed. Special characters not allowed are : ~" },
                                            })
                                            }
                                        />
                                        <div>{errorsRegistration.passwordRegistration && <LocalError message={errorsRegistration.passwordRegistration.message as string} />}</div>
                                    </div>
                                </fieldset>
                                <div className="forms_buttons">
                                    <input type="submit" value="Sign up" className="forms_buttons-action" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
