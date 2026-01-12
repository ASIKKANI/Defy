// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AgentRegistry.sol";
import "./DecisionLogger.sol";
import "./ReputationManager.sol";

/**
 * @title AgentChainHub
 * @dev Central coordinator for the AgentChain system. 
 * Handles execution requests and routes updates to logging and reputation.
 */
contract AgentChainHub {
    AgentRegistry public registry;
    DecisionLogger public logger;
    ReputationManager public reputation;

    event ExecutionTriggered(
        uint256 indexed agentId, 
        address indexed user, 
        bytes32 promptHash,
        bool isConfidential
    );

    constructor(
        address _registry, 
        address _logger, 
        address _reputation
    ) {
        registry = AgentRegistry(_registry);
        logger = DecisionLogger(_logger);
        reputation = ReputationManager(_reputation);
    }

    /**
     * @dev Executes a public agent action.
     */
    function executeAction(
        uint256 agentId,
        bytes32 promptHash,
        bytes32 planHash,
        string calldata mcpSources,
        bytes calldata actionData
    ) external {
        require(registry.isAgentActive(agentId), "Agent not active or approved");

        // 1. Record the intent/decision on-chain
        // In a real scenario, txHash would be generated here or by a relayer
        bytes32 mockTxHash = keccak256(abi.encodePacked(block.timestamp, msg.sender, agentId));
        logger.recordDecision(agentId, promptHash, planHash, mcpSources, mockTxHash);

        // 2. Perform the actual action (Simplified for demo)
        // In reality, this would use (bool success, ) = target.call(actionData);
        bool success = true; 

        // 3. Update reputation
        if (success) {
            reputation.recordSuccess(agentId);
        } else {
            reputation.recordFailure(agentId);
        }

        emit ExecutionTriggered(agentId, msg.sender, promptHash, false);
    }

    /**
     * @dev Mock for Confidential Execution (Transitioning to Inco/FHE)
     * Demonstrates where encrypted parameters would be processed.
     */
    function executeConfidentialAction(
        uint256 agentId,
        bytes32 promptHash,
        bytes32 planHash,
        string calldata mcpSources,
        bytes calldata encryptedParams // CIPHERTEXT for FHE processing
    ) external {
        require(registry.isAgentActive(agentId), "Agent not active or approved");

        // MOCK: Simulate FHE processing
        // Logic: decrypt encryptedParams homomorphically to verify within user limits
        bool privacyCheckPassed = true; 
        require(privacyCheckPassed, "Confidential risk limit exceeded");

        bytes32 mockTxHash = keccak256(abi.encodePacked("confidential", block.timestamp, agentId));
        logger.recordDecision(agentId, promptHash, planHash, mcpSources, mockTxHash);
        
        reputation.recordSuccess(agentId);

        emit ExecutionTriggered(agentId, msg.sender, promptHash, true);
    }
}
