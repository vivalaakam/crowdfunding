export async function set(data: string): Promise<string> {
    const myBlob = new Blob([data], { type: 'application/json' });

    const form = new FormData();
    form.append('metadata.json', myBlob, 'metadata.json');

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