# KinGallery + MferMint AI Agent Instructions

## 🌍 LANGUAGE REQUIREMENT

**⚠️ ALL PUBLIC-FACING DOCUMENTATION MUST BE IN ENGLISH**

This includes:
- ✅ Code comments (if visible to community)
- ✅ README files
- ✅ API documentation
- ✅ Deployment guides
- ✅ Smart contract verification docs
- ✅ This copilot instructions file

While workiing on documents, please translate any Portuguese content that you find into clear, idiomatic English.

**Exception**: Internal/private documents can be in Portuguese (pt-br), but mark them clearly as `[PT-BR]` in filename.

---

## ⚠️ CRITICAL COMPONENTS - HANDLE WITH EXTREME CARE

### 🚨 Magic Button (`app/components/MagicMintButton.tsx`)
**STATUS**: EXTREMELY SENSITIVE - CORE APP FUNCTIONALITY

**⚠️ DANGER ZONE**: This is a **complex, sensitive component** that is the **centerpiece of a "single-button app"**. 
- **Any changes can cause severe crashes**
- **Test extensively** before committing changes
- **Backup working state** before modifications
- **Component handles**: wallet connection, transaction submission, animations, state management, error handling, navigation
- **Multi-conditional rendering** with complex onClick logic
- **Rate limiting** and **anti-double-transaction** protections implemented

**Safe Modification Guidelines**:
- ✅ Change only specific properties/values
- ✅ Test after each small change
- ❌ Never refactor large blocks simultaneously
- ❌ Don't modify multiple useEffects at once
- ❌ Avoid changing core transaction logic unless critical

---

## ⚠️ IMPLEMENTATION STATUS - READ FIRST

**This section is the single source of information for project completion status. All copilots must check here before making changes.**

**Last Updated**: February 1st, 2026 - HYBRID ARCHITECTURE COMPLETE ✅

### ✅ PRODUCTION READY - HYBRID ARCHITECTURE TESTED

**Smart Contracts (Fresh Redeploy - Jan 27, 2026):**
- ✅ **KinGallery**: `0xebc497a5c36cb1a9264fd122a586b3f461fcc568`
  - Public name: "KinGallery" ✅
  - Verified on Sourcify, BaseScan, BlockScout, RouteScan
  - Payments: 0.0003 ETH (0.0002 artist + 0.0001 gallery) ✅ TESTED
  - USDC address: 0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913
  - Multisig: 0x4d639D1Bd428899599F0Da564926DA1a1A3bd3a8
  - Gallery payee: 0x26dcd83d4e449059abf0334e4435d48e74f28eb0 ✅

- ✅ **MferBk0Base**: `0xb222e11864A2050bd19e2Df6648CfbB971f28325`
  - Public name: "Mfer-0-Base" ✅
  - Verified on Sourcify, BaseScan, BlockScout, RouteScan
  - Max supply: 1000 ERC-721 tokens (verified on BaseScan)
  - Token counter: Active (13+ mints confirmed) ✅
  - Metadata: IPFS-based with `.json` suffix in tokenURI ✅
  - Royalties: 5% to artist (ERC2981)
  - Owner: Artist EOA (0xbcd980d37293CBee62Bf5f93a26a0B744C18964D)
  - Gallery integration: ACTIVE ✅

**Frontend Stack - HYBRID ARCHITECTURE:**
- ✅ **Smart Wallets**: ERC-7677 + useCapabilities + Auto network switch
- ✅ **EOA Wallets**: Traditional writeContract + Manual switch + CDP Paymaster  
- ✅ **Detection Logic**: capabilities.paymasterService.supported
- ✅ **Account Abstraction**: UserOps confirmed on BaseScan ✅
- ✅ **Gas Sponsorship**: 50% savings achieved ($0.0005 per mint) ✅
- ✅ **Payment Flow**: 0.0002 ETH artist + 0.0001 ETH gallery ✅
- ✅ **Gallery Integration**: Last 2 mints loading correctly ✅
- ✅ **Wallet integration**: (Zerion, MetaMask, Coinbase Wallet, Base Account)
- ✅ **Success overlay**: 10s WebP mint reveal with redirect to gallery

### 📚 Documentation Index:
- [BASESCAN_VERIFICATION_CLEAN_2026.md](../BASESCAN_VERIFICATION_CLEAN_2026.md) - BaseScan verification guide
- [CONTRACTS_VALIDATION_INTEGRATION.md](../CONTRACTS_VALIDATION_INTEGRATION.md) - Contract integration checklist

### ✅ COMPLETED - HYBRID ARCHITECTURE SUCCESS

