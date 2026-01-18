# Video Tutorial - Important Code Sections to Show

This guide highlights the most important code sections to demonstrate in your video tutorial.

## 1. Wallet Connection & Provider (CRITICAL)

**File:** `components/WalletProvider.tsx`

**Why:** Shows how Web3 wallet integration works

**Key Sections to Show:**
- Wallet connection logic
- Account state management
- Network switching
- Event listeners for wallet changes

```typescript
// Show: Wallet connection function
const handleConnectWallet = async () => {
  await switchNetwork();
  const signer = await connectWallet();
  const address = await signer.getAddress();
  setAccount(address);
};
```

---

## 2. Contract Interaction Setup (CRITICAL)

**File:** `lib/contract.ts`

**Why:** Core of how frontend talks to blockchain

**Key Sections to Show:**
- `getProvider()` - How to get Web3 provider
- `getContract()` - How to create contract instance
- `connectWallet()` - Wallet connection
- `parseInvoice()` - Converting blockchain data to TypeScript types

```typescript
// Show: Contract instance creation
export async function getContract(signer?: ethers.Signer) {
  const provider = await getProvider();
  const contractProvider = signer || provider;
  return new ethers.Contract(
    INVOICE_SYSTEM_ADDRESS,
    INVOICE_SYSTEM_ABI,
    contractProvider
  );
}
```

---

## 3. Contract ABI Integration (IMPORTANT)

**File:** `lib/contractABI.ts`

**Why:** Shows how to use compiled contract ABI

**Key Sections to Show:**
- ABI import from artifacts
- Environment variable for contract address

```typescript
// Show: ABI import
const InvoiceSystemArtifact = require('../../artifacts/contracts/InvoiceSystem.sol/InvoiceSystem.json');
export const INVOICE_SYSTEM_ABI = InvoiceSystemArtifact.abi;
export const INVOICE_SYSTEM_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
```

---

## 4. Create Invoice Functionality (CRITICAL)

**File:** `app/create/page.tsx`

**Why:** Shows how to send transactions to blockchain

**Key Sections to Show:**
- Form handling
- Input validation
- Transaction sending
- Error handling

```typescript
// Show: Invoice creation transaction
const handleSubmit = async (e: React.FormEvent) => {
  const amount = parseCFXToWei(formData.amount);
  const dueDate = Math.floor(new Date(formData.dueDate).getTime() / 1000);
  
  const tx = await createInvoiceTx(
    formData.client,
    amount,
    BigInt(dueDate),
    formData.description
  );
  // Transaction sent!
};
```

---

## 5. Pay Invoice Function (CRITICAL)

**File:** `lib/contract.ts` - `payInvoice()`

**Why:** Shows how to send payments with value

**Key Sections to Show:**
- Payable transaction
- Value parameter
- Transaction confirmation

```typescript
// Show: Payment transaction
export async function payInvoice(invoiceId: bigint, amount: bigint) {
  const signer = await connectWallet();
  const contract = await getContract(signer);
  const tx = await contract.payInvoice(invoiceId, { value: amount });
  await tx.wait(); // Wait for confirmation
  return tx;
}
```

---

## 6. Invoice Card Component (IMPORTANT)

**File:** `components/InvoiceCard.tsx`

**Why:** Shows UI interaction with blockchain

**Key Sections to Show:**
- Status detection (freelancer vs client)
- Action buttons (pay, cancel, mark overdue)
- Status banners
- Payment flow display

```typescript
// Show: Role detection and actions
const isFreelancer = account?.toLowerCase() === invoice.freelancer.toLowerCase();
const isClient = account?.toLowerCase() === invoice.client.toLowerCase();
const canPay = isClient && (invoice.status === InvoiceStatus.Pending || invoice.status === InvoiceStatus.Overdue);
```

---

## 7. Fetch Invoices (IMPORTANT)

**File:** `app/invoices/page.tsx`

**Why:** Shows how to read data from blockchain

**Key Sections to Show:**
- Fetching invoice lists
- Filtering (sent vs received)
- Loading multiple invoices
- State management

```typescript
// Show: Fetching invoices
const loadInvoices = async () => {
  const freelancerIds = await fetchFreelancerInvoices(account);
  const clientIds = await fetchClientInvoices(account);
  
  const invoicePromises = invoiceIds.map((id) => fetchInvoice(id));
  const fetchedInvoices = await Promise.all(invoicePromises);
};
```

---

## 8. Utility Functions (HELPFUL)

