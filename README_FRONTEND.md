# CfxInvoice Frontend - Next.js Application

This is the frontend application for the CfxInvoice decentralized invoice management system, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Wallet Integration**: Connect with MetaMask or compatible Web3 wallets
- 📝 **Create Invoices**: Freelancers can create new invoices on-chain
- 💰 **Pay Invoices**: Clients can pay invoices directly from the app
- 📊 **View Invoices**: View all sent and received invoices
- ✅ **Invoice Management**: Cancel, mark as overdue, and track invoice status
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Contract deployed to Conflux eSpace (testnet or mainnet)
- Contract address configured in environment variables

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address_here
NEXT_PUBLIC_RPC_URL=https://evmtestnet.confluxrpc.com
NEXT_PUBLIC_CHAIN_ID=71
```

**Note**: Replace `your_deployed_contract_address_here` with your actual deployed contract address.

3. Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Configuration

### Contract Address

After deploying your smart contract using Hardhat, copy the contract address and add it to `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### Network Configuration

The app is configured for Conflux eSpace Testnet by default. To use mainnet, update `.env.local`:

```env
NEXT_PUBLIC_RPC_URL=https://evm.confluxrpc.com
NEXT_PUBLIC_CHAIN_ID=1030
```

## Usage

### 1. Connect Wallet

- Click "Connect Wallet" button
- Approve the connection in MetaMask
- The app will automatically switch to Conflux eSpace network

### 2. Create Invoice

- Navigate to "Create Invoice" page
- Fill in the form:
  - **Client Address**: The wallet address of the client
  - **Amount (CFX)**: The invoice amount in CFX
  - **Due Date**: When the invoice is due
  - **Description**: Invoice description/details
- Click "Create Invoice" and confirm the transaction

### 3. View Invoices

- Go to "My Invoices" page
- Filter by:
  - **All Invoices**: All invoices you're involved in
  - **Sent (As Freelancer)**: Invoices you created
  - **Received (As Client)**: Invoices sent to you

### 4. Pay Invoice

- As a client, find the invoice in "Received (As Client)"
- Click "Pay Invoice" button
- Confirm the transaction in MetaMask
- The payment will be sent directly to the freelancer

### 5. Manage Invoices

- **Cancel Invoice**: Freelancers can cancel pending or overdue invoices
- **Mark as Overdue**: Anyone can mark a pending invoice as overdue after the due date

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── create/            # Create invoice page
│   ├── invoices/          # View invoices page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── WalletProvider.tsx # Wallet context provider
│   ├── Navbar.tsx         # Navigation component
│   └── InvoiceCard.tsx    # Invoice card component
├── lib/                   # Utilities and contract interaction
│   ├── contract.ts        # Contract interaction functions
│   ├── contractABI.ts     # Contract ABI
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── contracts/             # Smart contracts
├── scripts/               # Deployment scripts
└── public/                # Static assets
```

## Building for Production

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Troubleshooting

### Wallet Connection Issues

- Make sure MetaMask or compatible wallet is installed
- Check that the wallet is unlocked
- Verify network connection

### Contract Interaction Errors

- Verify contract address in `.env.local`
- Ensure contract is deployed to the correct network
- Check that you have sufficient CFX for gas fees

### Network Issues

- The app will automatically prompt to add Conflux eSpace network if not present
- If network switch fails, manually add the network in MetaMask:
  - Network Name: Conflux eSpace Testnet
  - RPC URL: https://evmtestnet.confluxrpc.com
  - Chain ID: 71
  - Currency Symbol: CFX
  - Block Explorer: https://evmtestnet.confluxscan.net/

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Ethers.js v6**: Ethereum library for Web3 interactions
- **Hardhat**: Smart contract development framework

## License

MIT

