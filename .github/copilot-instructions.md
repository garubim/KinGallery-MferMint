# KinGallery + MferMint AI Agent Instructions

## ⚠️ IMPLEMENTATION STATUS - READ FIRST

**This section is the single source of information for project completion status. All copilots must check here before making changes.**

### 🔴 CRITICAL ISSUE - BLOCKING EOA MINTS (Jan 18, 2026)

**Status**: 🚨 **URGENT** - payAndMint fails with EOA wallets
- **Root Cause**: `payee2` not configured in KinGallery (0x8abb...)
- **Symptom**: EOA mints fail with "failed to call payAndMint", Smart Wallet works (via EIP-4337)
- **Fix Time**: ~5 minutes (via Remix)
- **START HERE**: [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) (5 min copy-paste guide)
- **Detailed Guide**: [REMIX_FIX_PAYEE2_GUIA.md](../REMIX_FIX_PAYEE2_GUIA.md) (step-by-step with screenshots)
- **Action**: Call `setGalleryPayee("0x26dcd83d4e449059abf0334e4435d48e74f28eb0")` in KinGallery

**📚 Full Documentation Index:**
- [SUMARIO_EXECUTIVO.md](../SUMARIO_EXECUTIVO.md) - Executive summary
- [DIAGNOSTICO_PAYANDMINT_EOA_FAILURES.md](../DIAGNOSTICO_PAYANDMINT_EOA_FAILURES.md) - Technical root cause analysis
- [RESPOSTAS_SUAS_PERGUNTAS.md](../RESPOSTAS_SUAS_PERGUNTAS.md) - Answers to your 5 specific questions
- [ANALISE_MFERBK0BASE_NOVO_VS_ATUAL.md](../ANALISE_MFERBK0BASE_NOVO_VS_ATUAL.md) - New contract vs current comparison
- [RELATORIO_FINAL.md](../RELATORIO_FINAL.md) - Complete technical report

---

#

- **Does NOT affect Paymaster**: KinGallery (0x8abb...) stays unchanged
- **BaseScan public name**: Contract will appear as "MferBk0Base" (unlike KinGallery which has no public name)

### ✅ COMPLETED (Production Ready)
- KinGallery contract deployed & verified: `0x8abb13088c1707e9d5be43dac0e78e8d9d35e44f` (no public name on BaseScan)
- Frontend animation system (WebP welcome + login-to-mint videos)
- Wallet integration (WalletConnect + MetaMask + Coinbase Wallet)
- Direct Paymaster integration (gas sponsorship working)
- Auto-disconnect on tab close
- Z-index fix for button click detection (lateral buttons moved behind main button)

### 🔄 COMPLETED - DEPLOYED, VERIFIED AND PUBLISHED
- **MferBk0Base
  - Current: 0x01ECF65958dB5d1859d815ffC96b7b8C5e16E241 (bytes32 paymentId)
  - Fixed contract ready: `/contracts/MferMintGalleryCompatible_FIXED.sol`
  - Contract name: `MferBk0Base` (will have public name on BaseScan)
  - Changes: `string calldata paymentId` instead of `bytes32`
  - Deploy via Remix with Solidity 0.8.19
  - Verify on BaseScan after deployment
  - Update NEXT_PUBLIC_MFERMINT_CONTRACT in .env.local
  - Does NOT require Paymaster config changes (KinGallery unchanged)

- **Wallet Integration - Using onchainkit Pure Implementation**
  - Either use**: OnchainKit experimental hooks (useCapabilities, useWriteContracts) - cause errors with non-Coinbase wallets
  - ✅ **CURRENT**: wagmi's useSendTransaction + viem for encoding
  - Wallet connection working: injected connector (MetaMask, Coinbase Wallet, etc.)
  - Transaction submission working (gas calculated successfully)
  - Awaiting test with fixed MferMint contract

- **UI Panel Layout Adjustments (3 items pending)**
  - Lower art preview so "concept phrase" sits on background (not over art)
  - Remove/revise "Name" field (redundant with Edition display)
  - Validate Edition shows "0" for first mint (not example data "272")
  - FUTURE: Magic Button design - Interactive, but also come animated.

