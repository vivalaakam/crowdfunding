import {useCallback, useState} from "react";
import {ethers} from "ethers";

const [accountData, setAccountData] = useState({});

const connect = useCallback(async () => {
    const ethereum = window.ethereum;
    if (typeof ethereum !== "undefined") {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts", });
            const provider = new ethers.BrowserProvider(ethereum);
            const network = await provider.getNetwork();
            const signer = await provider.getSigner();

            setAccountData({ address: accounts[0], chainId: network.chainId.toString(), network: network.name, signer, provider });
        } catch (error: Error | any) {
            alert(`Error connecting to MetaMask: ${error?.message ?? error}`);
        }
    } else {
        alert("MetaMask not installed");
    }
}, []);