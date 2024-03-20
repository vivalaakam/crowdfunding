import {Home} from "@/src/components";
import {useContext, useEffect, useState} from "react";
import {useCrowdfunding} from "@/src/hooks/useCroudfunding";
import {EthereumContext} from "@/src/context";

export default function HomeScreen() {
    const appData = useContext(EthereumContext);
    const crowdfunding = useCrowdfunding();
    const [crowdfundingList, setCrowdfundingList] = useState([]);

    useEffect(() => {
        if (crowdfunding) {
            crowdfunding.getActive(appData.address).then((list) => {
                setCrowdfundingList(list);
            });
        }
    }, [crowdfunding, appData.address])

    return <Home list={crowdfundingList}/>
}