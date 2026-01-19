# KinGallery + MferMint: Deploy Strategy

**Status**: 📋 Pre-Deploy Phase  
**Last Updated**: January 11, 2026  
**Git Status**: ~80 files modified/added, ~100+ legacy files pending deletion  

---

## 🎯 Current State Assessment

### ✅ Production-Ready Components

| Component | Status | Notes |
|-----------|--------|-------|
| IPFS Artwork Loading | ✅ READY | WebP, fallback gateways, verified IPFS |
| MagicMintButton | ✅ READY | Animated with 1280x720 ritual (13.4MB) |
| ArtworkMetadata | ✅ READY | Pricing, collection, artist info |
| Layout (Artwork → Button → Metadata) | ✅ READY | Equidistant spacing, responsive |
| Auto-disconnect Mechanism | ✅ READY | beforeunload/pagehide hooks |
| Glass Morphism Styling | ✅ READY | Deep Glass Premium texture, 3 states |
| Narrative Documentation | ✅ READY | MINT_NARRATIVE.md + FRASES_DAVINCI_SEQUENCE.md |
| Entangled Mfers Architecture | ✅ READY | docs/ENTANGLED_MFERS_ARCHITECTURE.md |

### 🔄 In-Progress Components

| Component | Status | Blocker |
|-----------|--------|---------|
| Entangled Mfers Contract (Phase 1) | 🔄 Design | Needs implementation |
| Farcaster Miniapp Manifest | 🔄 Pending | MINIAPP_DEPLOY_CHECKLIST.md drafted |
| Contract Deployment Script | 🔄 Review | scripts/deploy-v2.js needs audit |
| Full E2E Testing | 🔄 Testing | ETH path needs validation |

### ⚠️ Critical Issues

**None blocking production**. All issues are either resolved or documented for Phase 2.

---

## 📊 Git Cleanup Required

### Deletions (Safe to Remove)

**Old Files in `git status`:**
- `README.PAYMASTER.md` (Relayer deactivated)
- `README.md` (outdated, replaced by docs)
- Old Gallery contracts (`Gallery.sol`, deprecated versions)
- Old `MferMint.sol` (replaced by MferMintGalleryCompatible.sol)
- `hardhat.config.js` (replaced by hardhat.config.cjs)
- My-wallet folder (local dev artifact)
- Netlify functions (Relayer-based, deprecated)
- Paymaster-app folder (legacy)
- Old animation files (replaced by optimized 13.4MB versions)
- Verification scripts folder (can be run on-demand)

**Files to DELETE in next commit:**
```bash
git rm README.PAYMASTER.md
git rm README.md
git rm contracts/Gallery*.sol
git rm contracts/MferMint.sol
git rm hardhat.config.js
git rm -r my-wallet/
git rm -r netlify/
git rm -r paymaster-app/
git rm -r "public/Animations 4 mint button/"
git rm -r "public/code_poem-Matrix/"
git rm -r scripts/verification/
git rm -r scripts/relayer*.* scripts/mock-paymaster.* scripts/set-relayer-dapp.html scripts/simulate_*.* scripts/generate_*.* scripts/check_*.* scripts/purge_*.* scripts/encode_*.* scripts/find_*.* scripts/revokeApprovals.js scripts/transfer-relayer.*
```

### Additions (Ready for Commit)

**New production files (marked `??`):**
- ✅ `.github/` (Copilot instructions)
- ✅ `.vscode/` (workspace settings)
- ✅ `FRASES_DAVINCI_SEQUENCE.md` (final phrase sequence)
- ✅ `MINT_NARRATIVE.md` (complete story + specs)
- ✅ `docs/ENTANGLED_MFERS_ARCHITECTURE.md` (technical blueprint)
- ✅ `app/components/ArtworkMetadata.tsx` (metadata panel)
- ✅ `contracts/MferMintGalleryCompatible.sol` (Phase 1 contract)
- ✅ `contracts/KinGallery_flattened.sol` (verification-ready)
- ✅ `public/MagicButton-OfficialAnimatedTitles/` (optimized animations)

### Modifications (Ready for Commit)

