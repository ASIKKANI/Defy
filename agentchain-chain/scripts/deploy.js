async function main() {
    const [deployer] = await ethers.getSigners();
    const gasPrice = (await ethers.provider.getFeeData()).gasPrice;
    console.log("Current gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");

    const AgentChain = await ethers.getContractFactory("AgentChain");
    const deployTx = await AgentChain.getDeployTransaction();
    const gasEstimate = await ethers.provider.estimateGas(deployTx);
    console.log("Estimated gas limit:", gasEstimate.toString());

    const totalCost = gasPrice * gasEstimate;
    console.log("Estimated total cost:", ethers.formatEther(totalCost), "SHM");

    const agentChain = await AgentChain.deploy();
    await agentChain.waitForDeployment();

    const address = await agentChain.getAddress();
    console.log("AgentChain deployed to:", address);

    // Initial Agents Setup (DAO approved for demo)
    console.log("Setting up initial agents...");

    const agents = [
        {
            name: "Quant Sentinel",
            desc: "Advanced crypto market analyzer and risk evaluator.",
            caps: "Market Analysis, Arbitrage Detection, Risk Assessment"
        },
        {
            name: "Governance Sage",
            desc: "Specializes in DAO proposal analysis and voting patterns.",
            caps: "Proposal Auditing, Voting Strategy, treasury Tracking"
        },
        {
            name: "Nexus executor",
            desc: "Autonomous cross-chain execution and swap optimizer.",
            caps: "DEX Aggregation, Bridge Optimization, MEV Protection"
        }
    ];

    for (const agent of agents) {
        const tx = await agentChain.proposeAgent(agent.name, agent.desc, agent.caps);
        await tx.wait();

        // Auto-approve for demo purposes
        const agentId = agents.indexOf(agent) + 1;
        const approveTx = await agentChain.approveAgent(agentId);
        await approveTx.wait();
        console.log(`Agent ${agent.name} approved with ID ${agentId}`);
    }

    console.log("Deployment and initial setup complete!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
