task("start", "Seed contract")
    .addParam("contract", "contract")
    .addParam("item", "item")
    .setAction(async (taskArgs) => {
        if ((await ethers.provider.getCode(taskArgs.contract)) === "0x") {
            console.error("You need to deploy your contract first");
            return;
        }
        const contract = await ethers.getContractAt("CrowdfundingList", taskArgs.contract);

        const tx = await contract
            .start(
                taskArgs.item
            );
        console.log(`The hash is: ${tx}`);
    });
