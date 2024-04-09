export async function set(data: string): Promise<string> {
    const myblob = new Blob([data], {
        type: 'application/json'
    });

    const form = new FormData();
    form.append('metadata.json', myblob, 'metadata.json');

    console.log('NEXT_IPFS_NODE', process.env.NEXT_IPFS_NODE)

    const response = await fetch(
        `${process.env.NEXT_IPFS_NODE}/api/v0/add?pin=true`,
        {
            method: "POST",
            body: form,
            headers: {
                "Authorization": `Basic ${process.env.NEXT_IPFS_SECRET}`,
                "accept-type": "application/json",
            },
        },
    );

    const info = await response.json();
    return info.Hash
}

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