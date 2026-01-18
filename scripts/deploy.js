const hre = require("hardhat");

async function main() {
  console.log("Deploying InvoiceSystem to Conflux eSpace Testnet...");

  // Get signers
  const signers = await hre.ethers.getSigners();
  
  if (signers.length === 0) {
    throw new Error(
      "No signers found. Please ensure PRIVATE_KEY is set in your .env file for the network."
    );
  }

  const deployer = signers[0];
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "CFX");

  if (balance === 0n) {
    console.warn("⚠️  Warning: Account balance is 0. You may need CFX for gas fees.");
  }

  // Get current gas price from the network
  const feeData = await hre.ethers.provider.getFeeData();
  const networkGasPrice = feeData.gasPrice || 0n;
  const minGasPrice = hre.ethers.parseUnits("5", "gwei"); // Minimum 5 gwei for Conflux
  
  console.log("Network gas price:", hre.ethers.formatUnits(networkGasPrice, "gwei"), "gwei");
  
  // Use the higher of network gas price or minimum (5 gwei)
  const gasPrice = networkGasPrice > 0n && networkGasPrice > minGasPrice
    ? networkGasPrice 
    : minGasPrice;
  
  console.log("Using gas price:", hre.ethers.formatUnits(gasPrice, "gwei"), "gwei");
  
  // Get the contract factory - this should automatically use the first signer
  console.log("Getting contract factory...");
  const InvoiceSystem = await hre.ethers.getContractFactory("InvoiceSystem");

  // Deploy the contract with specified gas price
  console.log("Deploying contract...");
  const invoiceSystem = await InvoiceSystem.deploy({
    gasPrice: gasPrice,
  });

  // Wait for deployment
  console.log("Waiting for deployment confirmation...");
  await invoiceSystem.waitForDeployment();

  const address = await invoiceSystem.getAddress();
  console.log("\n✅ InvoiceSystem deployed successfully!");
  console.log("Contract address:", address);
  console.log("Network:", hre.network.name);
  console.log("\nYou can verify the contract on ConfluxScan:");
  console.log(`https://evmtestnet.confluxscan.net/address/${address}`);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

