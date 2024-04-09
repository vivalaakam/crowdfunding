task("get-verifying", "Seed contract")
    .addParam("contract", "contract")
    .setAction(async (taskArgs) => {
        if ((await ethers.provider.getCode(taskArgs.contract)) === "0x") {
            console.error("You need to deploy your contract first");
            return;
        }
        const contract = await ethers.getContractAt("CrowdfundingList", taskArgs.contract);

        const tx = await contract
            .getVerifying();
        console.log(`The hash is: ${tx}`);
    });
