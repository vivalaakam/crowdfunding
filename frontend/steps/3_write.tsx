import {Create} from "@/src/components";
import {useCallback} from "react";
import {useCrowdfunding} from "@/src/hooks/useCroudfunding";
import {ethers} from "ethers";

export default function CreateScreen() {
    const crowdfunding = useCrowdfunding();
    const onCreate = useCallback(async (formData: Record<string, any>) => {
        if (!crowdfunding) return;
        const response = {cid: '', hash: ''}

        const goal = ethers.parseEther(formData.goal);
        const deadline = new Date(formData.deadline).getTime() / 1000;

        const receipt = await crowdfunding.create(
            goal, deadline, response.cid, BigInt(`0x${response.hash}`)
        );

        const resp = await receipt.wait();
        console.log('resp', resp);
    }, [crowdfunding])

    return <Create onCreate={onCreate}/>
}