**✅ PRODUCTION VALIDATED (Feb 1, 2026):**
1. ✅ **Smart Wallet Flow**: Account Abstraction + UserOps confirmed on BaseScan
2. ✅ **EOA Wallet Flow**: Traditional approach working perfectly  
3. ✅ **Gas Sponsorship**: 50% savings achieved ($0.0005 per mint)
4. ✅ **Payment Distribution**: 0.0002 ETH artist + 0.0001 ETH gallery
5. ✅ **Gallery Integration**: Loading last 2 mints successfully
6. ✅ **Network Protection**: Prevents accidental Ethereum mainnet mints

**🎯 NEXT DEVELOPMENT PHASE:**

**High Priority:**
1. **Enhanced Gallery**: Implement hybrid indexer for complete mint history
2. **Metadata Entanglement**: Auto-generate combined metadata (Base + Original Mfer)
3. **New Contract Deploy**: With built-in indexing capabilities
4. **Farcaster Miniapp**: Test integration with existing hybrid architecture
5. **Base.app Integration**: Smart Wallet only mode validation

**Technical Improvements:**
- [ ] Base Indexer API integration for complete NFT history  
- [ ] IPFS metadata pipeline for entangled Mfer data
- [ ] Contract upgrade with `getAllMints()` view function
- [ ] Netlify production deployment optimization

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
   - Deployed: `0xEbC497a5C36cb1a9264FD122a586B3F461fcC568`

