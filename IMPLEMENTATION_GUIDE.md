# KinGallery + MferMint - Complete Implementation Guide

**Last Updated**: January 7, 2026  
**Status**: Production Ready  
**Language**: English

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Smart Contracts](#smart-contracts)
4. [Deployment Instructions](#deployment-instructions)
5. [Security Considerations](#security-considerations)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

---

## Project Overview

**KinGallery** is a gasless NFT minting platform built on Base chain that combines:

- **Smart Contract**: Payment processing and minting gateway
- **Paymaster Integration**: Wallet Server V2 for transaction sponsorship
- **Frontend**: Next.js + Onchainkit for seamless user experience
- **Relayer**: Automated payment processing and ETH distribution

### Key Features

✅ **Gasless Minting** - Users pay in ETH or USDC, no gas fees  
✅ **Multiple Payment Methods** - USDC tokens or native ETH  
✅ **Role-Based Access** - Admin and Relayer roles for security  
✅ **Duplicate Prevention** - Payment IDs prevent replay attacks  
✅ **Fee Flexibility** - Configurable basis points for platform fees  

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌────────────┐      ┌──────────────┐      ┌─────────────┐  │
│  │   Connect  │      │ Transaction  │      │    Share    │  │
│  │   Wallet   │      │    Button    │      │   to Farcaster│
│  └────────────┘      └──────────────┘      └─────────────┘  │
└──────────────────────────────────────────────────────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼─────────┐
                    │  Onchainkit        │
                    │  + Paymaster       │
                    └──────────┬─────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐  ┌──────────▼─────┐  ┌─────────────▼────┐
│  KinGallery    │  │  MferMint      │  │  Wallet Server   | NOT OPERATING
│  Contract      │  │  Contract      │  │  V2 (Relayer)    │
│  (Base Chain)  │  │  (Base Chain)  │  │  (Signing Server)│
└───────┬────────┘  └──────────┬─────┘  └─────────────┬────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                    ┌──────────▼─────────┐
                    │   USDC Token       │
                    │   (Base Chain)     │
                    └────────────────────┘
```

### Data Flow - USDC Payment

```
User Input → Relayer → Process Payment → Fee Distribution
                ↓              ↓                ↓
            [USDC]      [Split Amount]   [Fee + Mint Amount]
                                              ↓
                                        Artist Contract
                                              ↓
                                           MferMint
                                              ↓
                                          NFT Minted
```

---

## Smart Contracts

### KinGallery.sol

**Address**: Deployed to Base Mainnet  
**Standard**: ERC-20 compatible payment gateway  

#### Key Functions

##### `processPayment()`
```solidity
function processPayment(
    address artistContract,
    address to,
    uint256 amount,
    string calldata paymentId
) external onlyRelayer nonReentrant
```

- **Purpose**: Process USDC payment and mint NFT
- **Permissions**: Only Relayer role
- **Requirements**:
  - Payment ID not yet processed
  - Sufficient USDC balance
  - Valid recipient addresses
- **Events**: `Processed` emitted with full transaction details

##### `payAndMint()`
```solidity
function payAndMint(
    address artistContract,
    address to,
    string calldata paymentId
) external payable nonReentrant
```

- **Purpose**: Direct ETH payment and minting
- **Amount**: Exactly `MINT_PRICE = 300_000_000_000_000` (300 USDC equivalent)
- **Distribution**:
  - `PAYEE1_AMOUNT = 200_000_000_000_000` → payee1
  - `PAYEE2_AMOUNT = 100_000_000_000_000` → payee2
  - Remainder → artist contract
- **Events**: `Processed` emitted

##### `setRelayer()`
```solidity
function setRelayer(address _relayer) external onlyRole(DEFAULT_ADMIN_ROLE)
```

- **Purpose**: Grant Relayer role to new address
- **Permissions**: Admin only
- **Events**: `RoleGranted` emitted

##### `setFee()`
```solidity
function setFee(address _recipient, uint256 _bps) 
    external onlyRole(DEFAULT_ADMIN_ROLE)
```

- **Purpose**: Update fee recipient and percentage
- **Parameters**:
  - `_bps`: Basis points (1-10000, where 10000 = 100%)
  - Example: 250 bps = 2.5% fee
- **Permissions**: Admin only
- **Events**: `FeeUpdated` emitted

### MferMint.sol (Integration)

**Interface Requirements**:
```solidity
function mintFor(address to, string calldata paymentId) external
function mintForWithEthFromGallery(address to, string calldata paymentId) 
    external payable
```

---

## Deployment Instructions

### Prerequisites

- [ ] Base Mainnet wallet with ~2 ETH (for deployment + testing)
- [ ] USDC (Base) for fee testing
- [ ] Access to Remix IDE or Hardhat
- [ ] Gnosis Safe multisig set up (or admin wallet)

### Step 1: Deploy KinGallery Contract

#### Via Remix (Recommended for Security)

1. Navigate to [remix.ethereum.org](https://remix.ethereum.org)
2. Create new file: `KinGallery.sol`
3. Copy contract code
4. Compile with Solidity 0.8.19
5. Select "Injected Web3" environment
6. Switch to Base Mainnet in wallet
7. Enter constructor parameters:
   - **USDC**: `0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`
   - **Multisig**: `0x4d639D1Bd428899599F0Da564926DA1a1A3bd3a8`
   - **Payee1**: `0x...` (recipient 1)
   - **Payee2**: `0x...` (recipient 2)
8. Deploy and note contract address

#### Via Hardhat

```bash
npx hardhat deploy --network base --constructor-args \
  0x833589fcd6edb6e08f4c7c32d4f71b54bda02913 \
  0x4d639D1Bd428899599F0Da564926DA1a1A3bd3a8 \
  0x... \
  0x...
```

### Step 2: Verify on BaseScan

1. Go to [basescan.org](https://basescan.org)
2. Search deployed contract address
3. Click "Verify and Publish"
4. Select "Solidity (Single File)"
5. Choose compiler version: 0.8.19
6. Paste contract code
7. Enter constructor arguments (ABI encoded)
8. Verify

### Step 3: Configure Relayer via Multisig

1. Connect multisig to [app.safe.global](https://app.safe.global)
2. Go to Transactions → New Transaction
3. Select "Contract Interaction"
4. Enter KinGallery contract address
5. Load ABI from `abi.json`
6. Select `setRelayer` function
7. Enter relayer address (Wallet Server V2)
8. Review, sign, and execute

### Step 4: Deploy Frontend

```bash
# Clone and setup
git clone https://github.com/your-repo/KinGallery+MferMint
cd KinGallery+MferMint
npm install

# Configure environment
cp .env.example .env.local

# Edit .env.local
NEXT_PUBLIC_GALLERY_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
PAYMASTER_SECRET=your-secret-key-here

# Deploy to Netlify
npm run build
netlify deploy --prod
```

---

## Security Considerations

### Access Control

**Admin Role** (DEFAULT_ADMIN_ROLE):
- Can set fees and recipients
- Can add/remove relayers
- Can withdraw funds
- **Storage**: Gnosis Safe multisig recommended

**Relayer Role** (RELAYER_ROLE):
- Can process USDC payments
- Cannot modify contract state
- **Credential**: Secure environment variable

### Private Key Management

```bash
# NEVER commit secrets
echo "RELAYER_KEY=0x..." >> .gitignore

# Use secure vault
export RELAYER_KEY=$(aws secretsmanager get-secret-value \
  --secret-id kingly/relayer-key | jq -r '.SecretString')
```

### Rate Limiting

Implement rate limits on relayer API:

```javascript
// Netlify function example
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,      // 1 minute
  max: 100,                 // 100 requests per minute
  message: 'Too many requests'
});

exports.handler = limiter(async (event) => {
  // Process payment
});
```

### Monitoring

Set up alerts for:
- Duplicate payment attempts
- Fee configuration changes
- Relayer role changes
- Large withdrawals

---

## API Reference

### POST `/api/relay`

Process USDC payment and mint NFT.

**Request Body**:
```json
{
  "paymentId": "unique-txn-id-2026-01-07-001",
  "amount": 300000000,
  "to": "0x...",
  "artistContract": "0x...",
  "signature": "0x..."
}
```

**Response** (Success):
```json
{
  "success": true,
  "txHash": "0x...",
  "processed": true,
  "message": "Payment processed and NFT minted"
}
```

**Response** (Error):
```json
{
  "success": false,
  "error": "Payment already processed",
  "code": "DUPLICATE_PAYMENT"
}
```

---

## Troubleshooting

### Common Issues

#### "Insufficient USDC Balance"
- **Cause**: Contract doesn't have enough USDC
- **Solution**: Deposit USDC to contract address via multisig

#### "Payment Already Processed"
- **Cause**: Payment ID was already used
- **Solution**: Generate unique payment ID for each transaction

#### "Only Relayer"
- **Cause**: Caller is not granted RELAYER_ROLE
- **Solution**: Call `setRelayer()` from admin wallet

#### "MferMint Call Failed"
- **Cause**: Artist contract not set up or MferMint not implemented
- **Solution**: Verify artist contract is at correct address and implements IMferMint

#### Gas Issues on Base

Base uses minimal gas costs. If still seeing high costs:
1. Verify Base Mainnet (chain 8453) is selected
2. Check RPC endpoint (use official Coinbase RPC)
3. Ensure no unnecessary loops or storage operations

---

## Support & Contact

**Email**: support@kingly.dev  
**Discord**: [Join Community](https://discord.gg/kingly)  
**GitHub Issues**: [Report Bug](https://github.com/kingly/issues)

---

## License

MIT License - See LICENSE file for details

---

**Version History**

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 7, 2026 | Initial production release |

