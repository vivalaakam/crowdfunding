import {ethers, upgrades} from "hardhat";

describe("CrowdfundingList", function () {
    async function deployOneYearLockFixture() {
        const [owner, account1, account2, account3] = await ethers.getSigners();

        const Crowdfunding = await ethers.getContractFactory("CrowdfundingTest");
        const contract = await upgrades.deployProxy(Crowdfunding, [owner.address]);

        return {contract, owner, account1, account2, account3};
    }

    it("should create text contract crowdfunding", async () => {
        const [owner, account1, account2, account3] = await ethers.getSigners();

        const Crowdfunding = await ethers.getContractFactory("CrowdfundingTest");


        const struct = {
            goal: ethers.parseEther("10"),
            duration: 60 * 60,
            name: "Test",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mollis dictum rhoncus. Ut convallis elementum rutrum. Curabitur commodo libero id auctor blandit. Sed sapien elit, eleifend eget ex a, dignissim ullamcorper diam. Nunc et maximus neque. Morbi vulputate justo id augue gravida, ut mattis ipsum efficitur. Donec ut volutpat dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nPhasellus sit amet hendrerit ligula, quis vulputate est. Cras sagittis mollis purus, nec faucibus nibh finibus in. Proin rutrum pharetra augue, sit amet porta sem placerat non. Curabitur et neque maximus ex semper convallis id sit amet diam. Nam pretium arcu at neque dignissim, id ornare elit gravida. Aliquam suscipit tempus risus id imperdiet. Phasellus et mi eget quam rhoncus egestas sed vitae velit. Cras odio lacus, molestie et lacus vitae, ultrices convallis ex. Mauris nisl ex, tincidunt a arcu at, ultricies auctor urna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque ac enim elementum, faucibus lorem nec, vehicula arcu. Proin eget ante ut tellus efficitur convallis. Aliquam rutrum sapien id quam interdum tempus. Quisque at vehicula dui.\n\nIn et est lacinia, aliquam magna vel, ultrices mauris. Sed venenatis, nunc sed tempor tempus, ipsum turpis interdum neque, ut facilisis ipsum leo id dui. Curabitur accumsan vehicula venenatis. Phasellus tempor ante ut leo accumsan vestibulum. Cras vitae viverra dui, eget volutpat velit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus accumsan turpis congue enim elementum, vitae consequat erat sagittis. Cras fermentum dictum eros, et vestibulum nibh mollis ut.\n\nInteger blandit ipsum eu lacinia tincidunt. Vestibulum libero orci, consectetur vel mauris id, imperdiet imperdiet eros. Donec quis blandit orci, non elementum dui. Aliquam sollicitudin semper ullamcorper. Morbi vel ipsum arcu. Praesent et suscipit magna. Praesent lobortis ultrices sem, et eleifend velit bibendum nec.\n\nSed nulla libero, lobortis sed dignissim vitae, imperdiet sit amet dui. Donec ante ante, mollis quis ipsum ut, rhoncus mattis nisi. Etiam hendrerit lorem eu bibendum vulputate. Praesent mattis ullamcorper pellentesque. Sed vel enim dignissim, mattis quam id, viverra orci. Nullam hendrerit, metus non ultricies malesuada, turpis nunc pulvinar dui, quis tincidunt leo ligula non mauris. Cras ornare nulla id odio tincidunt, vitae consectetur est eleifend. Etiam varius felis id metus lacinia volutpat. Suspendisse potenti. Etiam pharetra luctus vestibulum.",
            preview: "Test",
            tags: ["tag1", "tag2"]
        }
        const contract = await Crowdfunding.deploy(owner.address, owner.address, struct);

    });
});
