import {useId} from "react";
import styles from './input.module.scss';

export type InputProps = {
    label: string
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export function Input({label, ...props}: InputProps) {
    const id = useId();

    return (
        <div className={styles.container}>
            <label htmlFor={id}>{label}:</label>
            <input {...props} id={id}/>
        </div>
    )
}