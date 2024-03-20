import {EthereumContext} from "@/src/context";
import {useCallback, useContext, useMemo} from "react";
import {Contract, ethers} from "ethers";
import CrowdfundingList from "../../../contracts/artifacts/contracts/Croudfunding.sol/CrowdfundingList.json"
import {parseList} from "@/src/helpers/parseList";

export function useCrowdfunding() {
    const appData = useContext(EthereumContext);
    const crowdfunding = useMemo(
        () =>
            appData.signer &&
            new Contract(process.env.NEXT_PUBLIC_CROUDFUNDING_LIST_ADDRESS, CrowdfundingList.abi, appData.signer),
        [appData.signer]
    ) as Contract;

    const create = useCallback(async (name: string, description: string, image: string, goal: string, deadline: string) => {
        const req = await fetch('/api/meta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description,
                image: image,
            })
        });

        const response = await req.json();

        if (!response.cid) return;

        const receipt = await crowdfunding.create(
            ethers.parseEther(goal), new Date(deadline).getTime() / 1000, response.cid, BigInt(`0x${response.hash}`)
        );

        const resp = await receipt.wait();

        console.log('res', resp);
    }, [crowdfunding])

    const getActive = useCallback(async () => {
        const list = await crowdfunding.getActive(appData.address);
        return list.map(parseList)
    }, [crowdfunding, appData.address])

    const getVerifying = useCallback(async () => {
        const list = await crowdfunding.getVerifying(appData.address);
        return list.map(parseList)
    }, [crowdfunding, appData.address])

    const onApprove = useCallback((id: string) => {
        console.log('should verify', id);
    }, []);

    const onReject = useCallback((id: string) => {
        console.log('should reject', id);
    }, []);

    return {
        crowdfunding,
        create,
        getActive,
        getVerifying,
        onApprove,
        onReject,
    }
}