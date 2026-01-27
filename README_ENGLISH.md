# KinGallery + MferMint: NFT Minting Platform on Base

**Status**: ✅ Production Ready | **Last Updated**: January 27, 2026

A modern NFT minting platform built on Base blockchain, featuring direct Paymaster integration for gasless transactions and creator-friendly smart contracts.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or similar Web3 wallet
- Some Base network ETH for minting

### Installation

```bash
# Clone repository
git clone https://github.com/KinGallery/KinGallery+MferMint.git
cd KinGallery+MferMint

# Install dependencies
npm install

# Configure environment (see .env.local section below)
# Copy your Paymaster URL and WalletConnect Project ID

# Start development server
npm run dev
# Open http://localhost:3000
```

### Environment Setup

Create `.env.local` with:

```bash
# Contract Addresses (Base Mainnet - deployed Jan 27, 2026)
NEXT_PUBLIC_KINGALLERY_ADDRESS=0xebc497a5c36cb1a9264fd122a586b3f461fcc568
NEXT_PUBLIC_MFERBKOBASE_ADDRESS=0xaA566959e0290cB578b1F0dfFA7203E1F9DDd1D6
NEXT_PUBLIC_USDC_CONTRACT=0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913
NEXT_PUBLIC_CHAIN_ID=8453

# Paymaster (Coinbase Developer Platform)
NEXT_PUBLIC_PAYMASTER_URL=<your-paymaster-url>

# Wallet Connection (WalletConnect)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<your-project-id>
```

---

## 📋 System Architecture

### Smart Contracts

**KinGallery** (`0xebc497a5c36cb1a9264fd122a586b3f461fcc568`)
- Payment processing hub
- Splits ETH/USDC between artist and gallery
- Calls artist's NFT contract to mint
- Role-based access control (ADMIN_ROLE, RELAYER_ROLE)
- Status: ✅ Verified on Sourcify, BaseScan, BlockScout, RouteScan

**MferBk0Base** (`0xaA566959e0290cB578b1F0dfFA7203E1F9DDd1D6`)
- ERC721 NFT contract with max supply of 1000
- ERC2981 royalties (5% to artist)
- IPFS-based metadata with `.json` suffix
- Status: ✅ Verified on all explorers

### Frontend Stack

- **Framework**: Next.js 16 with React
- **Wallet Integration**: wagmi v2.19 + viem v2.44
- **UI Components**: OnchainKit (Coinbase)
- **Styling**: Tailwind CSS
- **Blockchain**: Base network (chainId 8453)

### Metadata Architecture

- **App Frontend**: Hosted on Netlify (kingallery.netlify.app)
- **Metadata**: Stored on IPFS via Pinata (permanent, immutable)
- **Token URIs**: Point to IPFS with `.json` suffix
  ```
  ipfs://bafybeihwtlwxbgnzfjsamyr7uyrgi3bt3osv72vv6muesrq7mnvbrtawcq/{tokenId}.json
  ```
- **Public Gateways**: ipfs.io, cloudflare-ipfs.com (censorship-resistant)

---

## 🎯 User Flow

1. **Connect Wallet**: User clicks "Connect" → Selects wallet (MetaMask, Zerion, Coinbase)
2. **Request Signature**: Wallet prompts signature (proves ownership)
3. **Mint**: Click "Magic Button" → See payment animation
4. **Paymaster Sponsors Gas**: User sees $0 gas cost (Coinbase Paymaster)
5. **Mint Animation**: 10-second reveal animation
6. **View NFT**: Redirected to gallery with token metadata
7. **See Everywhere**: Token appears on OpenSea, Magic Eden, etc.

---

## 💰 Payment Model

### Per Mint (0.0003 ETH total)
- **0.0002 ETH** → Artist EOA
- **0.0001 ETH** → Gallery (Smart Wallet)
- **Gas**: $0 (sponsored by Paymaster)

### Supported Tokens
- **ETH**: Primary payment method (tested ✅)
- **USDC**: Support planned (backend ready)

---

## 🔐 Security Model

