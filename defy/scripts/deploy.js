import hre from "hardhat";

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // 1. Deploy Allowlist
    const AgentAllowlist = await hre.ethers.getContractFactory("AgentAllowlist");
    const allowlist = await AgentAllowlist.deploy();
    await allowlist.waitForDeployment();
    const allowlistAddr = await allowlist.getAddress();
    console.log("AgentAllowlist deployed to:", allowlistAddr);

    // 2. Deploy DecisionLogger
    const DecisionLogger = await hre.ethers.getContractFactory("DecisionLogger");
    const logger = await DecisionLogger.deploy(allowlistAddr);
    await logger.waitForDeployment();
    const loggerAddr = await logger.getAddress();
    console.log("DecisionLogger deployed to:", loggerAddr);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
