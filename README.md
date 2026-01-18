# CfxInvoice - On-Chain Invoice System for Freelancers

A decentralized invoice management system built on Conflux eSpace, allowing freelancers to create, manage, and track invoices on the blockchain.

## Features

### Smart Contract
- ✅ Create invoices with client addresses, amounts, and due dates
- ✅ Track invoice status (Pending, Paid, Overdue, Cancelled)
- ✅ On-chain payment processing
- ✅ Automatic overdue detection
- ✅ View invoices by freelancer or client
- ✅ Secure and transparent invoice management

### Frontend (Next.js)
- 🔐 Wallet Integration with MetaMask
- 📝 Create invoices through intuitive UI
- 💰 Pay invoices directly from the app
- 📊 View and filter invoices (sent/received)
- ✅ Manage invoices (cancel, mark overdue)
- 🎨 Modern, responsive design with Tailwind CSS

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

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CfxInvoice
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

#### For Smart Contract Deployment
Create a `.env` file in the root directory:
```
PRIVATE_KEY=your_private_key_here
```

#### For Frontend Application
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address_here
NEXT_PUBLIC_RPC_URL=https://evmtestnet.confluxrpc.com
NEXT_PUBLIC_CHAIN_ID=71
```

**⚠️ Important:** Never commit your `.env` or `.env.local` files or private keys to version control!

## Getting Testnet CFX

Get testnet CFX from the Conflux faucet:
- https://faucet.confluxnetwork.org/

## Compilation

Compile the smart contract:
```bash
npm run compile
```

## Deployment

### Deploy Smart Contract

Deploy to Conflux eSpace Testnet:
```bash
npm run compile
npm run deploy:testnet
```

After deployment, you'll see:
- Contract address
- Network information
- Link to view on ConfluxScan

**Important:** Copy the contract address and add it to your `.env.local` file as `NEXT_PUBLIC_CONTRACT_ADDRESS`.

### Run Frontend Application

1. Make sure you have deployed the contract and set the contract address in `.env.local`

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Connect your MetaMask wallet (ensure you're on Conflux eSpace Testnet)

## Project Structure

```
CfxInvoice/
├── app/                    # Next.js frontend (App Router)
│   ├── page.tsx           # Home page
│   ├── create/            # Create invoice page
│   ├── invoices/          # View invoices page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── WalletProvider.tsx # Wallet context
│   ├── Navbar.tsx         # Navigation
│   └── InvoiceCard.tsx    # Invoice card component
├── contracts/             # Smart contracts
│   └── InvoiceSystem.sol  # Main contract
├── lib/                   # Utilities
│   ├── contract.ts        # Contract interaction
│   ├── contractABI.ts     # Contract ABI
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── scripts/               # Deployment scripts
│   └── deploy.js          # Contract deployment
└── README_FRONTEND.md     # Detailed frontend documentation
```

## Contract Address (Testnet)

After deployment, your contract will be available at the deployed address. You can view it on:
- ConfluxScan Testnet: https://evmtestnet.confluxscan.net/

**Remember to add the contract address to `.env.local` for the frontend to work!**

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

## Frontend Documentation

For detailed frontend documentation, see [README_FRONTEND.md](./README_FRONTEND.md)

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js application for production
- `npm start` - Start Next.js production server
- `npm run compile` - Compile smart contracts
- `npm run deploy:testnet` - Deploy contract to Conflux eSpace Testnet
- `npm test` - Run tests (if available)

## Support

For issues or questions, please open an issue on the repository.