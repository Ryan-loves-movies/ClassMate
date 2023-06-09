'use client'
import React, { useState } from "react";
import { useTheme } from "next-themes";
import styles from '@components/dashboard/layout/switchModeButton.module.css';

export default function SwitchModeButton() {
    const { theme, setTheme } = useTheme();
    const [isActive, setIsActive] = useState((theme === "dark") ? true : false);

    const toggleTheme = () => {
        setIsActive(!isActive);
        setTheme((theme === "light") ? "dark" : "light");
    }

    return (
        <button className={`${styles['mode-switch']} ${isActive ? styles['active'] : ''}`} onClick={toggleTheme} title="Switch Theme" type="button">
            <svg className={styles['moon']} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="24" height="24" viewBox="0 0 24 24">
                <defs />
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                <title>Dark Mode</title>
            </svg>
        </button>
    );
}
