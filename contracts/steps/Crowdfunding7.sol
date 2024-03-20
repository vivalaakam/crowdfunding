contract CrowdfundingList is Initializable, PausableUpgradeable, OwnableUpgradeable {
    ...

    function create(uint _goal, uint _duration, string memory _metadata, uint256 _metadataHash) external whenNotPaused returns (address)  {
        Crowdfunding crowdfundingContract = new Crowdfunding(address(this), msg.sender, _goal, _duration, _metadata, _metadataHash);
        address crowdfundingAddress = address(crowdfundingContract);
        crowdfunding[crowdfundingAddress] = crowdfundingContract;
        verifyingCrowdfundingArray.push(crowdfundingAddress);

        emit CrowdfundingCreated(crowdfundingAddress, msg.sender, _goal, _duration, _metadata);
        return crowdfundingAddress;
    }
}
