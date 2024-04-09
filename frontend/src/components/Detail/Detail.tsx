import {CrowdfundingInfo} from "@/src/types";
import {ChangeEvent, useCallback, useState} from "react";
import {Input, Modal} from "@/src/components";

export type DetailProps = {
    item: CrowdfundingInfo,
    onContribute: (amount: string) => void
}

export function Detail({item, onContribute}: DetailProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState("0");

    const onAmount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }, []);

    const onClickContribute = useCallback(() => {
        onContribute(amount);
    }, [amount, onContribute])
    return (
        <div>
            <h1>{item.metadata.name}</h1>
            <div>
                {item.metadata.description}
            </div>
            <div>
                <img src={item.metadata.image} alt={item.metadata.name}/>
            </div>
            <button onClick={() => {
                setIsOpen(true);
            }}>Contribute
            </button>

            <Modal handleClose={() => setIsOpen(false)} isOpen={isOpen}>
                <div>
                    <Input value={amount} type={"number"} onChange={onAmount} label="Amount"/>
                    <button onClick={onClickContribute}>Contribute</button>
                </div>
            </Modal>
        </div>
    )
}