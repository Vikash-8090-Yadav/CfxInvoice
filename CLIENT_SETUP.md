# Client Setup Guide - CfxInvoice

This guide is for the client to set up and run the CfxInvoice application.

## Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   
   Create a file named `.env.local` in the root directory:
   
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
   NEXT_PUBLIC_RPC_URL=https://evmtestnet.confluxrpc.com
   NEXT_PUBLIC_CHAIN_ID=71
   ```
   
   **Important:** Replace `your_contract_address_here` with the actual deployed contract address provided by the developer.

3. **Copy Contract ABI:**
   ```bash
   npm run copy:abi
   ```
   
   This copies the contract ABI from compiled artifacts.

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run compile` - Compile smart contracts (if needed)
- `npm run copy:abi` - Copy contract ABI from artifacts

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address | `0x1234...5678` |
| `NEXT_PUBLIC_RPC_URL` | Conflux RPC endpoint | `https://evmtestnet.confluxrpc.com` |
| `NEXT_PUBLIC_CHAIN_ID` | Network chain ID | `71` (testnet) or `1030` (mainnet) |

### Network Configuration

**Testnet:**
```env
NEXT_PUBLIC_RPC_URL=https://evmtestnet.confluxrpc.com
NEXT_PUBLIC_CHAIN_ID=71
```

**Mainnet:**
```env
NEXT_PUBLIC_RPC_URL=https://evm.confluxrpc.com
NEXT_PUBLIC_CHAIN_ID=1030
```

## Troubleshooting

### "Contract address not set" Error

- Make sure `.env.local` file exists in the root directory
- Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is set correctly
- Restart the development server after changing `.env.local`

### Wallet Connection Issues

- Ensure MetaMask or compatible wallet is installed
- Make sure wallet is unlocked
- Check that you're connected to the correct network (Conflux eSpace Testnet/Mainnet)

### ABI Import Errors

- Run `npm run compile` to compile contracts
- Run `npm run copy:abi` to copy the ABI
- Make sure `artifacts` folder exists with compiled contracts

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

## Support

If you encounter any issues:

1. Check the error messages in the browser console
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Contact the development team for support

## Network Information

### Conflux eSpace Testnet
- **RPC URL:** https://evmtestnet.confluxrpc.com
- **Chain ID:** 71
- **Explorer:** https://evmtestnet.confluxscan.net/
- **Faucet:** https://faucet.confluxnetwork.org/

### Conflux eSpace Mainnet
- **RPC URL:** https://evm.confluxrpc.com
- **Chain ID:** 1030
- **Explorer:** https://evm.confluxscan.net/

## Features

Once set up, the application allows you to:

- ✅ Connect wallet (MetaMask)
- ✅ Create invoices on-chain
- ✅ View all invoices (sent/received)
- ✅ Pay invoices directly
- ✅ Cancel invoices (as freelancer)
- ✅ Mark invoices as overdue
- ✅ Track invoice status (Pending, Paid, Overdue, Cancelled)

