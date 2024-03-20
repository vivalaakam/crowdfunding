// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Crowdfunding is Pausable, Ownable {
    address payable public creator;
    address payable[] public contributors;
    mapping(address => uint) public contributions;

    constructor(address initialOwner, address _creator, uint _goal, uint _deadline, string memory _metadata, uint256 _metadataHash) Ownable(initialOwner) {
        creator = payable(_creator);
    }
}
