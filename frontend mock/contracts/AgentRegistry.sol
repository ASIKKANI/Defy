// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentRegistry
 * @dev Manages the registration and approval status of AI agents within the AgentChain ecosystem.
 */
contract AgentRegistry is Ownable {
    struct Agent {
        uint256 id;
        address owner;         // Developer wallet
        string metadataCID;    // IPFS hash (Name, Purpose, Icon)
        uint8 riskLevel;       // 1=Low, 2=Med, 3=High
        bool isActive;         // Toggled by Governance/Owner
        uint256 registeredAt;
    }

    uint256 private _nextAgentId = 1;
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256[]) public ownerToAgents;

    event AgentRegistered(uint256 indexed id, address indexed owner, string metadataCID);
    event AgentStatusUpdated(uint256 indexed id, bool isActive);
    event AgentMetadataUpdated(uint256 indexed id, string newMetadataCID);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Registers a new agent. Initially inactive until approved by governance/owner.
     */
    function registerAgent(string calldata metadataCID, uint8 riskLevel) external returns (uint256) {
        require(riskLevel >= 1 && riskLevel <= 3, "Invalid risk level");
        
        uint256 agentId = _nextAgentId++;
        agents[agentId] = Agent({
            id: agentId,
            owner: msg.sender,
            metadataCID: metadataCID,
            riskLevel: riskLevel,
            isActive: false, // Default to inactive
            registeredAt: block.timestamp
        });

        ownerToAgents[msg.sender].push(agentId);

        emit AgentRegistered(agentId, msg.sender, metadataCID);
        return agentId;
    }

    /**
     * @dev Updates the active status of an agent. In a full implementation, this 
     * would be restricted to a Governance contract.
     */
    function setAgentStatus(uint256 agentId, bool isActive) external onlyOwner {
        require(agents[agentId].id != 0, "Agent does not exist");
        agents[agentId].isActive = isActive;
        emit AgentStatusUpdated(agentId, isActive);
    }

    /**
     * @dev Allows agent owners to update their metadata (e.g., description, icon).
     */
    function updateMetadata(uint256 agentId, string calldata newMetadataCID) external {
        require(agents[agentId].owner == msg.sender, "Not the agent owner");
        agents[agentId].metadataCID = newMetadataCID;
        emit AgentMetadataUpdated(agentId, newMetadataCID);
    }

    function isAgentActive(uint256 agentId) external view returns (bool) {
        return agents[agentId].isActive;
    }

    function getAgent(uint256 agentId) external view returns (Agent memory) {
        require(agents[agentId].id != 0, "Agent does not exist");
        return agents[agentId];
    }
}