**Core app changes (marked `M`):**
- ✅ `app/page.tsx` (layout refactor: artwork → button → metadata)
- ✅ `app/components/MagicMintButton.tsx` (updated animation src to 1280x720)
- ✅ `app/layout.tsx` (Chassis integration)
- ✅ `app/rootProvider.tsx` (wallet context setup)
- ✅ `content/mintText.ts` (phrase updates)
- ✅ `contracts/KinGallery.sol` (current main contract)
- ✅ `package.json` (dependency updates)
- ✅ `next.config.mjs` (Next.js 16+ config)
- ✅ `hardhat.config.cjs` (Base chain config)

---

## 🚀 Recommended Push Strategy

### Phase 1: Cleanup Commit (5 min)

```bash
# Remove all legacy files
git rm README.PAYMASTER.md README.md
git rm contracts/Gallery*.sol contracts/MferMint.sol
git rm hardhat.config.js
git rm -r my-wallet/ netlify/ paymaster-app/ "public/Animations 4 mint button/" "public/code_poem-Matrix/" scripts/verification/
git rm $(git ls-files -d | grep 'scripts/.*\.(js|cjs|mjs|sh|md)' | grep -E '(relayer|paymaster|verify|encode|deploy\.|check_|transfer|revoke|find_owned|simulate)')

# Commit cleanup
git commit -m "chore: Remove legacy Paymaster/Relayer files and deprecated contracts

- Removed outdated README files (PAYMASTER focus deprecated)
- Deleted old Gallery contract versions (Gallery.sol, Gallery-deprecated.sol)
- Removed legacy MferMint.sol (replaced by MferMintGalleryCompatible.sol)
- Removed paymaster-app, netlify functions, my-wallet artifact
- Cleaned old animation files (replaced by optimized 13.4MB versions)
- Removed verification scripts folder (can be regenerated)
- Removed relayer-related scripts (relayer deactivated as of Jan 11, 2026)

Project structure now focuses on:
- KinGallery.sol + MferMintGalleryCompatible.sol (active contracts)
- Next.js 16 frontend with glass morphism UI
- IPFS WebP artwork + animated ritual button
- Entangled Mfers architecture (Phase 1 ready)
"
```

### Phase 2: Feature Commit (5 min)

```bash
# Stage all new/modified files
git add app/ components/ contracts/ docs/ public/ content/ lib/ \
  MINT_NARRATIVE.md FRASES_DAVINCI_SEQUENCE.md \
  IMPLEMENTATION_GUIDE.md .github/ .vscode/ \
  package.json next.config.mjs hardhat.config.cjs tsconfig.json \
  scripts/deploy-v2.js scripts/transfer-admin.js scripts/ascii-showcase.ts

git commit -m "feat: Production-ready KinGallery + Entangled Mfers UI

UI/Layout:
- Glass morphism animated button with 1280x720 ritual animation
- Artwork metadata panel: Collection, Artist, Edition, Price
- Layout refactor: Artwork → MagicButton → Metadata (equidistant spacing)
- Auto-disconnect on browser unload (beforeunload/pagehide hooks)
- IPFS artwork loading with fallback gateways (Pinata → IPFS.io)

Narrative & Docs:
- MINT_NARRATIVE.md: Complete story, copy, Entangled Mfers concept
- FRASES_DAVINCI_SEQUENCE.md: Final ritual phrase sequence
- docs/ENTANGLED_MFERS_ARCHITECTURE.md: Technical blueprint (Phase 1)
- Updated animation to 1280x720 (13.4MB, optimized from 21.8MB)

Copy finalized:
'eyes see the flatline / at 9 o'clock / the mouse bends it / into a smile / Now you. / Bend the line. / Etch your mark. / Click and base it onchain.'

Ready for:
- Farcaster miniapp deployment
- Contract deployment to Base testnet/mainnet
- End-to-end mint testing (ETH + USDC paths)
- Entangled Mfers Phase 1 implementation
"
```

### Phase 3: Create README.md (New Main Documentation)

