import {Verify} from "@/src/components";
import {useCallback, useContext, useEffect, useState} from "react";
import {useCrowdfundingList} from "@/src/hooks/useCroudfundingList";
import {EthereumContext} from "@/src/context";
import {CrowdfundingInfo} from "@/src/types";

export default function VerifyScreen() {
    const appData = useContext(EthereumContext);
    const crowdfunding = useCrowdfundingList();
    const [crowdfundingList, setCrowdfundingList] = useState<CrowdfundingInfo[]>([]);

    const onApprove = useCallback(async (id: string) => {
        await crowdfunding.onApprove(id);
    }, [crowdfunding]);

    const onReject = useCallback(async (id: string) => {
        await crowdfunding.onReject(id);
    }, [crowdfunding]);

    useEffect(() => {
        crowdfunding.getVerifying()
            .then((list) => {
                setCrowdfundingList(list);
            });
    }, [crowdfunding.getVerifying, appData.address])

    console.log('crowdfundingList', crowdfundingList);

    return <Verify list={crowdfundingList} onApprove={onApprove} onReject={onReject}/>
}