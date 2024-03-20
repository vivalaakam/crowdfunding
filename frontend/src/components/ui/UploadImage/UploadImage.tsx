import {useCallback, useId} from "react";
import styles from './upload-image.module.scss';

export type UploadImageProps = {
    label: string;
    value: string | null;
    onChange: (value: string) => void;
};

export function UploadImage({label, value, onChange}: UploadImageProps) {
    const id = useId();

    const onFileUpload = useCallback(async (e: any) => {
        const image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function (e) {
                if (!e.target) {
                    reject();
                } else {
                    resolve(e.target.result as string);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        });

        onChange(image);
    }, [onChange])

    return (
        <div className={styles.container}>
            <span className={styles.label}>{label}:</span>
            <label htmlFor={id} className={styles.uploader}>
                <input id={id} name={id} type="file" className={styles.input} onChange={onFileUpload}/>
                {value && <img src={value} alt="Uploaded image" className={styles.image}/>}
                {!value && <div className={styles.spacer}/>}
            </label>
        </div>
    );
}