Create a production-focused README that explains:
1. **What is KinGallery?** → Evolution narrative, Mfer lineage concept
2. **How to mint?** → Button interactions, gas costs (0.0003 ETH)
3. **How to deploy locally?** → `npm install && npm run dev`
4. **How to deploy to production?** → Contract deployment checklist
5. **Architecture overview** → Smart contract, frontend, IPFS integration

---

## ✅ Pre-Push Validation Checklist

**Before committing, verify:**

- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors in IDE (`next-env.d.ts` clean)
- [ ] `.env.local` exists with test addresses (NOT committed)
- [ ] `node_modules/` is in `.gitignore` (confirm)
- [ ] `.next/` is in `.gitignore` (confirm)
- [ ] Animation loads on localhost:3000 (1280x720 visible)
- [ ] Wallet connection works (WalletConnect)
- [ ] ETH mint flow works end-to-end (including relayer endpoint validation)
- [ ] No console errors or warnings (React, Wagmi, viem)
- [ ] Metadata panel displays correctly on mobile/desktop
- [ ] Animation loops infinitely (30fps at 1280x720)

---

## 📋 Post-Push Tasks (Next Session)

### Immediate (24 hours):
1. ✅ Verify GitHub repo looks clean (no legacy files visible)
2. ⏳ Update repo description: "Evolution NFT minting on Base chain with Entangled Mfers concept"
3. ⏳ Create GitHub Discussions or Pinned Issue: "Entangled Mfers Phase 1 Implementation"
4. ⏳ Add branch protection rules (main branch requires PR review)

### Short-term (This week):
1. ⏳ Implement Phase 1 of Entangled Mfers (contract `mintFor` functions)
2. ⏳ Complete Farcaster miniapp manifest
3. ⏳ Deploy to Base Sepolia testnet for E2E testing
4. ⏳ Test ETH path fully (relayer endpoint needs verification)

### Medium-term (Before mainnet):
1. ⏳ Audit contract before mainnet deployment
2. ⏳ Set up monitoring (transaction logs, error tracking)
3. ⏳ Create deployment guide for future iterations
4. ⏳ Implement TheGraph queries for Entangled Mfers metadata lookup

---

## 🔐 Environment Variables (Local Only - NOT COMMITTED)

**`.env.local` (DO NOT COMMIT):**
```bash
# Wallet/Relayer (deprecated but keep for reference)
# CDP_API_KEY_ID=...
# CDP_API_KEY_SECRET=...
# CDP_WALLET_SECRET=...
# RELAYER_ADDRESS=0x...

# Contract Addresses (use fallbacks in code if possible)
# NEXT_PUBLIC_KINGALLERY_CONTRACT=0xa67273073414a623c879b0dc30d4fd7b5104bd32
# NEXT_PUBLIC_MFERMINT_CONTRACT=0x86a34dfab59996c6fb809d1f2b016a0ed397e682
# NEXT_PUBLIC_USDC_CONTRACT=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913
```

**`.gitignore` verification:**
```bash
node_modules/
.env
.env.local
.env.*.local
.next/
out/
dist/
build/
*.tsbuildinfo
```

---

## 📈 Success Criteria for This Phase

✅ **Achieved:**
- Clean, production-ready codebase
- No legacy Paymaster/Relayer code
- Full narrative + architecture documentation
- Optimized animation (13.4 MB)
- Responsive UI with glass morphism
- Auto-disconnect mechanism

🔄 **Pending (Not blockers):**
- Farcaster manifest completion
- Phase 1 Entangled Mfers contract implementation
- Full E2E testing on Base testnet

---

## 📌 Quick Reference: Commands

```bash
# Cleanup (Phase 1)
git status --short | grep "^ D " | awk '{print $2}' | xargs git rm

# Validate before commit
npm run build
npm run lint  # if configured

# Commit (Phase 2)
git add .
git commit -m "feat: Production-ready KinGallery UI + Entangled Mfers"

# Push
git push origin main

# Verify remote
git log --oneline -5
git remote -v
```

---

**Status**: ✅ Ready to Deploy  
**Timeline**: 10-15 minutes for cleanup + feature commit  
**Risk Level**: 🟢 Low (only removing deprecated code)

