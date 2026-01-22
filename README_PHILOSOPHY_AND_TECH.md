# KinGallery + MferMint: Poetry in the Machine

## 🎨 What This Is

A smart contract-based NFT platform that proves **art and technology don't have to be extractive**.

Every mint:
- Honors the creator
- Preserves history through cryptographic entanglement
- Creates rarity through mathematical elegance
- Writes poetry in the blockchain

## 🚀 Quick Start

### Setup
```bash
npm install --legacy-peer-deps
npm run dev  # Starts http://localhost:3000
```

### Deploy (Fresh Contract)
1. Open Remix: https://remix.ethereum.org
2. Use: `/contracts/MferBk0Base_FreshStart_Standby.sol`
3. Compile with Solidity 0.8.19
4. Deploy to Base (8453) with constructor args:
   - gallery: 0x0426413cBfC3b11f6DEd32D3ef30D53a56B12FF6 (KinGallery)
   - initialOwner: Your wallet address
5. Update `.env.local`: `NEXT_PUBLIC_MFER_ADDRESS=0x[new address]`

### Test Flow
1. Connect wallet (Smart Wallet or EOA)
2. Click Magic Button
3. Authorize transaction (8 seconds of animation)
4. Slide to page 2 (gallery)
5. See your mint entangled with its Legacy Mfer

## 🔗 The Entanglement System

### How It Works

Every transaction hash creates a deterministic connection to an Ethereum Mfer:

```typescript
// MagicMintButton.tsx
const lastSixHash = hash.slice(-6);          // e.g., "a3f7c2"
const lastSixNum = parseInt(lastSixHash, 16); // 10,752,706
const ethMferId = (lastSixNum % 9999) + 1;   // 2707

// Your Base Mfer #N is now forever entangled with Ethereum Mfer #2707
```

### Collision Events (Rare Prestige)

If two mints would generate the same ethMferId (mathematically rare):

```typescript
// First collision uses last 6 digits
if (hasCollision) {
  // Second collision uses first 6 digits instead
  const firstSixHash = hash.slice(2, 8);
  const collisionEthMferId = (parseInt(firstSixHash, 16) % 9999) + 1;
  
  // Sum both to reach original Mfers collection
  const originalMferNumber = (firstEthMferId + collisionEthMferId) % 10000;
  
  // Store in localStorage for future collision detection
  localStorage.setItem('mferMints', JSON.stringify(existingMints));
}
```

**Result:** 🌠 A rare event that creates prestige without power.

## 📦 Project Structure

```
KinGallery+MferMint/
├── contracts/
│   ├── KinGallery.sol                    # Payment hub (v2: 0x0426...)
│   └── MferBk0Base_FreshStart_Standby.sol # Artist contract (ready to deploy)
├── app/
│   ├── page.tsx                           # Home (welcome page)
│   ├── gallery/
│   │   └── page.tsx                      # Page 2 (mint result + certidão)
│   └── components/
│       ├── MagicMintButton.tsx            # Main UI (animation + entanglement logic)
│       └── ArtworkMetadata.tsx            # Mint info + collision display
├── MFER_GENESIS_STORY.md                 # The philosophy & story
├── QUICK_REFERENCE.md                    # 5-min fix guide
└── [other documentation]
```

## 🎯 Key Features

### 1. **No Extraction**
```solidity
// Every mint split automatically:
// 0.0002 ETH → Artist
// 0.0001 ETH → Gallery (creator support)
// (Uses safe .call{value:} pattern for smart wallets)
```

### 2. **Cryptographic Entanglement**
- Deterministic: same hash → same number
- Immutable: written to blockchain forever
- Pseudo-random: appears random but reproducible
- Connected: links Base NFT to Ethereum history

