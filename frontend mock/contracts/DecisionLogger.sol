// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DecisionLogger
 * @dev Immutable append-only log of AI agent decisions for transparency and auditability.
 */
contract DecisionLogger {
    struct DecisionLog {
        uint256 agentId;
        bytes32 promptHash;    // Hash of user prompt (privacy-preserving)
        bytes32 planHash;      // Hash of the execution plan
        string mcpSources;     // Delimited string of source IDs
        uint256 timestamp;
        address user;          // User who initiated the request
        bytes32 txHash;        // Reference to the actual execution transaction
    }

    DecisionLog[] public logs;
    mapping(uint256 => uint256[]) public agentToLogs;
    mapping(address => uint256[]) public userToLogs;

    event DecisionRecorded(
        uint256 indexed logId, 
        uint256 indexed agentId, 
        address indexed user, 
        bytes32 promptHash
    );

    /**
     * @dev Records a new decision log. In a live system, this would be restricted 
     * to the Execution contract or authorized agents.
     */
    function recordDecision(
        uint256 agentId,
        bytes32 promptHash,
        bytes32 planHash,
        string calldata mcpSources,
        bytes32 txHash
    ) external returns (uint256) {
        uint256 logId = logs.length;
        
        DecisionLog memory newLog = DecisionLog({
            agentId: agentId,
            promptHash: promptHash,
            planHash: planHash,
            mcpSources: mcpSources,
            timestamp: block.timestamp,
            user: msg.sender,
            txHash: txHash
        });

        logs.push(newLog);
        agentToLogs[agentId].push(logId);
        userToLogs[msg.sender].push(logId);

        emit DecisionRecorded(logId, agentId, msg.sender, promptHash);
        return logId;
    }

    function getLogCount() external view returns (uint256) {
        return logs.length;
    }

    function getLogsByAgent(uint256 agentId) external view returns (uint256[] memory) {
        return agentToLogs[agentId];
    }

    function getLogsByUser(address user) external view returns (uint256[] memory) {
        return userToLogs[user];
    }
}
