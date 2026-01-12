// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReputationManager
 * @dev Tracks and updates the reputation scores of AI agents based on their performance.
 */
contract ReputationManager is Ownable {
    uint256 public constant INITIAL_SCORE = 50;
    uint256 public constant MAX_SCORE = 100;
    uint256 public constant MIN_SCORE = 0;

    mapping(uint256 => uint256) public agentScores;
    mapping(uint256 => uint256) public successCounts;
    mapping(uint256 => uint256) public failureCounts;
    
    // Authorization: Only the Execution contract or Owner can update scores
    mapping(address => bool) public authorizedUpdaters;

    event ScoreUpdated(uint256 indexed agentId, uint256 newScore);
    event UpdaterStatusChanged(address indexed updater, bool authorized);

    constructor() Ownable(msg.sender) {
        authorizedUpdaters[msg.sender] = true;
    }

    modifier onlyAuthorized() {
        require(authorizedUpdaters[msg.sender], "Not authorized to update reputation");
        _;
    }

    function setUpdater(address updater, bool status) external onlyOwner {
        authorizedUpdaters[updater] = status;
        emit UpdaterStatusChanged(updater, status);
    }

    function initializeAgent(uint256 agentId) external onlyAuthorized {
        if (agentScores[agentId] == 0) {
            agentScores[agentId] = INITIAL_SCORE;
            emit ScoreUpdated(agentId, INITIAL_SCORE);
        }
    }

    /**
     * @dev Updates scores based on success. 
     * Logic: +1 score for every 10 successes.
     */
    function recordSuccess(uint256 agentId) external onlyAuthorized {
        successCounts[agentId]++;
        
        if (successCounts[agentId] % 10 == 0) {
            if (agentScores[agentId] < MAX_SCORE) {
                agentScores[agentId]++;
                emit ScoreUpdated(agentId, agentScores[agentId]);
            }
        }
    }

    /**
     * @dev Updates scores based on failure.
     * Logic: -5 score for a single failure.
     */
    function recordFailure(uint256 agentId) external onlyAuthorized {
        failureCounts[agentId]++;
        
        uint256 penalty = 5;
        if (agentScores[agentId] > penalty) {
            agentScores[agentId] -= penalty;
        } else {
            agentScores[agentId] = MIN_SCORE;
        }
        
        emit ScoreUpdated(agentId, agentScores[agentId]);
    }

    /**
     * @dev Severe penalty for malicious behavior reported by Governance.
     */
    function slashAgent(uint256 agentId) external onlyOwner {
        agentScores[agentId] = MIN_SCORE;
        emit ScoreUpdated(agentId, MIN_SCORE);
    }

    function getReputation(uint256 agentId) external view returns (uint256) {
        uint256 score = agentScores[agentId];
        return score == 0 ? INITIAL_SCORE : score;
    }
}
