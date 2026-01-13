// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentAllowlist {
    address public owner;
    mapping(address => bool) public allowedAgents;

    event AgentAdded(address indexed agent);
    event AgentRemoved(address indexed agent);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addAgent(address _agent) external onlyOwner {
        allowedAgents[_agent] = true;
        emit AgentAdded(_agent);
    }

    function removeAgent(address _agent) external onlyOwner {
        allowedAgents[_agent] = false;
        emit AgentRemoved(_agent);
    }

    function isAllowed(address _agent) external view returns (bool) {
        return allowedAgents[_agent];
    }
}
