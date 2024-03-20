import {Verify} from "@/src/components";
import {useCallback, useContext, useEffect, useState} from "react";
import {useCrowdfunding} from "@/src/hooks/useCroudfunding";
import {EthereumContext} from "@/src/context";
import {CrowdfundingInfo} from "@/src/types";

export default function VerifyScreen() {
    const appData = useContext(EthereumContext);
    const crowdfunding = useCrowdfunding();
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
    }, [crowdfunding, appData.address])

    return <Verify list={crowdfundingList} onApprove={onApprove} onReject={onReject}/>
}