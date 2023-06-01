'use client'
import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { regPassword, regUsername, regEmail } from '@app/(login)/validation';
import Error from '@/components/Error';
import config from '@/config';

export default function Home() {
    let [bounceDir, setBounceDir] = useState(0);
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
        console.log(username);
        return await axios.post(`${config.expressHost}/login`, {
            username: username,
            password: password
        })
            .then((res: AxiosResponse) => {
                console.log(res.status);
                if (res.status === 200) {
                    sessionStorage.setItem("token", res.data.token);
                    window.location.href = '/dashboard';
                } else {
                    alert("Invalid username or password");
                }
            })
            .catch((err: AxiosError) => {
                console.error(err)
            });
    }

    const handleRegistration = async (data: FieldValues) => {
        const {
            'emailRegistration': email,
            'usernameRegistration': username,
            'passwordRegistration': password
        } = data;
        console.log(password);
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
            <div className='float-end'><img src="/logoWhite.png" className="logo flex-col flex ml-auto mr-auto top" /></div>
            <section className="user">
                <div className="user_options-container">
                    <div className="user_options-text">
                        <div className="user_options-unregistered">
                            <h2 className="user_unregistered-title">Don't have an account?</h2>
                            <p className="user_unregistered-text">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap.</p>
                            <button className="user_unregistered-signup" id="signup-button" onClick={signUpHandler}>Sign up</button>
                        </div>

                        <div className="user_options-registered">
                            <h2 className="user_registered-title">Have an account?</h2>
                            <p className="user_registered-text">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap.</p>
                            <button className="user_registered-login" id="login-button" onClick={logInHandler}>Login</button>
                        </div>
                    </div>

                    <div className={"user_options-forms " + (bounceDir ? 'bounceLeft' : 'bounceRight')} id="user_options-forms">
                        <div className="user_forms-login">
                            <h2 className="forms_title">Login</h2>
                            <form className="forms_form" onSubmit={handleLogInSubmit(handleLogIn)}>
                                <fieldset className="forms_fieldset">
                                    <div className="forms_field">
                                        <input
                                            type="text"
                                            className="forms_field-input"
                                            autoFocus
                                            placeholder="Username"
                                            {...registerLogIn('usernameLogIn', {
                                                required: { value: true, message: `Username required` },
                                                pattern: { value: regUsername, message: `Invalid username` },
                                            })
                                            }
                                        />
                                        <div>{errorsLogIn.usernameLogIn && <Error message={errorsLogIn.usernameLogIn.message as string} />}</div>
                                    </div>
                                    <div className="forms_field">
                                        <input
                                            type="password"
                                            className="forms_field-input"
                                            placeholder="Password"
                                            {...registerLogIn('passwordLogIn', {
                                                required: { value: true, message: `Password required` },
                                                pattern: { value: regPassword, message: `Invalid password` },
                                            })
                                            }
                                        />
                                        <div>{errorsLogIn.passwordLogIn && <Error message={errorsLogIn.passwordLogIn.message as string} />}</div>
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
                                                required: { value: true, message: `Email required` },
                                                pattern: { value: regEmail, message: `Invalid email` },
                                            })
                                            }
                                        />
                                        <div>{errorsRegistration.emailRegistration && <Error message={errorsRegistration.emailRegistration.message as string} />}</div>
                                    </div>
                                    <div className="forms_field">
                                        <input
                                            type="text"
                                            className="forms_field-input"
                                            placeholder="Username"
                                            {...registerRegistration('usernameRegistration', {
                                                required: { value: true, message: `Username required` },
                                                pattern: { value: regUsername, message: `Invalid username` },
                                            })
                                            }
                                        />
                                        <div>{errorsRegistration.usernameRegistration && <Error message={errorsRegistration.usernameRegistration.message as string} />}</div>
                                    </div>
                                    <div className="forms_field">
                                        <input
                                            type="password"
                                            className="forms_field-input"
                                            placeholder="Password"
                                            {...registerRegistration('passwordRegistration', {
                                                required: { value: true, message: `Password required` },
                                                pattern: { value: regPassword, message: `Invalid password` },
                                            })
                                            }
                                        />
                                        <div>{errorsRegistration.passwordRegistration && <Error message={errorsRegistration.passwordRegistration.message as string} />}</div>
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
