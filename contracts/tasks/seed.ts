task("seed", "Seed contract")
    .addParam("contract", "contract")
    .addParam("goal", "goal")
    .addParam("deadline", "deadline")
    .addParam("metadata", "metadata")
    .addParam("signer", "signer")
    .addParam("hash", "hash")
    .setAction(async (taskArgs) => {
        if ((await ethers.provider.getCode(taskArgs.contract)) === "0x") {
            console.error("You need to deploy your contract first");
            return;
        }
        const contract = await ethers.getContractAt("CrowdfundingList", taskArgs.contract);

        const signer = new ethers.Wallet(taskArgs.signer, ethers.provider);

        const tx = await contract
            .connect(signer)
            .create(
                ethers.parseEther(taskArgs.goal), new Date(taskArgs.deadline).getTime() / 1000, taskArgs.metadata, BigInt(`0x${taskArgs.hash}`
                ));
        const receipt = await tx.wait();
        console.log(`The hash is: ${tx.hash}`);
        console.log("logs", JSON.stringify(receipt.logs, null, 2));
    });
