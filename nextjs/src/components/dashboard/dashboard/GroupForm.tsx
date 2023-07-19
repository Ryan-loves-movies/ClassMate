import styles from '@components/dashboard/dashboard/groupForm.module.css';
import { Dispatch, KeyboardEvent, MouseEvent, useEffect, useRef } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import LocalError from '@components/login/LocalError';
import config from '@/config';
import axios, { AxiosResponse } from 'axios';
const { expressHost } = config;

import group from '@models/group';

export default function GroupForm({
    visibility,
    setVisibility,
    setNewGroup
}: {
    visibility: boolean;
    setVisibility: Dispatch<boolean>;
    setNewGroup: Dispatch<group>;
}) {
    // React-hook forms: Registreation things
    const {
        register: registerGroup,
        handleSubmit: handleGroupSubmit,
        reset: resetInputs,
        formState: { errors: errorsGroup, isSubmitSuccessful }
    } = useForm();

    const groupBoxColors = [
        'rgb(254, 228, 203, 0.9)',
        'rgb(233, 231, 253, 0.9)',
        'rgb(255, 211, 226, 0.9)',
        'rgb(200, 247, 220, 0.9)',
        'rgb(213, 222, 255, 0.9)',
        'rgb(253, 226, 226, 0.9)',
        'rgb(226, 247, 246, 0.9)',
        'rgb(253, 219, 216, 0.9)',
        'rgb(234, 231, 255, 0.9)',
        'rgb(255, 241, 208, 0.9)'
    ];
    const randomIndex = () => Math.floor(Math.random() * groupBoxColors.length);

    // Adding group functionality
    const handleGroupAdd = async (data: FieldValues) => {
        const { moduleCode, groupName } = data;
        const color = groupBoxColors[randomIndex()];

        return await axios
            .post(
                `${expressHost}/authorized/group`,
                {
                    groupName,
                    moduleCode,
                    color: color,
                    ay: sessionStorage.getItem('ay'),
                    semester: sessionStorage.getItem('sem'),
                    username: sessionStorage.getItem('username')
                },
                {
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    }
                }
            )
            .then((res: AxiosResponse) => {
                setVisibility(false);
                setNewGroup({
                    id: res.data.id,
                    moduleCode: res.data.moduleCode,
                    name: res.data.name,
                    color: res.data.color
                });
            })
            .catch((err) => {
                alert(`An error occurred when trying to create group: ${err}`);
            });
    };

    // validation of module code
    const validateModule = async (input: string) => {
        const moduleExists = await axios
            .get(`${expressHost}/authorized/module`, {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                },
                params: {
                    moduleCode: input,
                    ay: sessionStorage.getItem('ay'),
                    semester: sessionStorage.getItem('sem')
                }
            })
            .catch(() => {
                return { status: 404 };
            });
        return moduleExists.status === 200;
    };

    // Escape window functions
    const ref = useRef<HTMLDivElement>(null);
    const handleOutsideClick = (event: MouseEvent<HTMLDivElement>) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setVisibility(false);
        }
    };
    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setVisibility(false);
        }
    };

    // Reset the input fields upon submission
    useEffect(() => {
        if (isSubmitSuccessful) {
            resetInputs();
        }
    }, [isSubmitSuccessful, resetInputs]);

    return (
        <div
            className={`${styles['popup']} ${
                visibility ? styles['visible'] : ''
            }`}
            onClick={handleOutsideClick}
            onKeyDown={handleEscape}
        >
            <div className={styles['popup-container']} ref={ref}>
                <h2 className={styles['forms_title']}>Add Group</h2>
                <form
                    className={styles['forms_form']}
                    onSubmit={handleGroupSubmit(handleGroupAdd)}
                >
                    <fieldset className={styles['forms_fieldset']}>
                        <div className={styles['forms_field']}>
                            <input
                                type="text"
                                className={styles['forms_field-input']}
                                placeholder="Module Code"
                                {...registerGroup('moduleCode', {
                                    required: {
                                        value: true,
                                        message: 'Module code required'
                                    },
                                    validate: {
                                        checkModule: async (input: string) =>
                                            (await validateModule(input)) ||
                                            "Module doesn't exist!"
                                    }
                                })}
                            />
                            <div className={styles['error']}>
                                {errorsGroup.moduleCode && (
                                    <LocalError
                                        message={
                                            errorsGroup.moduleCode
                                                .message as string
                                        }
                                    />
                                )}
                            </div>
                        </div>
                        <div className={styles['forms_field']}>
                            <input
                                type="text"
                                className={styles['forms_field-input']}
                                placeholder="Group Name"
                                {...registerGroup('groupName', {
                                    required: {
                                        value: true,
                                        message: 'Group name required'
                                    }
                                })}
                            />
                            <div className={styles['error']}>
                                {errorsGroup.groupName && (
                                    <LocalError
                                        message={
                                            errorsGroup.groupName
                                                .message as string
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </fieldset>
                    <button
                        type="submit"
                        value="Create Group"
                        className={styles['forms_buttons-action']}
                    >
                        Create Group
                    </button>
                </form>
            </div>
        </div>
    );
}
