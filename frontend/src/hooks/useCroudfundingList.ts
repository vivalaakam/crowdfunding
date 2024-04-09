import {EthereumContext} from "@/src/context";
import {useCallback, useContext, useMemo} from "react";
import {Contract, ethers} from "ethers";
import CrowdfundingList from "../../../contracts/artifacts/contracts/Croudfunding.sol/CrowdfundingList.json"
import {parseItem, parseList} from "@/src/helpers/parseList";

export function useCrowdfundingList() {
    const appData = useContext(EthereumContext);
    const crowdfunding = useMemo(
        () => appData.signer &&
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
        if (!crowdfunding) {
            return []
        }
        const list = await crowdfunding.getActive(appData.address);
        return await parseList(list)
    }, [crowdfunding, appData.address]);

    const getItem = useCallback(async (id: string) => {
        if (!crowdfunding) {
            return null
        }
        const item = await crowdfunding.getItem(id, appData.address);
        return parseItem(item)
    }, [crowdfunding, appData.address]);

    const getVerifying = useCallback(async () => {
        if (!crowdfunding) {
            return []
        }

        const list = await crowdfunding.getVerifying();
        return await parseList(list)
    }, [crowdfunding])

    const onApprove = useCallback(async (id: string) => {
        const receipt = await crowdfunding.start(id);
        const resp = await receipt.wait();

        console.log('res', resp);
    }, [crowdfunding]);

    const onReject = useCallback(async (id: string) => {
        const receipt = await crowdfunding.reject(id);
        const resp = await receipt.wait();

        console.log('res', resp);
    }, [crowdfunding]);

    return {
        crowdfunding,
        create,
        getItem,
        getActive,
        getVerifying,
        onApprove,
        onReject,
    }
}