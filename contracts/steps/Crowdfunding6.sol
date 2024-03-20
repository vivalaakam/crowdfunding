...
contract Crowdfunding is Pausable, Ownable {
    ...
    function finish() public onlyOwner whenNotPaused afterDeadline {
        require(state == State.Fundraising, "Crowdfunding is not in fundraising state");
        if (totalContributions >= goal) {
            state = State.Successful;
            _withdraw();
        }

        emit StateChanged(state);
    }

    function _withdraw() private onlyOwner {
        uint amount = address(this).balance;
        creator.transfer(amount);

        emit Withdraw(creator, amount);
    }
}