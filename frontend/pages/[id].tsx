import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {useCrowdfundingList} from "@/src/hooks/useCroudfundingList";
import {CrowdfundingInfo} from "@/src/types";
import {Detail} from "@/src/components/Detail/Detail";
import {useCrowdfunding} from "@/src/hooks/useCroudfunding";
import {ethers} from "ethers";

export default function DetailsScreen() {
    const [item, setItem] = useState<null | CrowdfundingInfo>(null);
    const {query} = useRouter();
    const crowdfundingList = useCrowdfundingList();
    const crodfunding = useCrowdfunding(query.id as string);

    useEffect(() => {
        if (query.id) {
            crowdfundingList.getItem(query.id as string).then((item) => {
                setItem(item);
            })
        }
    }, [crowdfundingList.getItem, query.id]);


    const onContribute = useCallback((amount: string) => {
        crodfunding.contribute(ethers.parseEther(amount));
    }, [crodfunding.contribute])

    if (!item) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {query.id}
            <Detail item={item} onContribute={onContribute}/>
        </>
    )
}