import {loadFixture, time,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("Crowdfunding", function () {
    async function deployOneYearLockFixture() {
        const deadlineTime = (await time.latest()) + 60;
        const goal = ethers.parseEther("10");
        const [owner, account1, account2, account3] = await ethers.getSigners();

        const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
        const contract = await Crowdfunding.deploy(
            owner.address,
            owner.address,
            goal,
            deadlineTime,
            "Test",
            0x0,
        );

        return {contract, deadlineTime, owner, account1, account2, account3};
    }

    it('should create contract', async () => {
        const {contract} = await loadFixture(deployOneYearLockFixture);
        const info = await contract.info();
        expect(info.goal).to.equal(ethers.parseEther("10"));
        expect(info.deadline).to.equal(info.deadline);
        expect(info.metadata).to.equal("Test");
        expect(info.current).to.equal(0);
    });

    it("should contribute", async () => {
        const {contract, account1, account2} = await loadFixture(deployOneYearLockFixture);

        await expect(contract.start()).not.to.be.reverted;

        const amount1 = ethers.parseEther("1");
        const amount2 = ethers.parseEther("2");

        await expect(contract.connect(account1).contribute({value: amount1})).not.to.be.reverted;
        expect(await contract.contributions(account1.address)).to.equal(amount1);
        const info = await contract.info();
        expect(info.current).to.equal(amount1);

        await expect(contract.connect(account2).contribute({value: amount2})).not.to.be.reverted;
        expect(await contract.contributions(account2.address)).to.equal(amount2);
        const info2 = await contract.info();
        expect(info2.current).to.equal(amount1 + amount2);
    });

    it("should not contribute if not started", async () => {
        const {contract, deadlineTime, account1, account2} = await loadFixture(deployOneYearLockFixture);
        const amount1 = ethers.parseEther("1");
        await expect(contract.connect(account1).contribute({value: amount1})).to.be.revertedWith(
            "Crowdfunding is not in fundraising state"
        );
    })

    it("should not contribute after deadline reached", async () => {
        const {contract, deadlineTime, account1, account2} = await loadFixture(deployOneYearLockFixture);

        await expect(contract.start()).not.to.be.reverted;

        await time.increaseTo(deadlineTime + 1);

        const amount1 = ethers.parseEther("10");

        await expect(contract.connect(account1).contribute({value: amount1})).to.be.revertedWith(
            "Deadline has passed"
        );
    });

    it("should withdraw if goal reached", async () => {
        const {contract, account1, owner, deadlineTime} = await loadFixture(deployOneYearLockFixture);
        const amount1 = ethers.parseEther("10");
        await expect(contract.start()).not.to.be.reverted;

        await expect(contract.connect(account1).contribute({value: amount1})).not.to.be.reverted;

        expect(await ethers.provider.getBalance(contract.target)).to.equal(
            amount1
        );

        await time.increaseTo(deadlineTime);

        await expect(contract.finish()).to.changeEtherBalances(
            [contract, owner, account1],
            [-amount1, amount1, 0]
        );
    });

    it("should refund if goal not reached", async () => {
        const {contract, account1, owner, deadlineTime} = await loadFixture(deployOneYearLockFixture);
        const amount1 = ethers.parseEther("1");

        await expect(contract.start()).not.to.be.reverted;
        await expect(contract.connect(account1).contribute({value: amount1})).not.to.be.reverted;

        expect(await ethers.provider.getBalance(contract.target)).to.equal(
            amount1
        );

        await time.increaseTo(deadlineTime);

        await expect(contract.finish()).to.changeEtherBalances(
            [contract, owner, account1],
            [-amount1, 0, amount1]
        );
    });

    it("should emit event on contribute", async () => {
        const {contract, account1} = await loadFixture(deployOneYearLockFixture);
        const amount1 = ethers.parseEther("1");
        await expect(contract.start()).not.to.be.reverted;
        await expect(contract.connect(account1).contribute({value: amount1})).to.emit(contract, "Contribute").withArgs(account1.address, amount1);
    });

    it("should emit event on withdraw", async () => {
        const {contract, account1, deadlineTime, owner} = await loadFixture(deployOneYearLockFixture);
        const amount1 = ethers.parseEther("10");
        await expect(contract.start()).not.to.be.reverted;
        await expect(contract.connect(account1).contribute({value: amount1})).not.to.be.reverted;

        await time.increaseTo(deadlineTime);

        await expect(contract.finish()).to.emit(contract, "Withdraw").withArgs(owner.address, amount1);
    });

    it('should emit event on refund', async () => {
        const {contract, account1, deadlineTime} = await loadFixture(deployOneYearLockFixture);
        const amount1 = ethers.parseEther("1");
        await expect(contract.start()).not.to.be.reverted;

        await expect(contract.connect(account1).contribute({value: amount1})).not.to.be.reverted;

        await time.increaseTo(deadlineTime);

        await expect(contract.finish()).to.emit(contract, "Refund").withArgs(account1.address, amount1);
    });
});
