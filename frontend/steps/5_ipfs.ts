export async function get<T>(hash: string): Promise<T> {
    const response = await fetch(
        `${process.env.NEXT_IPFS_NODE}/api/v0/cat?arg=${hash}`,
        {
            method: "POST",
            headers: {
                "Authorization": `Basic ${process.env.NEXT_IPFS_SECRET}`,
                "accept-type": "application/json",
            },
        },
    );

    return await response.json()
}