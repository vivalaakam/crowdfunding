import Decimal from "decimal.js";
import {WEI} from "@/src/constants";

export async function parseList(list: Record<string, any>[]) {
    return Promise.all(list.map(async (c) => {
        console.log(c.metadata);

        const req = await fetch(`/api/meta/${c.metadata}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const metadata = await req.json();

        return {
            id: c.id,
            creator: c.creator,
            goal: new Decimal(c.goal.toString()).dividedBy(WEI),
            current: new Decimal(c.current.toString()).dividedBy(WEI),
            userAmount: new Decimal(c.userAmount.toString()).dividedBy(WEI),
            deadline: new Date(Number(c.deadline) * 1000),
            metadata: metadata.data
        }
    }))
}