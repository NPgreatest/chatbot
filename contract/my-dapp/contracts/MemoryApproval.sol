// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MemoryApproval {
    event Approved(address indexed user);
    event Rejected(address indexed user);

    function approveMemory() external {
        emit Approved(msg.sender);
    }

    function rejectMemory() external {
        emit Rejected(msg.sender);
    }
}
