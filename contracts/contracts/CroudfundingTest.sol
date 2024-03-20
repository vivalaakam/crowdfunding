pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdfundingTest is Pausable, Ownable {
    address payable public creator;
    uint public goal;
    uint public deadline;
    mapping(address => uint) public contributions;
    uint public totalContributions;
    CrowdfundingStorage public metadata;

    struct CrowdfundingStorage {
        uint goal;
        uint duration;
        string name;
        string description;
        string preview;
        string[] tags;
    }

    event Contribute(address contributor, uint amount);
    event Refund(address contributor, uint amount);
    event Withdraw(address contributor, uint amount);

    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this function");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline has passed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Deadline has not passed yet");
        _;
    }

    constructor(address initialOwner, address _creator, CrowdfundingStorage memory _metadata) Ownable(initialOwner) {
        creator = payable(_creator);
        goal = _metadata.goal;
        deadline = block.timestamp + _metadata.duration;
        metadata = _metadata;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function contribute() public payable beforeDeadline {
        require(msg.value > 0, "Contribution must be greater than 0");
        contributions[msg.sender] += msg.value;
        totalContributions += msg.value;

        emit Contribute(msg.sender, msg.value);
    }

    function refund() public afterDeadline {
        require(totalContributions < goal, "Goal reached");
        uint amount = contributions[msg.sender];
        require(amount > 0, "No contribution found");
        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit Refund(msg.sender, amount);
    }

    function withdraw() public onlyCreator afterDeadline {
        require(totalContributions >= goal, "Goal not reached");
        uint amount = address(this).balance;
        creator.transfer(amount);

        emit Withdraw(creator, amount);
    }

    function getRemainingTime() public view returns (uint) {
        if (block.timestamp >= deadline) {
            return 0;
        } else {
            return deadline - block.timestamp;
        }
    }
}