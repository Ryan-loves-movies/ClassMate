'use client'
import React, { useState } from "react";
import { useTheme } from "next-themes";

export default function SwitchModeButton() {
    let { theme, setTheme } = useTheme();
    let [isActive, setIsActive] = useState(false);

    const toggleTheme = () => {
        setIsActive(!isActive);
        setTheme((theme === "light") ? "dark" : "light");
    }

    return (
        <button className={`mode-switch ${isActive ? "active" : ""}`} onClick={toggleTheme} title="Switch Theme">
            <svg className="moon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="24" height="24" viewBox="0 0 24 24">
                <defs></defs>
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
        </button>
    );
}
