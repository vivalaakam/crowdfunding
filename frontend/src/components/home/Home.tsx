import styles from "./home.module.scss";
import {CrowdfundingInfo} from "@/src/types";

export type HomeProps = {
    list: CrowdfundingInfo[]
};

export function Home({list}: HomeProps) {
    console.log(list);
    return (
        <main className={styles.main}>
            {list.length}
        </main>
    );
}
