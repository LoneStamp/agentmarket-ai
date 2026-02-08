import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy AgentToken
  console.log("📦 Deploying AgentToken...");
  const AgentToken = await ethers.getContractFactory("AgentToken");
  const token = await AgentToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ AgentToken deployed to:", tokenAddress);

  // Deploy AgentMarketplace
  console.log("\n📦 Deploying AgentMarketplace...");
  const treasuryAddress = deployer.address; // Using deployer as treasury for now
  const buybackAddress = deployer.address; // Using deployer as buyback for now
  
  const AgentMarketplace = await ethers.getContractFactory("AgentMarketplace");
  const marketplace = await AgentMarketplace.deploy(treasuryAddress, buybackAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ AgentMarketplace deployed to:", marketplaceAddress);

  console.log("\n📋 Deployment Summary:");
  console.log("════════════════════════════════════════════════");
  console.log("AgentToken:", tokenAddress);
  console.log("AgentMarketplace:", marketplaceAddress);
  console.log("Treasury Address:", treasuryAddress);
  console.log("Buyback Address:", buybackAddress);
  console.log("════════════════════════════════════════════════");

  console.log("\n📝 Add these to your .env file:");
  console.log(`NEXT_PUBLIC_TOKEN_ADDRESS="${tokenAddress}"`);
  console.log(`NEXT_PUBLIC_MARKETPLACE_ADDRESS="${marketplaceAddress}"`);

  console.log("\n🔍 Verify contracts with:");
  console.log(`npx hardhat verify --network sepolia ${tokenAddress}`);
  console.log(`npx hardhat verify --network sepolia ${marketplaceAddress} ${treasuryAddress} ${buybackAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
