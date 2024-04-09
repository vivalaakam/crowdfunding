import {BrowserProvider, JsonRpcSigner} from "ethers";
import Decimal from "decimal.js";

export type CrowdfundingInfoMetadata = {
    image: string;
    name: string;
    description: string;
}

export type CrowdfundingInfo = {
    id: string,
    creator: string;
    goal: Decimal;
    current: Decimal;
    userAmount: Decimal;
    deadline: Date;
    metadata: CrowdfundingInfoMetadata
}

export enum EthStatus {
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    CONNECTING = "connecting",
    NOT_EXISTS = "not_exists",
}

export interface AccountData {
    address: string;
    chainId: string;
    network: string;
    signer: JsonRpcSigner | null;
    provider: BrowserProvider | null;
    accounts: string[];
}
