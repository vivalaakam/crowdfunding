export function NoWallet() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">No Wallet Detected</h1>
            <p className="text-gray-500">Please connect a wallet to continue.</p>
        </div>
    );
}