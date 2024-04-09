import styles from './ListRow.module.scss';
import {CrowdfundingInfo} from "@/src/types";
import {useCallback} from "react";

export type VerifyRowProps = {
    row: CrowdfundingInfo;
    onClick: (id: string) => void;
}

export function ListRow({row, onClick}: VerifyRowProps) {
    const onClickRow = useCallback(() => {
        onClick(row.id);
    }, [onClick, row])

    return (
        <div className={styles.container} onClick={onClickRow}>
            <div className={styles.preview}>
                <img src={row.metadata.image} alt={row.metadata.name}/>
            </div>
            <h2 className={styles.title}>{row.metadata.name}</h2>
            <div className={styles.description}>{row.metadata.description}</div>
            <div className={styles.info}>Goal: {row.goal.toString()}</div>
            <div className={styles.buttons} />
        </div>
    );
}