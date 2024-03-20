import styles from './layout.module.scss';
import React from "react";

export type LayoutProps = {
    children: React.ReactNode
}

export function Layout({children}: LayoutProps) {
    return (
        <main className={styles.container}>
            {children}
        </main>
    )
}