### ❌ NOT STARTED 
- Farcaster miniapp deployment configuration (documented: uses `sdk.wallet` EIP-1193 provider)
- Base.app integration (requires Smart Wallet only mode)
- Production build optimization

## Project Overview

**KinGallery** is an evolutionary NFT minting platform on Base chain combining smart contracts and a Next.js frontend with **direct Paymaster integration**. Core features:
- **Direct Paymaster Integration**: Uses Coinbase Developer Platform Paymaster directly via public URL - no backend server needed
- **Zero Secrets Architecture**: Only public WalletConnect Project ID and Paymaster URL - no private keys in codebase
- **Two Smart Contracts**: 
  - **KinGallery**: Payment processing hub that coordinates ETH/USDC payments and calls artist contracts
  - **MferMint** (Artist Contract): Creator-friendly NFT contract developed by Kinwiz.base.eth with generous terms for artists
- **Security Model**: All transactions signed by user's wallet; Paymaster sponsors gas fees automatically

## Architecture

### System Components

1. **Smart Contract** (`contracts/KinGallery.sol`)
   - ERC20/ETH payment processing with role-based access (ADMIN_ROLE, RELAYER_ROLE)
   - Calls MferMint contract's `payAndMint(address,address,string),` and `processPayment(address,address,uint256,string)`
   - Tracks processed payments via mapping to prevent replay attacks
   - Configurable mint price (default: 0.0003 ETH = 300_000_000_000_000 wei)
   - Deployed: `0x8abb13088c1707e9d5be43dac0e78e8d9d35e44f`

2. **Artist Contract** (`contracts/MferBk0Base.sol`)
   - ✅ **DEPLOYED & VERIFIED**: `0x01ECF65958dB5d1859d815ffC96b7b8C5e16E241` (Base chain)
   - Verified on Sourcify: January 14, 2026 (Exact Match)
   - Includes required functions: `payAndMint(address,address,string),` and `processPayment(address,address,uint256,string)`
   - Features: Creator-friendly (artists mint free), royalties, onchain poetry
   - Old incompatible contract (`0x86a34dfab59996c6fb809d1f2b016a0ed397e682`) should NOT be used

3. **Frontend** (`app/components/MagicMintButton.tsx`)
   - Next.js 16 with wagmi v2.19 + viem v2.44 for wallet integration
   - Direct transaction submission to blockchain (no backend)
   - Paymaster sponsorship via Coinbase SDK (automatic)
   - Payment mode toggle (ETH/USDC) with animated UI
   - Animated ritual phrases system after wallet connect
   - Environment variables for contract addresses (fallbacks hardcoded)

## Critical Workflows

### Local Development
```bash
# Install dependencies
npm install

# Start Next.js dev server (default: localhost:3000)
npm run dev

# No backend server needed! Paymaster works via direct URL.
# Required env vars in .env.local:
# - NEXT_PUBLIC_PAYMASTER_URL (Coinbase Paymaster - public URL)
# - NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID (WalletConnect - public ID)
# - NEXT_PUBLIC_KINGALLERY_CONTRACT (contract address)
# - NEXT_PUBLIC_MFERMINT_CONTRACT (artist contract address)
# - NEXT_PUBLIC_USDC_CONTRACT (Base USDC address)
```

### Build & Deploy
```bash
npm run build      # Next.js build to .next/
npm start          # Production server
```

### Smart Contract Deployment
- Solidity 0.8.19 configured in `hardhat.config.cjs`
- Deploy via Remix (remix.ethereum.org) to Base chain (0x8453)
- Constructor requires: USDC address, Gnosis Safe multisig address
- Verify on BaseScan with flattened code + constructor args

## Data Flow Patterns

### Mint Flow with magicbutton
1. User connects wallet via WalletConnect, onchainkit or wagmi after being welcomed by Maggic button animaated sentences.
2. User than gets new messages from Magic button which empowers all the citizens that have been joining Omero's ride towards both, his pass and future simultaneously.
3. Magic button came to their final destination. The flow will grow even more during the next few days. They'll celebrate the fresh and the smoked, classic and new. Some novelties that already feel old. Brings us to the main reason of our encounter. Just a few years back we learned a new connected language that came with new actions as mint and stake, no it wasn't a frat barbecue party, although it feels long ago. User clicks magic button → 
4. Frontend encodes `payAndMint(artistContract, to, paymentId)` call using viem
5. `walletClient.sendTransaction()` sends directly to KinGallery contract with value=0.0003 ETH
6. Paymaster automatically sponsors gas via Coinbase SDK (no user approval needed)
7. Transaction confirmed on Base chain
8. Extract tokenId from timestamp, redirect to `/gallery?tokenId=...`

