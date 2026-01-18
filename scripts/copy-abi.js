const fs = require('fs');
const path = require('path');

// Read the compiled artifact
const artifactPath = path.join(__dirname, '../artifacts/contracts/InvoiceSystem.sol/InvoiceSystem.json');
const abiOutputPath = path.join(__dirname, '../lib/abi.json');

try {
  // Check if artifact exists
  if (!fs.existsSync(artifactPath)) {
    console.warn('Warning: Artifact file not found. Run "npm run compile" first.');
    process.exit(0);
  }

  // Read and parse the artifact
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  // Extract and write the ABI
  fs.writeFileSync(abiOutputPath, JSON.stringify(artifact.abi, null, 2));
  
  console.log('✅ ABI copied successfully to lib/abi.json');
} catch (error) {
  console.error('Error copying ABI:', error.message);
  process.exit(1);
}

