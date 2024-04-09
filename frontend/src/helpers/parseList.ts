import Decimal from "decimal.js";
import {WEI} from "@/src/constants";
import {CrowdfundingInfo} from "@/src/types";

export async function parseList(list: Record<string, any>[]) {
    return Promise.all(list.map(parseItem))
}

export async function parseItem(item: Record<string, any>): Promise<CrowdfundingInfo> {
    const req = await fetch(`/api/meta/${item.info.metadata}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const metadata = await req.json();

    return {
        id: item.id,
        creator: item.creator,
        goal: new Decimal(item.info.goal.toString()).dividedBy(WEI),
        current: new Decimal(item.info.current.toString()).dividedBy(WEI),
        userAmount: new Decimal(item.userAmount.toString()).dividedBy(WEI),
        deadline: new Date(Number(item.deadline) * 1000),
        metadata: metadata.data || {
            "image": "unknown",
            "name": "unknown",
            "description": "unknown"
        }
    }

}