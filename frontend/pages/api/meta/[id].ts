import type {NextApiRequest, NextApiResponse} from 'next'
import keccak256 from "keccak256";
import {get} from "@/src/helpers/ipfs";

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
    const cid = req.query.id as string;
    const data = await get(cid);
    const hash = keccak256(JSON.stringify(data)).toString('hex');

    res.status(200).json({
        message: 'success',
        cid: cid,
        data: data,
        hash: hash,
    })
}