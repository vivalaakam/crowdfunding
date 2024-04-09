import styles from './VerifyRow.module.scss';
import {CrowdfundingInfo} from "@/src/types";
import {useCallback} from "react";

export type VerifyRowProps = {
    row: CrowdfundingInfo;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export function VerifyRow({row, onApprove, onReject}: VerifyRowProps) {
    const onClickApprove = useCallback(() => {
        onApprove(row.id);
    }, [row.id, onApprove])

    const onClickReject = useCallback(() => {
        onReject(row.id);
    }, [row.id, onReject])

    console.log('row', row);

    return (
        <div className={styles.container}>
            <div className={styles.preview}>
                <img src={row.metadata.image} alt={row.metadata.name}/>
            </div>
            <h2 className={styles.title}>{row.metadata.name}</h2>
            <div className={styles.description}>{row.metadata.description}</div>
            <div className={styles.info}>Goal: {row.goal.toString()}</div>
            <div className={styles.buttons}>
                <button onClick={onClickApprove}>Approve</button>
                <button onClick={onClickReject}>Reject</button>
            </div>
        </div>
    );
}