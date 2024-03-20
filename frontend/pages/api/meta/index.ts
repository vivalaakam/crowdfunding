import type {NextApiRequest, NextApiResponse} from 'next'
import keccak256 from "keccak256";
import {get, set} from "@/src/helpers/ipfs";

type ResponseData = {
    message: string,
    cid: string,
    data: any,
    hash: string,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const {body} = req;
    const data = JSON.stringify(body);
    const hash = keccak256(data).toString('hex');

    const cid = await set(data);
    const resp2 = await get(cid);

    res.status(200).json({
        message: 'success',
        cid: cid,
        data: resp2,
        hash: hash,
    })
}