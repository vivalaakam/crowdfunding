import {EthereumContext} from "@/src/context";
import {useCallback, useContext, useMemo} from "react";
import {Contract} from "ethers";
import Crowdfunding from "../../../contracts/artifacts/contracts/Croudfunding.sol/Crowdfunding.json"

export function useCrowdfunding(account: string) {
    const appData = useContext(EthereumContext);
    const crowdfunding = useMemo(
        () => appData.signer &&
            new Contract(account, Crowdfunding.abi, appData.signer),
        [appData.signer, account]
    ) as Contract;

    const contribute = useCallback(async (value: BigInt) => {
        const receipt = await crowdfunding.contribute({value: value});
        const resp = await receipt.wait();

        console.log('res', resp);
    }, [crowdfunding]);

    return {
        crowdfunding,
        contribute
    }
}