**File:** `lib/utils.ts`

**Why:** Shows data formatting and conversion

**Key Sections to Show:**
- CFX to Wei conversion
- Address formatting
- Date formatting
- Status helpers

```typescript
// Show: Important conversions
export function parseCFXToWei(cfx: string): bigint {
  const amount = parseFloat(cfx);
  return BigInt(Math.floor(amount * 1e18));
}

export function formatCFXFromWei(wei: bigint): string {
  const cfx = Number(wei) / 1e18;
  return cfx.toFixed(4);
}
```

---

## 9. Type Definitions (HELPFUL)

**File:** `lib/types.ts`

**Why:** Shows TypeScript type safety

**Key Sections to Show:**
- Invoice interface
- InvoiceStatus enum
- Type definitions

```typescript
// Show: Type definitions
export enum InvoiceStatus {
  Pending = 0,
  Paid = 1,
  Overdue = 2,
  Cancelled = 3,
}

export interface Invoice {
  invoiceId: bigint;
  freelancer: string;
  client: string;
  amount: bigint;
  // ... rest of fields
}
```

---

## 10. Environment Configuration (IMPORTANT)

**File:** `.env.local.example` or configuration

**Why:** Shows how to configure the app

**Key Sections to Show:**
- Contract address setup
- RPC URL configuration
- Chain ID setup

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=https://evmtestnet.confluxrpc.com
NEXT_PUBLIC_CHAIN_ID=71
```

---

## Recommended Tutorial Flow

### Part 1: Setup & Configuration (5 min)
1. Show project structure
2. Environment variables setup
3. Contract ABI integration (`lib/contractABI.ts`)

### Part 2: Wallet Integration (10 min)
4. Wallet Provider (`components/WalletProvider.tsx`)
5. Contract connection (`lib/contract.ts` - `getContract()`)
6. Network switching

### Part 3: Reading from Blockchain (10 min)
7. Fetch invoices (`app/invoices/page.tsx`)
8. Parse invoice data (`lib/contract.ts` - `parseInvoice()`)
9. Display invoices (`components/InvoiceCard.tsx`)

### Part 4: Writing to Blockchain (15 min)
10. Create invoice (`app/create/page.tsx`)
11. Pay invoice (`lib/contract.ts` - `payInvoice()`)
12. Cancel invoice
13. Mark as overdue

### Part 5: UI/UX Features (5 min)
14. Status banners
15. Role detection
16. Payment flow indicators

---

## Code Snippets to Highlight

### Most Important (Must Show):

1. **Contract Instance Creation:**
```typescript
const contract = await getContract(signer);
```

2. **Sending Transaction:**
```typescript
const tx = await contract.createInvoice(client, amount, dueDate, description);
await tx.wait();
```

3. **Sending Payment:**
```typescript
const tx = await contract.payInvoice(invoiceId, { value: amount });
```

4. **Reading Data:**
```typescript
const invoice = await contract.getInvoice(invoiceId);
const invoiceIds = await contract.getFreelancerInvoices(address);
```

5. **Wallet Connection:**
```typescript
const signer = await connectWallet();
const address = await signer.getAddress();
```

---

## Tips for Video Tutorial

1. **Start with the flow:** Show user journey first, then dive into code
2. **Highlight key functions:** Use code highlighting for critical functions
3. **Show browser console:** Demonstrate transaction hashes and events
4. **Show wallet interactions:** Record MetaMask popups
5. **Explain BigInt:** Important for handling blockchain numbers
6. **Show error handling:** Demonstrate what happens when things go wrong
7. **Environment setup:** Show how to configure `.env.local`
8. **ABI explanation:** Explain why we need the ABI

---

## Files to Have Open During Tutorial

1. `lib/contract.ts` - Main contract interaction
2. `components/WalletProvider.tsx` - Wallet setup
3. `app/create/page.tsx` - Create invoice
4. `components/InvoiceCard.tsx` - Invoice display
5. `app/invoices/page.tsx` - Invoice listing
6. `lib/utils.ts` - Helper functions

---

## Key Concepts to Explain

1. **Provider vs Signer:** When to use each
2. **BigInt:** Why blockchain uses BigInt for numbers
3. **Wei vs CFX:** Conversion between units
4. **Transaction Lifecycle:** Send → Wait → Confirm
5. **Event Listeners:** Wallet account/network changes
6. **Type Safety:** TypeScript types for blockchain data
7. **Error Handling:** Network errors, user rejection, etc.