### USDC Payment Flow
1. User connects wallet via WalletConnect modal
2. User explicitly clicks "💵 USDC" button to select payment method (uses separate code path)
3. User clicks main button → 
4. Frontend encodes `processPayment(artistContract, to, paymentId)` call
5. Direct transaction to KinGallery with Paymaster sponsorship
6. ⚠️ **Currently encountering RPC error** - needs investigation of contract call encoding or Base RPC
7. Redirect to gallery on success

## Key Code Patterns

### ✅ WORKING: TransactionButton from OnchainKit (CURRENT IMPLEMENTATION)
```typescript
import { TransactionButton } from '@coinbase/onchainkit/transaction';

<TransactionButton
  calls={[{
    to: process.env.NEXT_PUBLIC_KINGALLERY_ADDRESS || '',
    abi: [{
      type: 'function',
      name: 'payAndMint',
      inputs: [
        { name: '_artistContract', type: 'address' },
        { name: '_to', type: 'address' },
        { name: '_paymentId', type: 'string' },
      ],
      outputs: [],
      stateMutability: 'payable',
    }],
    functionName: 'payAndMint',
    args: [
      process.env.NEXT_PUBLIC_MFER_ADDRESS || '',
      address || '0x0000000000000000000000000000000000000000',
      `magic-${Date.now()}`,
    ],
    value: '300000000000000', // 0.0003 ETH
  }]}
  onSuccess={(response) => console.log('Mint successful!', response)}
  onError={(error) => console.error('Mint failed', error)}
/>
```

**Why this works:**
- ✅ Built-in Paymaster integration (OnchainKit handles it automatically)
- ✅ Works with ALL wallet types (EOA, Smart Accounts, etc.)
- ✅ Simple, clean API with automatic error handling
- ✅ No experimental hooks needed

### ❌ DO NOT USE: Experimental Wagmi Hooks (CAUSES ERRORS)
```typescript
// ⚠️ NEVER USE THESE - THEY BREAK THE APP!
import { useCapabilities, useWriteContracts } from 'wagmi/experimental';
```

**Why these fail:**
- Error: "connection.connector.getChainId is not a function"
- Error: "request() -> isValidRequest() failed"
- Error: "Missing or invalid. request() method: wallet_getCapabilities"
- These experimental hooks are not stable and cause wallet connection failures
- TransactionButton already provides all needed functionality

### Environment Variables
- `NEXT_PUBLIC_PAYMASTER_URL`: CDP Paymaster endpoint (public, safe to expose)
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID (public, safe)
- `NEXT_PUBLIC_KINGALLERY_CONTRACT`: KinGallery contract address (0x8abb...)
- `NEXT_PUBLIC_MFERBKOBASE_CONTRACT`: MferBk0base artist contract (0x01E - COMPATIBLE & DEPLOYED)
- `NEXT_PUBLIC_USDC_CONTRACT`: Base USDC address (0x8335...)
- `NEXT_PUBLIC_CHAIN_ID`: Base mainnet (8453)

## Critical Integration Points

1. **Frontend → Base Blockchain**: Direct transaction submission via wagmi/viem (no middleware)
2. **Paymaster → Transaction**: Automatic gas sponsorship via Coinbase SDK (transparent to user)
3. **KinGallery → MferMint**: After payment validation, KinGallery calls artist contract functions
4. **Wallet Integration**: WalletConnect supports almost all mobile wallets via QR Code scanning as Onchainkit supports EOA and smart wallets (Base account, MetaMask, Coinbase Wallet, Zerion etc.)

## Security Considerations

