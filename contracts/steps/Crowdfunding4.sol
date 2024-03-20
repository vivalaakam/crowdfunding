...
contract Crowdfunding is Pausable, Ownable {
    ...
    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline has passed");
        _;
    }
    ...
    function contribute() public payable beforeDeadline whenNotPaused {
        require(state == State.Fundraising, "Crowdfunding is not in fundraising state");
        require(msg.value > 0, "Contribution must be greater than 0");

        if (contributions[msg.sender] == 0) {
            contributors.push(payable(msg.sender));
        }

        contributions[msg.sender] += msg.value;
        totalContributions += msg.value;
    }
}