### 3. **Narrative System**
Each mint displays:
- 🎨 Your artwork (IPFS)
- #️⃣ Edition number (tokenId)
- 🔗 Entangled Legacy Mfer (#N from Ethereum)
- 📅 Birth date (when you minted)
- 🔐 Certidão (transaction hash as proof)
- 🌠 Collision event (if rare enough)

### 4. **Paymaster Integration**
- Uses Coinbase CDP Paymaster
- Gas fees sponsored automatically
- Works with EOA and Smart Wallets
- Zero secrets in codebase

## 🎨 The UI Flow

### Page 1: Welcome
```
[Magic Button spinning]
"Welcome to Connect"
  ↓ Click
[Wallet Modal]
```

### Page 2: Login-to-Mint
```
Connected: 0xbcd9...4d
[Magic Button with new animation]
"LOGIN-to-MINT"
  ↓ Click
```

### Page 3: Minting (8 seconds)
```
[Legacy-Mfer-Entanglement animation with spinning cubes]
[Loading overlay appears during wallet verification]
  ↓ After 8 seconds
[Slide-out animation to Page 2]
```

### Page 4: Gallery (Your Mint)
```
Confetti animation (3s) + Mystery "🌀 Discovering entangled Mfer..."
  ↓ After 4s reveal
[Your artwork (Mfer)]
[Entanglement info: "Ethereum Mfer #N from original lineage (2021)"]
[Destiny message: "The soul spins at a base —"]
[Certidão section - hash, date, block, legacy Mfer]
[Collision event badge (if applicable)]

NOTE: Only interactive element = "view on basescan" link (small text under tx hash)
No action buttons - pure information display per Magic Button philosophy
```

## 🔐 Environment Setup

Create `.env.local`:
```env
# CDP Paymaster (public, safe to expose)
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v2/base/[YOUR_KEY]

# WalletConnect (public ID)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=44788a3961a4e5fa217c4ddb6ae62da8

# Contract Addresses
NEXT_PUBLIC_KINGALLERY_CONTRACT=0x0426413cBfC3b11f6DEd32D3ef30D53a56B12FF6
NEXT_PUBLIC_MFERBKOBASE_CONTRACT=0x[new address after deploy]
NEXT_PUBLIC_USDC_CONTRACT=0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913

# Chain
NEXT_PUBLIC_CHAIN_ID=8453
```

## 🧪 Testing Checklist

### ✅ UI/UX Tests
- [ ] Magic Button animation plays correctly
- [ ] Slide animation triggers after 8 seconds
- [ ] Loading overlay appears during wallet verification
- [ ] Error modal appears on transaction failure
- [ ] Page 2 shows confetti → mystery reveal → metadata

### ✅ Smart Wallet Tests
- [ ] Mint succeeds
- [ ] NFT transfers to wallet
- [ ] Gallery commission (0.0001 ETH) received
- [ ] Artist commission (0.0002 ETH) received

### ✅ EOA Tests
- [ ] Mint succeeds (now that payee2 is configured)
- [ ] Same commissions as Smart Wallet
- [ ] Network validation works

### ✅ Collision Tests
- [ ] First collision detected in localStorage
- [ ] Second collision uses first 6 digits
- [ ] Original Mfers number calculated correctly
- [ ] Collision badge displays on Page 2

## 📊 Deployment Checklist

### Contract
- [ ] Compiled with Solidity 0.8.19
- [ ] Constructor args correct (gallery address, owner)
- [ ] Verified on BaseScan
- [ ] maxTotalSupply declared (for BaseScan metadata)

### Frontend
- [ ] .env.local has correct contract addresses
- [ ] npm run build succeeds
- [ ] Test mint works end-to-end
- [ ] Vercel/deployment configured

### Documentation
- [ ] README updated
- [ ] Genesis story documented
- [ ] Collision system explained to users

## 🎓 Philosophy

This project embodies:

1. **Artist-First Design** - Technology serves the creator
2. **Beauty Through Constraints** - Limitations encode meaning
3. **Narrative Over Speculation** - Each mint tells a story
4. **Poetic Code** - Systems that read like poetry
5. **Opposition to Greed** - Explicit anti-extraction stance

**"Here, we do things differently. Here, we write poetry in the machine."**

## 🤝 Contributing

Before changing code, ask:
- Does this honor the artist?
- Does this add narrative?
- Does this encode beauty or extraction?
- Would this survive poetic scrutiny?

If the answer is yes to all: submit a PR.

## 📚 Further Reading

- [MFER_GENESIS_STORY.md](./MFER_GENESIS_STORY.md) - Full story & philosophy
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - 5-min reference
- [DIAGNOSTICO_PAYANDMINT_EOA_FAILURES.md](./DIAGNOSTICO_PAYANDMINT_EOA_FAILURES.md) - Technical deep-dive

## 📞 Support

Questions? Issues?

1. Check the documentation files first
2. Look at the Genesis Story for philosophical guidance
3. Review deployment checklist for technical issues

---

**"In greedy times, we plant flags. This is ours."** 🚩✨

Made with poetry and persistence by Kinwiz.base.eth  
January 2026