- ✅ **No Private Keys**: All transactions signed by user's wallet
- ✅ **Zero Secrets**: Only public Paymaster URL + WalletConnect ID
- ✅ **Reentrancy Protection**: Guards against circular calls
- ✅ **Replay Attack Prevention**: Unique payment IDs per transaction
- ✅ **Role-Based Access**: Admin-only critical functions
- ✅ **Contract Verification**: All contracts verified on public explorers

---

## 🧪 Testing

### Manual Testing Checklist

```bash
# 1. Connect Wallet
npm run dev
# Open http://localhost:3000
# Click "Connect" → Select MetaMask

# 2. Test Mint Flow
# Click Magic Button
# Approve in wallet
# Watch 10s animation

# 3. Verify Metadata
# Check Page 2 displays NFT metadata
# Metadata should include image, description, attributes

# 4. Check Blockchain
# Visit https://basescan.org/tx/{hash}
# Verify:
#   - KinGallery called
#   - Artist received 0.0002 ETH
#   - Gallery received 0.0001 ETH

# 5. Check OpenSea
# Visit https://opensea.io/collection/mferbk0base
# Verify metadata loads correctly
```

---

## 📚 Documentation

### Essential Reading

| Document | Purpose |
|----------|---------|
| [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | **Authoritative Reference** - Complete technical specifications |
| [`FRESH_DEPLOYMENT_SUMMARY_EN.md`](./FRESH_DEPLOYMENT_SUMMARY_EN.md) | Executive Summary - High-level overview for team |
| [`BASESCAN_VERIFICATION_CLEAN_2026.md`](./BASESCAN_VERIFICATION_CLEAN_2026.md) | Verification Guide - How contracts were verified |
| [`VALIDACAO_INTEGRACAO_CONTRATOS.md`](./VALIDACAO_INTEGRACAO_CONTRATOS.md) | Integration Checklist - Testing procedures |

### Reference Documents (Internal Portuguese)

| Document | Purpose |
|----------|---------|
| [`DOCUMENTO_FINAL_REDEPLOY_27JAN2026_PT-BR.md`](./DOCUMENTO_FINAL_REDEPLOY_27JAN2026_PT-BR.md) | Internal reference (Portuguese) |

---

## 🚀 Deployment

### Production Build

```bash
# Build optimized bundle
npm run build

# Start production server
npm start
```

### Deploy to Netlify

```bash
# Automatically deployed via:
# 1. Push to main branch
# 2. Netlify detects changes
# 3. Runs `npm run build && npm start`
# 4. Live at kingallery.netlify.app
```

### Contract Deployment

Contracts were deployed via Remix:
1. Open https://remix.ethereum.org
2. Create new file with contract code
3. Compile with Solidity 0.8.19
4. Deploy to Base network (chainId 8453)
5. Verify on BaseScan

See [`BASESCAN_VERIFICATION_CLEAN_2026.md`](./BASESCAN_VERIFICATION_CLEAN_2026.md) for detailed steps.

---

## ⚙️ Configuration

### Contract Parameters

**KinGallery:**
- Mint price: 0.0003 ETH
- Artist split: 0.0002 ETH (67%)
- Gallery split: 0.0001 ETH (33%)
- Pause mechanism: Available
- Admin role: Required for key functions

**MferBk0Base:**
- Max supply: 1000 tokens
- Royalty percentage: 5% (ERC2981)
- Royalty recipient: Artist EOA
- Token counter: Starts at 1
- baseURI: Points to IPFS

### Environment Variables

See `.env.local` section in Quick Start above.

---

## 🔧 Development

### Project Structure

```
.
├── .github/
│   └── copilot-instructions.md    # AI Agent reference
├── app/
│   ├── components/                 # React components
│   │   ├── MagicMintButton.tsx     # Main mint UI
│   │   └── ArtworkMetadata.tsx     # Metadata display
│   ├── gallery/                    # Gallery page
│   ├── hooks/                      # Custom React hooks
│   └── page.tsx                    # Home page
├── contracts/                      # Solidity contracts
├── public/                         # Static assets
├── lib/                           # Utilities
├── metadata/                      # IPFS metadata cache
└── scripts/                       # Utility scripts
```

### Key Components

**MagicMintButton.tsx**
- Handles wallet connection via OnchainKit
- Encodes contract calls using viem
- Manages payment mode toggle (ETH/USDC)
- Handles animation sequence

**Gallery Page**
- Displays minted NFTs using eth_getLogs
- Shows token metadata from IPFS
- Supports metadata refresh

### Adding Features

1. **New Payment Method**: Add handler in MagicMintButton, encode call with viem
2. **UI Styling**: Use Tailwind CSS classes and inline styles
3. **Contract Interaction**: Use viem's contract functions
4. **Metadata Updates**: Update IPFS baseURI configuration

---

## 🐛 Troubleshooting

### Transaction Failed

**Check:**
1. Wallet has sufficient Base ETH (0.0003 ETH + gas ~0.0001 ETH)
2. Network is set to Base (chainId 8453)
3. Paymaster URL is active
4. Contract addresses in .env.local match deployment

**Solution:**
1. Refresh page and try again
2. Check BaseScan for detailed error message
3. Verify wallet is on correct network

### OpenSea Metadata Not Loading

**Check:**
1. Transaction confirmed on BaseScan
2. tokenURI returns correct format: `ipfs://.../{tokenId}.json`
3. IPFS gateway is accessible: https://ipfs.io/ipfs/{CID}

**Solution:**
1. Wait 1-2 hours for OpenSea cache to refresh
2. Force refresh on OpenSea: Click "Refresh Metadata"
3. Check metadata JSON is valid

### Wallet Won't Connect

**Check:**
1. WalletConnect Project ID is valid
2. Browser console for specific error
3. Try different wallet (MetaMask → Coinbase)

**Solution:**
1. Clear browser cache and cookies
2. Try incognito window
3. Restart wallet extension

---

## 📊 Metrics

### Contract Statistics

- **Total Mints**: Tracked via token counter
- **Total Revenue**: Sum of all 0.0003 ETH transactions
- **Artist Earnings**: Sum of 0.0002 ETH payouts
- **Gallery Earnings**: Sum of 0.0001 ETH payouts

### Performance

- Page load: < 2 seconds
- Wallet connection: < 500ms
- Transaction confirmation: 12-30 seconds (Base block time)
- Animation duration: 10 seconds (designed)
- Gallery refresh: < 2 seconds after mint

---

## 🤝 Contributing

### Reporting Issues

1. Check existing documentation first
2. Gather information:
   - Transaction hash (if applicable)
   - Error message
   - Steps to reproduce
   - Browser/wallet version

3. Open issue with details

### Code Changes

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following code style
3. Test thoroughly
4. Submit PR with description

### Documentation

- Keep all public-facing docs in **English**
- Internal docs can be Portuguese if marked `[PT-BR]`
- Update `.github/copilot-instructions.md` as source of truth

---

## 📜 License

This project is open source. See LICENSE file for details.

---

## 🙏 Credits

- **KinGallery**: NFT platform architecture
- **MferMint**: Creator-friendly NFT contract design
- **Coinbase**: Paymaster integration via CDP
- **Base Network**: Blockchain infrastructure

---

## 📞 Support

### Resources

- **Technical Docs**: [`.github/copilot-instructions.md`](./.github/copilot-instructions.md)
- **Contract Verification**: [BaseScan](https://basescan.org)
- **Metadata Storage**: [Pinata IPFS](https://pinata.cloud)
- **Wallet**: [MetaMask](https://metamask.io)

### Community

- Discord: [Link to community server]
- Twitter: [@KinGallery]
- Email: support@kingallery.app

---

## 🎉 Celebrate Your First Mint!

When you successfully mint your first NFT:
1. Your transaction will be on Base blockchain forever
2. Your metadata will be on IPFS permanently
3. Your NFT will appear across all platforms (OpenSea, Magic Eden, etc.)
4. Artist and gallery will receive their split immediately

**Welcome to the KinGallery community!** 🚀

---

**Repository**: github.com/KinGallery/KinGallery+MferMint  
**Network**: Base (chainId 8453)  
**Status**: Production Ready  
**Last Updated**: January 27, 2026  
**Maintained By**: Development Team
