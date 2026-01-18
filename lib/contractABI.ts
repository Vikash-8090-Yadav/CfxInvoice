// Import ABI from compiled artifacts
// Using a local copy that Next.js can resolve
import abi from './abi.json';

// Export the ABI from the artifact
export const INVOICE_SYSTEM_ABI = abi;

// Export contract address from environment variables
export const INVOICE_SYSTEM_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