2. **Artist Contract** (`contracts/MferBk0Base.sol`)
   - ✅ **DEPLOYED & VERIFIED**: `0xb222e11864A2050bd19e2Df6648CfbB971f28325` (Base chain)
   - Verified on Sourcify: January 14, 2026 (Exact Match)
   - Includes required functions: `payAndMint(address,address,string),` and `processPayment(address,address,uint256,string)`
   - Features: Creator-friendly (artists mint free), royalties, onchain poetry
   - Old incompatible contracts should be labeled as "Legacy Testing Contracts" (`0x86a34dfab59996c6fb809d1f2b016a0ed397e682`0x01ECF65958dB5d1859d815ffC96b7b8C5e16E241', and other previous ones) should NOT be used

3. **Frontend** (`app/components/MagicMintButton.tsx`)
   - Next.js 16 with wagmi v2.19 + viem v2.44 for wallet integration
   - Direct transaction submission to blockchain (no backend)
   - Paymaster sponsorship via Coinbase SDK admins all secrets (automatic)
   - Payment mode toggle (ETH/USDC) with animated UI- not active ATM
   - Animated ritual phrases system before wallet connect, after connect until mint, through mint, until page redirect to page2, where the NFT is displayed with metadata. Animated phrases are all prerendered WebP animated images loaded locally.
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





NOT UPDATED from here down ↓ 

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
- Component structure in [app/components/MagicMintButton.tsx](../app/components/MagicMintButton.tsx)
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

**Status**: ✅ Architecture Documented | 📋 Ready for Implementation

### How Farcaster Wallet Integration Works

1. **Provider Source**: Farcaster Miniapps SDK provides `sdk.wallet.getEthereumProvider()` → EIP-1193 Ethereum Provider
2. **Wallet Selection**: Farcaster handles wallet selection in sidebar (no WalletConnect modal needed)
3. **Transaction Flow**: Seamless integration with existing ETH/USDC payment flows via TransactionButton

### Implementation Checklist

#### Phase 1: Environment Detection (Priority: HIGH)
```typescript
// app/hooks/useFarcasterDetection.ts
export const useFarcasterDetection = () => {
  const [isFarcaster, setIsFarcaster] = useState(false);
  
  useEffect(() => {
    // Detect if running inside Farcaster frame
    const checkFarcaster = async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        if (sdk && sdk.wallet) {
          setIsFarcaster(true);
          return true;
        }
      } catch (e) {
        // Not in Farcaster
      }
      return false;
    };
    
    checkFarcaster();
  }, []);
  
  return isFarcaster;
};
```

#### Phase 2: Adapter Layer (Priority: HIGH)
```typescript
// app/hooks/useFarcasterWallet.ts
export const useFarcasterWallet = () => {
  const [provider, setProvider] = useState<EIP1193Provider | null>(null);
  
  useEffect(() => {
    const initFarcasterProvider = async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        const ethProvider = sdk.wallet.getEthereumProvider();
        setProvider(ethProvider);
      } catch (e) {
        console.error('Failed to get Farcaster provider:', e);
      }
    };
    
    initFarcasterProvider();
  }, []);
  
  return provider;
};
```

#### Phase 3: UI Conditional Rendering (Priority: MEDIUM)
```typescript
// app/components/MagicMintButton.tsx (lines 50-60)
const MagicMintButton = () => {
  const isFarcaster = useFarcasterDetection();
  
  if (isFarcaster) {
    return <TransactionButton
      calls={[{
        to: process.env.NEXT_PUBLIC_KINGALLERY_ADDRESS || '',
        abi: [...],  // Same ABI as web version
        functionName: 'payAndMint',
        args: [...],
        value: '300000000000000',
      }]}
      // Farcaster SDK handles gas sponsorship automatically
    />;
  }
  
  return <YourExistingMintFlow />;
};
```

### Farcaster Frame Manifest

**File**: `public/farcaster-manifest.json`
```json
{
  "accountAssociation": {
    "header": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9",
    "payload": "eyJkb21haW4iOiJraW5nYWxsZXJ5Lm5ldGxpZnkuYXBwIiwid2FsbGV0IjoiZGlkOmVpcDExNTU6YmFzZTowMDEifQ",
    "signature": "[YOUR_SIGNATURE_HERE]"
  },
  "frame": {
    "version": "next",
    "imageUrl": "https://kingallery.netlify.app/og-image.png",
    "button": {
      "title": "Open KinGallery",
      "action": {
        "type": "launch_frame",
        "name": "KinGallery",
        "url": "https://kingallery.netlify.app/farcaster"
      }
    }
  }
}
```

### Testing Checklist for Farcaster

**Environment Setup:**
- [ ] Farcaster app installed on mobile/desktop
- [ ] Base network selected (chainId 8453)
- [ ] Developer mode enabled in Farcaster settings
- [ ] Wallet configured (any: Coinbase, MetaMask, etc.)

**Functional Tests:**
- [ ] App loads inside Farcaster frame (no wallet selector shows)
- [ ] Magic Button displays correctly in frame context
- [ ] Click button → Wallet sidebar appears
- [ ] Signature request shows (custom message)
- [ ] Transaction submitted to Base network
- [ ] Gas sponsored by Paymaster (user sees $0 gas)
- [ ] Animation plays for 10 seconds
- [ ] Redirects to gallery page
- [ ] Token appears in gallery with metadata

**Metadata Validation:**
- [ ] tokenURI returns: `ipfs://bafybeihwtlwxbgnzfjsamyr7uyrgi3bt3osv72vv6muesrq7mnvbrtawcq/{tokenId}.json` ✅
- [ ] Metadata loads on OpenSea preview
- [ ] Image displays correctly (WebP animated)
- [ ] Royalties show 5% to artist address

**Payment Flows:**
- [ ] ETH payment: 0.0003 ETH from user → KinGallery → split to artist + gallery
- [ ] USDC payment: 300 USDC (if USDC mode implemented)
- [ ] Paymaster sponsorship confirmed (0 gas fees in transaction)

**Error Scenarios:**
- [ ] Insufficient balance → clear error message
- [ ] Network switched to wrong chain → reconnect prompt
- [ ] Transaction reverted → error details shown
- [ ] User cancels signature → graceful exit

**Performance Metrics:**
- [ ] Frame load time: < 2 seconds
- [ ] Magic Button clickable: < 500ms response
- [ ] Transaction submission: < 1 second
- [ ] Animation duration: 10 seconds (as designed)
- [ ] Gallery page load: < 2 seconds

### Base.app Smart Wallet Mode

**Status**: ⏳ Ready for Testing | 🔄 Requires Smart Wallet Only

**Differences from Farcaster:**
| Aspect | Farcaster | Base.app |
|--------|-----------|----------|
| **Wallet Type** | EOA + Smart Wallet | Smart Wallet Only |
| **Wallet Selector** | Farcaster sidebar | Base.app built-in |
| **Provider** | `sdk.wallet.getEthereumProvider()` | `window.ethereum` (Smart Wallet) |
| **Gas Sponsorship** | Via Paymaster | Via Base.app |
| **User Experience** | Frame context | Native app context |

**Testing Checklist:**
- [ ] Base.app installed and configured
- [ ] Smart Wallet deployed and funded
- [ ] KinGallery app opens in Base.app
- [ ] Click Magic Button (no EOA fallback shown)
- [ ] Mint completes successfully
- [ ] Transaction visible in Base.app activity
- [ ] Token appears in Base.app NFT gallery

---

**Last Updated**: January 27, 2026
**Status**: ✅ Production Ready | ✅ All Contracts Deployed & Verified | ⏳ Farcaster Integration Ready for Implementation  
