# Documentation Index - KinGallery + MferMint

**Last Updated**: January 27, 2026  
**Language Policy**: ✅ English (public-facing) | Portuguese marked [PT-BR] (internal)

---

## 🚀 START HERE

**New to the project?** Start with these in order:

1. **[DEPLOYMENT_COMPLETE_27JAN2026.md](./DEPLOYMENT_COMPLETE_27JAN2026.md)** ← **START HERE**
   - 5-minute overview of what was accomplished
   - Next immediate action items
   - Links to detailed docs

2. **[FRESH_DEPLOYMENT_SUMMARY_EN.md](./FRESH_DEPLOYMENT_SUMMARY_EN.md)**
   - Executive summary for technical team
   - Architecture decisions explained
   - Key learnings documented

3. **[README_ENGLISH.md](./README_ENGLISH.md)**
   - User-friendly guide
   - How to set up locally
   - How to mint your first NFT

---

## 📚 Complete Documentation Map

### Core Reference (Read First)

| Document | Purpose | Audience | Time |
|----------|---------|----------|------|
| [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | **AUTHORITATIVE SOURCE** - Complete technical specs, all next steps, integration guides | Developers, AI Agents | 30 min |
| [DEPLOYMENT_COMPLETE_27JAN2026.md](./DEPLOYMENT_COMPLETE_27JAN2026.md) | What was done + what's next | Everyone | 5 min |
| [FRESH_DEPLOYMENT_SUMMARY_EN.md](./FRESH_DEPLOYMENT_SUMMARY_EN.md) | Executive summary | Project Managers, Developers | 15 min |
| [README_ENGLISH.md](./README_ENGLISH.md) | How to use the system | End Users, Developers | 20 min |

### Implementation & Verification

| Document | Purpose | Audience | Time |
|----------|---------|----------|------|
| [BASESCAN_VERIFICATION_CLEAN_2026.md](./BASESCAN_VERIFICATION_CLEAN_2026.md) | How to verify contracts on BaseScan | Developers | 10 min |
| [VALIDACAO_INTEGRACAO_CONTRATOS.md](./VALIDACAO_INTEGRACAO_CONTRATOS.md) | Integration testing checklist | QA, Developers | 15 min |
| [DOCUMENTATION_REVIEW_27JAN2026.md](./DOCUMENTATION_REVIEW_27JAN2026.md) | Quality assurance checklist | Project Managers, QA | 10 min |

### Internal Reference (Portuguese - [PT-BR])

| Document | Purpose | Audience | Time |
|----------|---------|----------|------|
| [DOCUMENTO_FINAL_REDEPLOY_27JAN2026_PT-BR.md](./DOCUMENTO_FINAL_REDEPLOY_27JAN2026_PT-BR.md) | Internal team reference | Internal team only | 20 min |

---

## 🎯 Find What You Need

### "I want to..."

**...set up the project locally**
→ Read: [README_ENGLISH.md](./README_ENGLISH.md) → "Quick Start" section

**...understand the architecture**
→ Read: [FRESH_DEPLOYMENT_SUMMARY_EN.md](./FRESH_DEPLOYMENT_SUMMARY_EN.md) → "Technical Highlights" section

**...deploy contracts**
→ Read: [BASESCAN_VERIFICATION_CLEAN_2026.md](./BASESCAN_VERIFICATION_CLEAN_2026.md)

**...test the integration**
→ Read: [VALIDACAO_INTEGRACAO_CONTRATOS.md](./VALIDACAO_INTEGRACAO_CONTRATOS.md)

**...integrate Farcaster**
→ Read: [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) → "Farcaster Miniapp Integration" section

**...integrate Base.app**
→ Read: [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) → "Base.app Smart Wallet Mode" section

**...troubleshoot an issue**
→ Read: [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) → "Troubleshooting Quick Reference" section

**...understand what was fixed**
→ Read: [DEPLOYMENT_COMPLETE_27JAN2026.md](./DEPLOYMENT_COMPLETE_27JAN2026.md) → "Critical Fix Implemented" section

---

## 📋 Contract Information

### Deployed Addresses (Base Network - Jan 27, 2026)

```
KinGallery (Payment Processor):
  Address: 0xebc497a5c36cb1a9264fd122a586b3f461fcc568
  Status: ✅ Verified on Sourcify, BaseScan, BlockScout, RouteScan
  BaseScan: https://basescan.org/address/0xebc497a5c36cb1a9264fd122a586b3f461fcc568

MferBk0Base (NFT Contract):
  Address: 0xaA566959e0290cB578b1F0dfFA7203E1F9DDd1D6
  Status: ✅ Verified on Sourcify, BaseScan, BlockScout, RouteScan
  BaseScan: https://basescan.org/address/0xaA566959e0290cB578b1F0dfFA7203E1F9DDd1D6

Supporting Addresses:
  USDC: 0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913
  Multisig: 0x4d639D1Bd428899599F0Da564926DA1a1A3bd3a8
  Gallery Payee: 0x26dcd83d4e449059abf0334e4435d48e74f28eb0
  Artist EOA: 0xbcd980d37293CBee62Bf5f93a26a0B744C18964D
```

---

## 🔧 Configuration

### Environment Variables (.env.local)

```bash
# Contract Addresses
NEXT_PUBLIC_KINGALLERY_ADDRESS=0xebc497a5c36cb1a9264fd122a586b3f461fcc568
NEXT_PUBLIC_MFERBKOBASE_ADDRESS=0xaA566959e0290cB578b1F0dfFA7203E1F9DDd1D6
NEXT_PUBLIC_USDC_CONTRACT=0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913
NEXT_PUBLIC_CHAIN_ID=8453

# Services (set in .env.local - not checked in to git)
NEXT_PUBLIC_PAYMASTER_URL=<your-paymaster-url>
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<your-project-id>
```

### IPFS Metadata

```
baseURI: ipfs://bafybeihwtlwxbgnzfjsamyr7uyrgi3bt3osv72vv6muesrq7mnvbrtawcq/
Token URI Format: {baseURI}{tokenId}.json
Example: ipfs://bafybeihwtlwxbgnzfjsamyr7uyrgi3bt3osv72vv6muesrq7mnvbrtawcq/1.json
Gateways: https://ipfs.io or https://cloudflare-ipfs.com
```

---

## ✅ Quick Checklist

### Before You Start
- [ ] Read [DEPLOYMENT_COMPLETE_27JAN2026.md](./DEPLOYMENT_COMPLETE_27JAN2026.md)
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.local.example` → `.env.local`
- [ ] Fill in Paymaster URL and WalletConnect Project ID

### To Test Locally
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Connect wallet
- [ ] Click "Magic Button"
- [ ] Check console for errors

### To Deploy to Production
- [ ] Run `npm run build`
- [ ] Test build: `npm start`
- [ ] Push to git (Netlify auto-deploys)
- [ ] Verify on kingallery.netlify.app

### After First Deployment
- [ ] Call `MferBk0Base.setGallery(KinGalleryAddress)` via Remix/BlockScout
- [ ] Test mint flow end-to-end
- [ ] Verify metadata on OpenSea
- [ ] Celebrate! 🎉

---

## 🌍 Language Policy

### ✅ English
- All public-facing documentation
- Code comments (if community-visible)
- README files
- API documentation
- Deployment guides
- Smart contract verification docs
- This file (index)

### 🇧🇷 Portuguese [PT-BR]
- Internal documents only
- Must be clearly marked `[PT-BR]` in filename
- Examples:
  - `DOCUMENTO_FINAL_REDEPLOY_27JAN2026_PT-BR.md`
  - `MEMO_INTERNO_[PT-BR].md`

---

## 📞 Getting Help

### Questions About...

**Smart Contracts?**
→ See: [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) → "Architecture" section

**Frontend Setup?**
→ See: [README_ENGLISH.md](./README_ENGLISH.md) → "Development" section

**Integration?**
→ See: [VALIDACAO_INTEGRACAO_CONTRATOS.md](./VALIDACAO_INTEGRACAO_CONTRATOS.md)

**Farcaster/Base.app?**
→ See: [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) → "Platform Integration" section

**Verification?**
→ See: [BASESCAN_VERIFICATION_CLEAN_2026.md](./BASESCAN_VERIFICATION_CLEAN_2026.md)

**Troubleshooting?**
→ See: [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) → "Troubleshooting Quick Reference"

---

## 📊 Document Statistics

| Metric | Count |
|--------|-------|
| Total Documentation Files | 8 |
| English Documents | 7 |
| Portuguese [PT-BR] Documents | 1 |
| Code Examples | 20+ |
| Testing Checklists | 5 |
| Configuration Sections | 4 |
| Troubleshooting Items | 12+ |

---

## 🔄 How Docs Are Organized

```
📍 Authoritative Source
  └─ .github/copilot-instructions.md
     (All technical specs, all next steps, integration guides)

📍 Quick Start Path
  ├─ DEPLOYMENT_COMPLETE_27JAN2026.md (overview)
  ├─ FRESH_DEPLOYMENT_SUMMARY_EN.md (technical summary)
  ├─ README_ENGLISH.md (user guide)
  └─ BASESCAN_VERIFICATION_CLEAN_2026.md (verification)

📍 Detailed Implementation
  ├─ VALIDACAO_INTEGRACAO_CONTRATOS.md (testing)
  ├─ DOCUMENTATION_REVIEW_27JAN2026.md (QA)
  └─ Platform-specific guides (Farcaster, Base.app)

📍 Internal Reference
  └─ DOCUMENTO_FINAL_REDEPLOY_27JAN2026_PT-BR.md [PT-BR]
```

---

## 🎯 Next Steps

1. **Read**: [DEPLOYMENT_COMPLETE_27JAN2026.md](./DEPLOYMENT_COMPLETE_27JAN2026.md) (5 min)
2. **Setup**: Follow [README_ENGLISH.md](./README_ENGLISH.md) Quick Start (10 min)
3. **Action**: Call `setGallery()` to connect contracts (5 min)
4. **Test**: End-to-end mint test (15 min)
5. **Verify**: Check metadata on OpenSea (5 min)

**Total time**: ~40 minutes to fully operational system ✅

---

## ✨ You're All Set!

Everything is documented, verified, and ready. The system is production-ready!

Happy minting! 🚀

---

**Created**: January 27, 2026  
**Last Updated**: January 27, 2026  
**Maintained By**: Development Team  
**Status**: ✅ Complete and Current  
**Language**: English (per project policy)
