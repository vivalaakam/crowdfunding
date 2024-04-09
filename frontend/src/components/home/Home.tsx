import styles from "./home.module.scss";
import {CrowdfundingInfo} from "@/src/types";
import {ListRow} from "@/src/components/ListRow";

export type HomeProps = {
    list: CrowdfundingInfo[],
    onClick: (id: string) => void;
};

export function Home({list, onClick}: HomeProps) {
    return (
        <main className={styles.main}>
            {list.map((row, i) => (
                <ListRow row={row} onClick={onClick} key={`${row.id}`}/>
            ))}
        </main>
    );
}
