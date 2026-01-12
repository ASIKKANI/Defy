// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DecisionLog {
    string public lastDecision;

    function logDecision(string memory _decision) public {
        lastDecision = _decision;
    }
}
