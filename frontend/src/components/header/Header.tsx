import {useCallback, useContext, useEffect, useState} from "react";
import {EthereumContext} from "@/src/context";
import {WEI} from "@/src/constants";
import Decimal from "decimal.js";
import Link from "next/link";

export function Header() {
    const [balance, setBalance] = useState(new Decimal(0));
    const appData = useContext(EthereumContext);

    useEffect(() => {
        if (appData.provider && appData.address) {
            appData.provider.getBalance(appData.address).then((balance) => {
                setBalance(new Decimal(balance.toString()).dividedBy(WEI));
            });

        } else {
            setBalance(new Decimal(0));
        }
    }, [appData.provider, appData.address])

    const onClick = useCallback(() => {
        if (appData.provider) {
            appData.disconnect();
        } else {
            appData.connect();
        }
    }, [appData]);

    return (
        <header>
            <button onClick={onClick}>
                {appData.provider ? 'disconnect' : 'connect'}
            </button>
            <Link href="/">Main</Link>
            <Link href="/create">Create</Link>
            <Link href="/verify">Verify</Link>
            <Link href="/rejected">Rejected</Link>
            {appData.provider && (
                <select value={appData.address} onChange={(e) => {
                    appData.setAddress(e.target.value);
                }}>
                    {appData.accounts.map((account) => (
                        <option key={account} value={account}>{account}</option>
                    ))}
                </select>
            )}
            {appData.provider && balance.toFixed(4)}
        </header>
    )
}