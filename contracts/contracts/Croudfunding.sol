// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Crowdfunding is Pausable, Ownable {
    address payable public creator;
    mapping(address => uint) public contributions;
    address payable[] public contributors;
    Info public info;
    State public state;

    struct Info {
        uint goal;
        uint current;
        uint deadline;
        string metadata;
        uint256 metadataHash;
    }

    enum State {Verifying, Rejected, Fundraising, Expired, Successful}

    event Contribute(address contributor, uint amount);
    event Refund(address contributor, uint amount);
    event Withdraw(address contributor, uint amount);
    event StateChanged(State state);

    modifier beforeDeadline() {
        require(block.timestamp < info.deadline, "Deadline has passed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= info.deadline, "Deadline has not passed yet");
        _;
    }

    constructor(address initialOwner, address _creator, uint _goal, uint _deadline, string memory _metadata, uint256 _metadataHash) Ownable(initialOwner) {
        creator = payable(_creator);

        info = Info({
            goal: _goal,
            current: 0,
            deadline: _deadline,
            metadata: _metadata,
            metadataHash: _metadataHash
        });

        state = State.Verifying;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function start() public onlyOwner whenNotPaused {
        require(state == State.Verifying, "Crowdfunding is not in verifying state");
        state = State.Fundraising;
        emit StateChanged(state);
    }

    function contribute() public payable beforeDeadline whenNotPaused {
        require(state == State.Fundraising, "Crowdfunding is not in fundraising state");
        require(msg.value > 0, "Contribution must be greater than 0");

        if (contributions[msg.sender] == 0) {
            contributors.push(payable(msg.sender));
        }

        contributions[msg.sender] += msg.value;
        info.current += msg.value;

        emit Contribute(msg.sender, msg.value);
    }

    function finish() public onlyOwner whenNotPaused afterDeadline {
        require(state == State.Fundraising, "Crowdfunding is not in fundraising state");
        if (info.current >= info.goal) {
            state = State.Successful;
            _withdraw();
        } else {
            state = State.Expired;
            _refund();
        }
        emit StateChanged(state);
    }

    function _refund() private onlyOwner {
        for (uint i = 0; i < contributors.length; i++) {
            address payable contributor = contributors[i];
            uint amount = contributions[contributor];
            contributions[contributor] = 0;
            contributor.transfer(amount);

            emit Refund(contributor, amount);
        }
    }

    function _withdraw() private onlyOwner {
        uint amount = address(this).balance;
        creator.transfer(amount);

        emit Withdraw(creator, amount);
    }

    function getRemainingTime() public view returns (uint) {
        if (block.timestamp >= info.deadline) {
            return 0;
        } else {
            return info.deadline - block.timestamp;
        }
    }
}


contract CrowdfundingList is Initializable, PausableUpgradeable, OwnableUpgradeable {
    mapping(address => Crowdfunding) public crowdfunding;
    address[] public activeCrowdfundingArray;
    address[] public rejectingCrowdfundingArray;
    address[] public verifyingCrowdfundingArray;
    address[] public finishedCrowdfundingArray;

    struct CrowdfundingInfo {
        address id;
        address payable creator;
        uint userAmount;
        Crowdfunding.Info info;        
    }

    event CrowdfundingCreated(address crowdfunding, address creator, uint goal, uint deadline, string metadata);
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) initializer public {
        __Pausable_init();
        __Ownable_init(initialOwner);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function getActive(address _participant) public view returns (CrowdfundingInfo[] memory) {
        return _format(activeCrowdfundingArray, _participant);
    }

    function getVerifying() public view returns (CrowdfundingInfo[] memory) {
        return _format(verifyingCrowdfundingArray, address(0));
    }

    function getFinished(address _participant) public view returns (CrowdfundingInfo[] memory) {
        return _format(finishedCrowdfundingArray, _participant);
    }

    function _format(address[] storage list, address _participant) private view returns (CrowdfundingInfo[] memory) {
        CrowdfundingInfo[] memory result = new CrowdfundingInfo[](list.length);
        for (uint i = 0; i < list.length; i++) {
            ( uint goal , uint current , uint deadline, string memory  metadata , uint256 metadataHash ) = crowdfunding[list[i]].info();

            result[i] = CrowdfundingInfo(
                list[i],
                crowdfunding[list[i]].creator(),
                crowdfunding[list[i]].contributions(_participant),
                Crowdfunding.Info({
                    goal: goal,
                    current: current,
                    deadline: deadline,
                    metadata: metadata,
                    metadataHash: metadataHash
                })
            );
        }
        return result;
    }

    function create(uint _goal, uint _duration, string memory _metadata, uint256 _metadataHash) external whenNotPaused returns (address)  {
        Crowdfunding crowdfundingContract = new Crowdfunding(address(this), msg.sender, _goal, _duration, _metadata, _metadataHash);
        address crowdfundingAddress = address(crowdfundingContract);
        crowdfunding[crowdfundingAddress] = crowdfundingContract;
        verifyingCrowdfundingArray.push(crowdfundingAddress);

        emit CrowdfundingCreated(crowdfundingAddress, msg.sender, _goal, _duration, _metadata);
        return crowdfundingAddress;
    }

    function start(address _crowdfunding) public onlyOwner whenNotPaused {
        Crowdfunding crowdfundingContract = Crowdfunding(_crowdfunding);
        crowdfundingContract.start();
        if (crowdfundingContract.state() == Crowdfunding.State.Fundraising) {
            _removeFromArray(verifyingCrowdfundingArray, _crowdfunding);
            activeCrowdfundingArray.push(_crowdfunding);
        }
    }

    function reject(address _crowdfunding) public onlyOwner whenNotPaused {
        Crowdfunding crowdfundingContract = Crowdfunding(_crowdfunding);
        crowdfundingContract.pause();
        if (crowdfundingContract.state() == Crowdfunding.State.Verifying) {
            _removeFromArray(verifyingCrowdfundingArray, _crowdfunding);
            rejectingCrowdfundingArray.push(_crowdfunding);
        }
    }

    function finish(address _crowdfunding) public onlyOwner whenNotPaused {
        Crowdfunding crowdfundingContract = Crowdfunding(_crowdfunding);
        crowdfundingContract.finish();
        if (crowdfundingContract.state() == Crowdfunding.State.Successful || crowdfundingContract.state() == Crowdfunding.State.Expired) {
            _removeFromArray(activeCrowdfundingArray, _crowdfunding);
            finishedCrowdfundingArray.push(_crowdfunding);
        }
    }

    function _removeFromArray(address[] storage array, address item) private {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == item) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }
}
