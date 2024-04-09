import {createContext} from "react";
import {AccountData} from "@/src/types";

export const EthereumContext = createContext<AccountData & {
    connect: () => void,
    disconnect: () => void,
    setAddress: (address: string) => void,
}>({
    address: "",
    chainId: "",
    network: "",
    provider: null,
    connect: () => {
    },
    disconnect: () => {
    },
    setAddress: (address: string) => {
    }
});
