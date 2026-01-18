import { ethers } from 'ethers';
import { INVOICE_SYSTEM_ABI, INVOICE_SYSTEM_ADDRESS } from './contractABI';
import { Invoice, InvoiceStatus } from './types';

export async function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://evmtestnet.confluxrpc.com';
  return new ethers.JsonRpcProvider(rpcUrl);
}

export async function getContract(signer?: ethers.Signer) {
  const provider = await getProvider();
  const contractProvider = signer || provider;
  
  if (!INVOICE_SYSTEM_ADDRESS) {
    throw new Error(
      'Contract address not set. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your .env.local file.'
    );
  }
  
  return new ethers.Contract(
    INVOICE_SYSTEM_ADDRESS,
    INVOICE_SYSTEM_ABI,
    contractProvider
  );
}

export async function connectWallet(): Promise<ethers.Signer | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask or compatible wallet not found');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
}

export async function switchNetwork() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask or compatible wallet not found');
  }

  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '71';
  const hexChainId = `0x${parseInt(chainId).toString(16)}`;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      // Chain not added, add it
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: hexChainId,
            chainName: 'Conflux eSpace Testnet',
            nativeCurrency: {
              name: 'CFX',
              symbol: 'CFX',
              decimals: 18,
            },
            rpcUrls: ['https://evmtestnet.confluxrpc.com'],
            blockExplorerUrls: ['https://evmtestnet.confluxscan.net/'],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
}

export function parseInvoice(data: any[]): Invoice {
  // Convert status to number if it's a BigNumber or other type
  const statusValue = typeof data[5] === 'bigint' || typeof data[5] === 'object' 
    ? Number(data[5]) 
    : Number(data[5]);
  
  // Ensure status is a valid enum value (0-3)
  const status = statusValue >= 0 && statusValue <= 3 
    ? statusValue as InvoiceStatus 
    : InvoiceStatus.Pending;

  return {
    invoiceId: BigInt(data[0].toString()),
    freelancer: data[1],
    client: data[2],
    amount: BigInt(data[3].toString()),
    dueDate: BigInt(data[4].toString()),
    status: status,
    description: data[6],
    exists: data[7],
    createdAt: BigInt(data[8].toString()),
    paidAt: BigInt(data[9].toString()),
  };
}

export async function payInvoice(invoiceId: bigint, amount: bigint) {
  const signer = await connectWallet();
  if (!signer) throw new Error('Wallet not connected');
  
  const contract = await getContract(signer);
  const tx = await contract.payInvoice(invoiceId, { value: amount });
  await tx.wait();
  return tx;
}

export async function cancelInvoice(invoiceId: bigint) {
  const signer = await connectWallet();
  if (!signer) throw new Error('Wallet not connected');
  
  const contract = await getContract(signer);
  const tx = await contract.cancelInvoice(invoiceId);
  await tx.wait();
  return tx;
}

export async function markAsOverdue(invoiceId: bigint) {
  const signer = await connectWallet();
  if (!signer) throw new Error('Wallet not connected');
  
  const contract = await getContract(signer);
  const tx = await contract.markAsOverdue(invoiceId);
  await tx.wait();
  return tx;
}

export async function createInvoice(
  client: string,
  amount: bigint,
  dueDate: bigint,
  description: string
) {
  const signer = await connectWallet();
  if (!signer) throw new Error('Wallet not connected');
  
  const contract = await getContract(signer);
  const tx = await contract.createInvoice(client, amount, dueDate, description);
  await tx.wait();
  return tx;
}

export async function fetchInvoice(invoiceId: bigint): Promise<Invoice> {
  const contract = await getContract();
  const data = await contract.getInvoice(invoiceId);
  return parseInvoice(data);
}

export async function fetchFreelancerInvoices(address: string): Promise<bigint[]> {
  const contract = await getContract();
  const invoiceIds = await contract.getFreelancerInvoices(address);
  return invoiceIds.map((id: any) => BigInt(id.toString()));
}

export async function fetchClientInvoices(address: string): Promise<bigint[]> {
  const contract = await getContract();
  const invoiceIds = await contract.getClientInvoices(address);
  return invoiceIds.map((id: any) => BigInt(id.toString()));
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

