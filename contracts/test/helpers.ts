import {Contract} from "ethers";

export async function getEvent(
    contract: Contract,
    tx: any,
    eventName: string,
) {
    const receipt = await tx.wait();
    if (receipt?.logs) {
        for (const log of receipt.logs) {
            const event = contract.interface.parseLog(log);
            if (event?.name === eventName) {
                return event;
            }
        }
    }

    return null;
}