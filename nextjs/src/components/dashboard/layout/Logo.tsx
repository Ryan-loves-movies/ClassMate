'use client'
import React from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import styles from "@components/dashboard/layout/logo.module.css";

export default function Logo() {
    const theme = useTheme();

    return (
        <Link href="/dashboard">
            <img src={(theme.theme === "light") ? "/logoDark.png" : "/logoWhite.png"} className={styles['logo']} alt="Logo" />
        </Link>
    );
}