- **Payment IDs**: Must be unique per transaction (timestamp-based prevents replay attacks)
- **No Private Keys**: All transactions signed by user's wallet - no backend secrets or credentials needed
- **Role-Based Access**: KinGallery uses AccessControl (ADMIN_ROLE, RELAYER_ROLE for future flexibility)
- **Paymaster URL is Public & Safe**: 
  - Coinbase Paymaster is a managed service - Coinbase holds all keys, never exposed
  - URL can be safely exposed in frontend code
  - Recommended: Set contract allowlist in Paymaster config to restrict sponsorship to KinGallery + MferMint only (done via Coinbase Portal)
  - Recommended: Monitor Paymaster quota to prevent abuse
- **Contract Verification**: All contracts verified on BaseScan for transparency
- **Paymaster Architecture**: Uses ERC-4337 Account Abstraction (Coinbase manages gas sponsorship, not your backend)

## Common Development Tasks


### Adding New Payment Method
- Create handler function in MagicMintButton following ETH/USDC pattern
- Encode appropriate contract call with viem's `encodeFunctionData()`
- Add button toggle and state management for UI

### Testing Transactions Locally
- Use Base mainnet (chainId: 8453) - no local network setup needed
- Check transaction status on BaseScan: https://basescan.org/tx/{hash}
- Monitor console logs in browser DevTools for encoded data and confirmation
- Paymaster URL must be active for gas sponsorship (check .env.local)

### UI/Animation Updates
- Component structure in [app/components/MagicMintButton.tsx](app/components/MagicMintButton.tsx)
- CSS-in-JS styling scoped to component (JSX style tags)
- CustomAnimatedText handles phrase rotation every 3 seconds
- Payment mode toggle updates UI glow color (ETH = blue, USDC = green)

## File Organization

```
root/
├── contracts/              # Solidity smart contracts
│   ├── KinGallery.sol     # Main payment + minting contract (deployed)
│   └── MferMintGalleryCompatible.sol  # Artist contract (needs deployment)
├── app/
│   ├── components/        # React components
│   │   ├── MagicMintButton.tsx    # Main UI component
│   │   └── ArtworkMetadata.tsx    # Metadata panel
│   ├── gallery/           # Gallery page
│   └── page.tsx           # Home page
├── .env.local             # Environment config (Paymaster URL, contract addresses)
├── hardhat.config.cjs     # Hardhat network config (Base mainnet)
├── package.json
├── MFERMINT_INCOMPATIBLE_FIX.md  # Contract compatibility docs
└── DEPLOY_STRATEGY.md     # Deployment checklist
```
## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Transaction fails | Check wallet has ETH for mint, contract addresses correct in .env.local, network is Base (8453) |
| Paymaster not working | Verify NEXT_PUBLIC_PAYMASTER_URL is set, check Coinbase Paymaster dashboard for quota |
| Wallet won't connect | Clear browser cache, ensure WalletConnect Project ID is valid, try different wallet |
| Type errors in viem/wagmi | Keep versions synced (viem ^2.44, wagmi ^2.19), check tsconfig.json |
| USDC payment fails | User needs USDC approval first, check Base USDC contract address matches |
| Contract call reverts | Check contract is not paused, paymentId is unique, recipient address valid |

## Farcaster Miniapp Integration

**Status**: Documented, ready to implement when needed

**How it Works:**
1. Farcaster Miniapps SDK provides `sdk.wallet.getEthereumProvider()` - an EIP-1193 Ethereum Provider
2. This provider can be passed directly to wagmi as a custom connector
3. No need for WalletConnect Modal - Farcaster handles wallet selection in sidebar
4. Seamless integration with existing ETH/USDC payment flows

**Implementation Path:**
- Create a conditional wrapper that detects if running inside Farcaster (`window.opener` or `@farcaster/miniapp-sdk` detection)
- If in Farcaster: Use `sdk.wallet.getEthereumProvider()` 
- If in Base.app: Adapt to Base.app's Smart Wallet only provider

**Key Insight:**
- **Smart Wallet Migration**: Coinbase deprecating EOA in favor of Smart Wallets
- Base.app already requires Smart Wallet only (not compatible with EOA)
- Farcaster supports both EOA and Smart Wallets
- Current WalletConnect + injected/coinbaseWallet setup is backward compatible

---

**Last Updated**: January 16, 2026  
**Status**: Production Ready (all contracts deployed & verified)  
