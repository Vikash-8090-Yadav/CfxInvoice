# Deployment Guide - CfxInvoice

This guide will help you deploy and share the CfxInvoice project with your client.

## Prerequisites Checklist

Before sharing with the client, ensure:

- [ ] Smart contract is compiled and tested
- [ ] Contract is deployed to the network (testnet or mainnet)
- [ ] Contract address is obtained from deployment
- [ ] Frontend is configured with the contract address
- [ ] All environment variables are documented
- [ ] Project is tested end-to-end

## Step 1: Deploy Smart Contract

### Deploy to Testnet (Recommended for testing)

```bash
# Make sure you have .env file with PRIVATE_KEY
npm run compile
npm run deploy:testnet
```

**Save the contract address** from the deployment output.

### Example Output:
```
✅ InvoiceSystem deployed successfully!
Contract address: 0x1234567890123456789012345678901234567890
Network: confluxTestnet
```

## Step 2: Configure Frontend

### 2.1 Create `.env.local` file for the client:

```env
# Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# Network Configuration (Testnet)
NEXT_PUBLIC_RPC_URL=https://evmtestnet.confluxrpc.com
NEXT_PUBLIC_CHAIN_ID=71

# For Mainnet, use:
# NEXT_PUBLIC_RPC_URL=https://evm.confluxrpc.com
# NEXT_PUBLIC_CHAIN_ID=1030
```

### 2.2 Build the Frontend

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

## Step 3: Testing Before Delivery

### Test Locally:

```bash
# Start production server locally
npm start

# Or start development server
npm run dev
```

### Test Checklist:
- [ ] Wallet connection works
- [ ] Can create invoices
- [ ] Can view invoices
- [ ] Can pay invoices
- [ ] Can cancel invoices
- [ ] Network switching works
- [ ] All pages load correctly

## Step 4: Prepare Delivery Package

### Option A: Source Code Delivery

1. **Clean up sensitive files:**
   ```bash
   # Make sure .env and .env.local are in .gitignore
   # Remove any node_modules if including them (not recommended)
   ```

2. **Create a clean package:**
   ```bash
   # Remove node_modules (client will install)
   rm -rf node_modules
   
   # Remove build artifacts
   rm -rf .next
   rm -rf cache
   rm -rf artifacts
   ```

3. **Create delivery folder:**
   ```bash
   # Create a zip or tar file
   tar -czf cfx-invoice-source.tar.gz \
     --exclude='node_modules' \
     --exclude='.next' \
     --exclude='cache' \
     --exclude='artifacts' \
     --exclude='.env' \
     --exclude='.env.local' \
     .
   ```

### Option B: Production Build Delivery

1. **Build the project:**
   ```bash
   npm run build
   npm run compile
   ```

2. **Package includes:**
   - All source code
   - `package.json` with dependencies
   - `.env.local.example` (template, no actual values)
   - Build instructions
   - This deployment guide

## Step 5: Client Setup Instructions

### For Client - Initial Setup:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   ```bash
   # Copy the example file
   cp .env.local.example .env.local
   
   # Edit .env.local and add:
   NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed_contract_address>
   NEXT_PUBLIC_RPC_URL=https://evmtestnet.confluxrpc.com
   NEXT_PUBLIC_CHAIN_ID=71
   ```

3. **Copy ABI (if needed):**
   ```bash
   # If artifacts folder is included, copy ABI
   npm run copy:abi
   ```

4. **Build and Run:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## Step 6: Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Add Environment Variables in Vercel Dashboard:**
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_RPC_URL`
   - `NEXT_PUBLIC_CHAIN_ID`

### Option 2: Netlify

1. **Build command:** `npm run build`
2. **Publish directory:** `.next`
3. **Add environment variables in Netlify dashboard**

### Option 3: Self-Hosted Server

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "cfx-invoice" -- start
   ```

## Step 7: Documentation for Client

Create a `CLIENT_README.md` with:

### Quick Start:
1. Install dependencies: `npm install`
2. Configure `.env.local` with contract address
3. Run: `npm run dev`
4. Open: http://localhost:3000

### Environment Variables:
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Deployed contract address (required)
- `NEXT_PUBLIC_RPC_URL` - Conflux RPC endpoint
- `NEXT_PUBLIC_CHAIN_ID` - Network chain ID (71 for testnet, 1030 for mainnet)

### Network Information:

**Conflux eSpace Testnet:**
- RPC: https://evmtestnet.confluxrpc.com
- Chain ID: 71
- Explorer: https://evmtestnet.confluxscan.net/
- Faucet: https://faucet.confluxnetwork.org/

**Conflux eSpace Mainnet:**
- RPC: https://evm.confluxrpc.com
- Chain ID: 1030
- Explorer: https://evm.confluxscan.net/

## Step 8: Delivery Checklist

Before sending to client:

- [ ] Contract deployed and address documented
- [ ] Frontend tested end-to-end
- [ ] Environment variables documented
- [ ] `.env.local.example` file included
- [ ] Build instructions provided
- [ ] Deployment guide included
- [ ] Network information provided
- [ ] Test data/test scenarios provided (optional)
- [ ] Contact information for support (optional)

## Important Files to Include:

✅ **Include:**
- All source code
- `package.json`
- `package-lock.json` or `yarn.lock`
- `.env.local.example`
- `README.md`
- `README_FRONTEND.md`
- `DEPLOYMENT_GUIDE.md`
- `hardhat.config.js`
- `next.config.js`
- `tsconfig.json`
- `tailwind.config.js`

❌ **Don't Include (or exclude):**
- `node_modules/`
- `.env` (with private keys)
- `.env.local` (with actual values)
- `.next/` (build folder - client will build)
- `cache/`
- `.git/` (unless sharing as git repo)

## Support Information

Provide the client with:

1. **Contract Address:** `0x...` (from deployment)
2. **Network:** Conflux eSpace Testnet/Mainnet
3. **Explorer Link:** Link to view contract on ConfluxScan
4. **Deployment Transaction:** Transaction hash of deployment

## Example Client Email Template

```
Subject: CfxInvoice Project - Ready for Deployment

Dear [Client],

I'm pleased to deliver the CfxInvoice project. Here's what's included:

1. **Smart Contract Deployed**
   - Contract Address: 0x...
   - Network: Conflux eSpace Testnet
   - View on Explorer: [link]

2. **Frontend Application**
   - Next.js application
   - Fully functional with wallet integration
   - Responsive design

3. **Configuration Required**
   - Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local
   - See DEPLOYMENT_GUIDE.md for details

4. **Setup Instructions**
   - Run: npm install
   - Configure .env.local
   - Run: npm run dev

Please see DEPLOYMENT_GUIDE.md for complete setup instructions.

Best regards,
[Your Name]
```

## Post-Delivery

After delivery:

- [ ] Confirm client received files
- [ ] Schedule setup call if needed
- [ ] Provide deployment support
- [ ] Gather feedback
- [ ] Plan for production deployment if using testnet

