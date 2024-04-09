import type {AppProps} from "next/app";
import {useCallback, useState} from "react";
import {ethers} from "ethers";
import {EthereumContext} from "@/src/context";
import {Header, Layout} from "@/src/components";
import {AccountData} from "@/src/types";

import "@/src/styles/globals.css";
import "@/src/styles/normalize.css";
import "@/src/styles/skeleton.css";
import {NoWallet} from "@/src/components/NoWallet/NoWallet";

export default function App({
                                Component,
                                pageProps: {...pageProps},
                            }: AppProps<{}>) {

    const [accountData, setAccountData] = useState<AccountData>({
        address: "",
        chainId: "",
        network: "",
        signer: null,
        provider: null,
        accounts: [],
    });

    const setAddress = useCallback((address: string) => {
        console.log('setAddress', address)
        if(accountData.accounts.includes(address)) {
            setAccountData((data) => ({
                ...data,
                address,
            }))
        }
    }, [accountData.accounts])

    const connect = useCallback(async () => {
        const ethereum = (window as any).ethereum;
        if (typeof ethereum !== "undefined") {
            try {
                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                });
                const address = accounts[0];
                const provider = new ethers.BrowserProvider(ethereum);
                const network = await provider.getNetwork();
                const signer = await provider.getSigner();

                setAccountData({
                    address,
                    chainId: network.chainId.toString(),
                    network: network.name,
                    signer,
                    provider,
                    accounts,
                });
            } catch (error: Error | any) {
                alert(`Error connecting to MetaMask: ${error?.message ?? error}`);
            }
        } else {
            alert("MetaMask not installed");
        }
    }, []);

    const disconnect = useCallback(() => {
        setAccountData({
            address: "",
            chainId: "",
            network: "",
            provider: null,
            signer: null,
            accounts: [],
        });
    }, [])

    console.log('accountData', accountData.address)

    return (
        <EthereumContext.Provider value={{...accountData, connect, disconnect, setAddress}}>
            <Header/>
            <Layout>
                {!accountData.provider && <NoWallet/>}
                {accountData.provider && <Component {...pageProps} />}
            </Layout>
        </EthereumContext.Provider>
    );
}
