contract Crowdfunding is Pausable, Ownable {
    ...
    Info public info;

    struct Info {
        uint goal;
        uint current;
        uint deadline;
        string metadata;
        uint256 metadataHash;
    }

    constructor(address initialOwner, address _creator, uint _goal, uint _deadline, string memory _metadata, uint256 _metadataHash) Ownable(initialOwner) {
        ...
        info = Info({
            goal: _goal,
            current: 0,
            deadline: _deadline,
            metadata: _metadata,
            metadataHash: _metadataHash
        });
    }
}