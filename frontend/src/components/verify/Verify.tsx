import styles from "./verify.module.scss";
import {CrowdfundingInfo} from "@/src/types";
import {VerifyRow} from "@/src/components/VerifyRow/VerifyRow";

export type VerifyProps = {
    list: CrowdfundingInfo[],
    onApprove: (id: string) => void,
    onReject: (id: string) => void,
};

export function Verify({list, onApprove, onReject}: VerifyProps) {

    return (
        <main className={styles.main}>
            {list.map((row) => (<VerifyRow row={row} key={row.id} onApprove={onApprove} onReject={onReject}/>))}
        </main>
    );
}
