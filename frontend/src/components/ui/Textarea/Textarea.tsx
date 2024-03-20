import {useId} from "react";
import styles from './textarea.module.scss';

export type TextareaProps = {
    label: string
} & React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>

export function Textarea({label, ...props}: TextareaProps) {
    const id = useId();

    return (
        <div className={styles.container}>
            <label htmlFor={id}>{label}:</label>
            <textarea {...props} id={id}/>
        </div>
    )
}