const hre = require("hardhat");

async function main() {
  console.log("Deploying InvoiceSystem to Conflux eSpace Testnet...");

  // Get the contract factory
  const InvoiceSystem = await hre.ethers.getContractFactory("InvoiceSystem");

  // Deploy the contract
  console.log("Deploying contract...");
  const invoiceSystem = await InvoiceSystem.deploy();

  // Wait for deployment
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
    deployer: (await hre.ethers.getSigners())[0].address,
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

