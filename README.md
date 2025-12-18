# CfxInvoice - On-Chain Invoice System for Freelancers

A decentralized invoice management system built on Conflux eSpace, allowing freelancers to create, manage, and track invoices on the blockchain.

## Features

- ✅ Create invoices with client addresses, amounts, and due dates
- ✅ Track invoice status (Pending, Paid, Overdue, Cancelled)
- ✅ On-chain payment processing
- ✅ Automatic overdue detection
- ✅ View invoices by freelancer or client
- ✅ Secure and transparent invoice management

## Smart Contract Functions

### Core Functions
- `createInvoice()` - Create a new invoice
- `payInvoice()` - Pay an invoice (client only)
- `cancelInvoice()` - Cancel an invoice (freelancer only)
- `markAsOverdue()` - Mark an invoice as overdue

### View Functions
- `getInvoice()` - Get invoice details
- `getFreelancerInvoices()` - Get all invoices for a freelancer
- `getClientInvoices()` - Get all invoices for a client
- `isOverdue()` - Check if an invoice is overdue
- `getTotalInvoices()` - Get total number of invoices

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Conflux eSpace testnet account with CFX for gas fees
- Private key of your deployment account

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CfxInvoice
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```
PRIVATE_KEY=your_private_key_here
```

**⚠️ Important:** Never commit your `.env` file or private key to version control!

## Getting Testnet CFX

Get testnet CFX from the Conflux faucet:
- https://faucet.confluxnetwork.org/

## Compilation

Compile the smart contract:
```bash
npm run compile
```

## Deployment

Deploy to Conflux eSpace Testnet:
```bash
npm run deploy:testnet
```

After deployment, you'll see:
- Contract address
- Network information
- Link to view on ConfluxScan

## Contract Address (Testnet)

After deployment, your contract will be available at the deployed address. You can view it on:
- ConfluxScan Testnet: https://evmtestnet.confluxscan.net/

## Usage Example

### Creating an Invoice
```solidity
// As a freelancer
invoiceSystem.createInvoice(
    clientAddress,
    amountInWei,
    dueDateTimestamp,
    "Invoice description"
);
```

### Paying an Invoice
```solidity
// As a client
invoiceSystem.payInvoice{value: invoiceAmount}(invoiceId);
```

### Viewing Invoices
```solidity
// Get invoice details
Invoice memory invoice = invoiceSystem.getInvoice(invoiceId);

// Get all invoices for a freelancer
uint256[] memory invoices = invoiceSystem.getFreelancerInvoices(freelancerAddress);

// Get all invoices for a client
uint256[] memory invoices = invoiceSystem.getClientInvoices(clientAddress);
```

## Invoice Status

- **Pending**: Invoice created but not yet paid
- **Paid**: Invoice has been paid
- **Overdue**: Invoice past due date and not paid
- **Cancelled**: Invoice cancelled by freelancer

## Security Considerations

- Always verify the contract address before interacting
- Use testnet for testing before mainnet deployment
- Keep your private keys secure
- Review the smart contract code before deployment

## Network Information

### Conflux eSpace Testnet
- RPC URL: `https://evmtestnet.confluxrpc.com`
- Chain ID: `71`
- Explorer: https://evmtestnet.confluxscan.net/
- Faucet: https://faucet.confluxnetwork.org/

### Conflux eSpace Mainnet
- RPC URL: `https://evm.confluxrpc.com`
- Chain ID: `1030`
- Explorer: https://evm.confluxscan.net/

## License

MIT

## Support

For issues or questions, please open an issue on the repository.