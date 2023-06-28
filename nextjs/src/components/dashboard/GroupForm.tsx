import styles from '@components/dashboard/groupForm.module.css';
import { Dispatch, KeyboardEvent, MouseEvent, useEffect, useRef } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import LocalError from '@components/login/LocalError';

export default function GroupForm({ visibility, setVisibility }: { visibility: boolean, setVisibility: Dispatch<boolean> }) {
    // React-hook forms: Registreation things
    const {
        register: registerGroup,
        handleSubmit: handleGroupSubmit,
        reset: resetInputs,
        formState: {
            errors: errorsGroup,
            isSubmitSuccessful
        }
    } = useForm();

    // Reset the input fields upon submission
    useEffect(() => {
        if (isSubmitSuccessful) {
            resetInputs();
        }
    }, [isSubmitSuccessful, resetInputs]);

    // Adding group functionality
    const handleGroupAdd = (data: FieldValues) => {
        const {
            'Module Code': moduleCode,
            'Group Name': groupName
        } = data;
        setVisibility(false);
    }

    // Escape window functions
    const ref = useRef<HTMLDivElement>(null);
    const handleOutsideClick = (event: MouseEvent<HTMLDivElement>) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setVisibility(false);
        }
    }
    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setVisibility(false);
        }
    }

    return (
        <div className={`${styles['popup']} ${visibility ? styles['visible'] : ''}`} onClick={handleOutsideClick} onKeyDown={handleEscape}>
            <div className={styles['popup-container']} ref={ref}>
                <h2 className={styles['forms_title']}>Add Group</h2>
                <form className={styles['forms_form']} onSubmit={handleGroupSubmit(handleGroupAdd)}>
                    <fieldset className={styles['forms_fieldset']}>
                        <div className={styles['forms_field']}>
                            <input
                                type="text"
                                className={styles['forms_field-input']}
                                placeholder="Module Code"
                                {...registerGroup('moduleCode', {
                                    required: { value: true, message: "Module code required" }
                                })
                                }
                            />
                            <div className={styles['error']}>{errorsGroup.moduleCode && <LocalError message={errorsGroup.moduleCode.message as string} />}</div>
                        </div>
                        <div className={styles['forms_field']}>
                            <input
                                type="text"
                                className={styles['forms_field-input']}
                                placeholder="Group Name"
                                {...registerGroup('groupName', {
                                    required: { value: true, message: "Group name required" }
                                })
                                }
                            />
                            <div className={styles['error']}>{errorsGroup.groupName && <LocalError message={errorsGroup.groupName.message as string} />}</div>
                        </div>
                    </fieldset>
                    <div className={styles['forms_buttons']}>
                        <input type="submit" value="Create Group" className={styles['forms_buttons-action']} />
                    </div>
                </form>
            </div>
        </div>
    );
}
