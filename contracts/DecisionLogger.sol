// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DecisionLogger
 * @dev Logs agent decisions. Updated to support Inco Lightning for confidential logging.
 * 
 * To fully enable Inco Lightning:
 * 1. npm install @inco/lightning
 * 2. Inherit from Fee
 * 3. Use e.newEuint256 to handle encrypted inputs
 */
// import {euint256, e, inco} from "@inco/lightning/src/Lib.sol";
// import {Fee} from "@inco/lightning/src/lightning-parts/Fee.sol";

interface IAgentAllowlist {
    function isAllowed(address agent) external view returns (bool);
}

contract DecisionLogger {
    IAgentAllowlist public allowlist;

    event DecisionLogged(
        address indexed agent, 
        string thought, 
        string decision, 
        bytes toolParams,
        uint256 timestamp
    );

    // Event for storing confidential decision handles from Inco
    event ConfidentialDecisionLogged(
        address indexed agent,
        bytes encryptedDecisionHandle,
        uint256 timestamp
    );

    constructor(address _allowlist) {
        allowlist = IAgentAllowlist(_allowlist);
    }

    /**
     * @dev Standard public logging
     */
    function logDecision(
        string memory thought, 
        string memory decision, 
        bytes memory toolParams
    ) external {
        emit DecisionLogged(msg.sender, thought, decision, toolParams, block.timestamp);
    }

    /**
     * @dev Confidential logging using Inco Lightning
     * Stores the encrypted thought/intent handle.
     * Only the owner of the handle (msg.sender) can request decryption via Inco.
     */
    function logConfidentialDecision(
        bytes memory encryptedThought
    ) external payable {
        // Inco Lightning handles are typically passed as bytes
        emit ConfidentialDecisionLogged(msg.sender, encryptedThought, block.timestamp);
    }

}

