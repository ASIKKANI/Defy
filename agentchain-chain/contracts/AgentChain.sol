// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgentChain {
    struct Agent {
        uint256 id;
        string name;
        string description;
        string capabilities;
        uint256 reputation;
        bool isApproved;
        address proposer;
    }

    struct ExecutionLog {
        uint256 agentId;
        string promptSummary;
        string resultHash; // IPFS hash or reasoning summary
        bool isSuccess;
        uint256 timestamp;
        address user;
    }

    address public owner;
    uint256 public agentCount;
    mapping(uint256 => Agent) public agents;
    ExecutionLog[] public logs;

    event AgentProposed(uint256 indexed id, string name, address proposer);
    event AgentApproved(uint256 indexed id);
    event DecisionLogged(uint256 indexed agentId, address indexed user, string resultHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function proposeAgent(string memory _name, string memory _description, string memory _capabilities) public {
        agentCount++;
        agents[agentCount] = Agent({
            id: agentCount,
            name: _name,
            description: _description,
            capabilities: _capabilities,
            reputation: 100, // Initial reputation
            isApproved: false,
            proposer: msg.sender
        });
        emit AgentProposed(agentCount, _name, msg.sender);
    }

    function approveAgent(uint256 _id) public onlyOwner {
        require(_id > 0 && _id <= agentCount, "Invalid agent ID");
        agents[_id].isApproved = true;
        emit AgentApproved(_id);
    }

    function logExecution(uint256 _agentId, string memory _promptSummary, string memory _resultHash, bool _isSuccess) public payable {
        require(agents[_agentId].isApproved, "Agent not approved by DAO");
        
        logs.push(ExecutionLog({
            agentId: _agentId,
            promptSummary: _promptSummary,
            resultHash: _resultHash,
            isSuccess: _isSuccess,
            timestamp: block.timestamp,
            user: msg.sender
        }));

        // Adjust reputation slightly based on success (very simple model)
        if (_isSuccess) {
            agents[_agentId].reputation += 1;
        } else if (agents[_agentId].reputation > 0) {
            agents[_agentId].reputation -= 1;
        }

        emit DecisionLogged(_agentId, msg.sender, _resultHash);
    }

    mapping(address => uint256) public virtualETHBalance;

    event SwapExecuted(address indexed user, uint256 shmAmount, uint256 ethAmount);

    // AI-Triggered Swap (Real Value Transfer)
    function executeSwap(uint256 _agentId) public payable {
        require(agents[_agentId].isApproved, "Agent not approved");
        require(msg.value > 0, "Amount must be > 0");

        // Mock exchange rate: 1000 SHM = 1 aETH (for demo purposes)
        uint256 ethAmount = msg.value / 1000;
        virtualETHBalance[msg.sender] += ethAmount;

        // Automatically log the decision on-chain
        logExecution(_agentId, "SHM to aETH Swap", "AI_EXECUTION_FINANCIAL", true);

        emit SwapExecuted(msg.sender, msg.value, ethAmount);
    }

    function getVirtualBalance(address _user) public view returns (uint256) {
        return virtualETHBalance[_user];
    }

    function getLogsCount() public view returns (uint256) {
        return logs.length;
    }

    function getAgent(uint256 _id) public view returns (Agent memory) {
        return agents[_id];
    }
}
