import {loadFixture, time,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers, upgrades} from "hardhat";

describe("CrowdfundingList", function () {
    async function deployOneYearLockFixture() {
        const [owner, contractOwner] = await ethers.getSigners();

        const CrowdfundingList = await ethers.getContractFactory("CrowdfundingList");
        const contract = await upgrades.deployProxy(CrowdfundingList, [owner.address]);

        return {contract, owner, contractOwner};
    }

    it("should create crowdfunding", async () => {
        const {contract, owner, contractOwner} = await loadFixture(deployOneYearLockFixture);

        const deadlineTime = (await time.latest()) + 60;
        const goal = ethers.parseEther("10");

        const createTx = await contract.connect(contractOwner).create(goal, deadlineTime, "Test", 0x0);
        let receipt = await createTx.wait();

        const event = receipt.logs.find(log => {
            try {
                return contract.interface.parseLog(log)?.name === 'CrowdfundingCreated';
            } catch (e) {
                return false;
            }
        });

        expect(event).not.to.be.undefined;
        const deployed = event?.args?.crowdfunding;
        expect(deployed).not.to.be.undefined;
        const crowContract = await ethers.getContractAt("Crowdfunding", deployed);
        const info = await crowContract.info();
        expect(info.goal).to.equal(goal);
        expect(await crowContract.creator()).to.equal(contractOwner.address);
        expect(info.metadata).to.equal("Test");
        expect(await crowContract.state()).to.equal(0);
        expect(info.deadline).to.equal(deadlineTime);

        expect(await contract.connect(owner).start(deployed)).not.to.be.reverted;
        expect(await crowContract.state()).to.equal(2);
    });
});
