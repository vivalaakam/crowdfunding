export async function set(data: string): Promise<string> {
    const myblob = new Blob([data], {
        type: 'application/json'
    });

    const form = new FormData();
    form.append('metadata.json', myblob, 'metadata.json');

    const response = await fetch(
        `${process.env.NEXT_IPFS_NODE}/api/v0/add?pin=true`,
        {
            method: "POST",
            body: form,
            headers: {
                "Authorization": "Basic YWxpY2U6ZGlydHktbGl0dGxlLXNlY3JldA==",
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
                "Authorization": "Basic YWxpY2U6ZGlydHktbGl0dGxlLXNlY3JldA==",
                "accept-type": "application/json",
            },
        },
    );

    return await response.json()
}