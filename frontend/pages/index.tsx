import {Home} from "@/src/components";
import {useCallback, useContext, useEffect, useState} from "react";
import {useCrowdfundingList} from "@/src/hooks/useCroudfundingList";
import {EthereumContext} from "@/src/context";
import {useRouter} from "next/router";
import {CrowdfundingInfo} from "@/src/types";

export default function HomeScreen() {
    const appData = useContext(EthereumContext);
    const crowdfunding = useCrowdfundingList();
    const [crowdfundingList, setCrowdfundingList] = useState<CrowdfundingInfo[]>([]);
    const router = useRouter();

    useEffect(() => {
        crowdfunding.getActive().then((list) => {
            setCrowdfundingList(list);
        });
    }, [crowdfunding.getActive, appData.address])

    const onClickRow = useCallback((id: string) => {
        router.push(`/${id}`);
    }, [router])

    return <Home list={crowdfundingList} onClick={onClickRow}/>
}