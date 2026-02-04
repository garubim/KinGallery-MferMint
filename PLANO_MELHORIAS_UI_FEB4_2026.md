# 🎯 UI IMPROVEMENTS PLAN - FEB 4, 2026

**Current Status**: ✅ Checkpoint created at commit `16b93f1`  
**Solid Foundation**: Magic Button working + Gallery 3-tier + No logic errors

---

## 📋 IDENTIFIED ITEMS FOR CORRECTION

### 🎨 **1. ORIGINAL MFER IMAGE - Entanglement Visual**
**Problem**: Missing original Mfer image loading to show the "entanglement"  
**Working Reference**: [Commit 5d40bd5](https://github.com/garubim/KinGallery-MferMint/commit/5d40bd570e23c030cb0f362fafe6ca4fb606b808) (⚠️ extract ONLY image loading code, avoid the logic errors)

**Implementation Strategy**:
- [ ] Extract ONLY the image loading code from commit 5d40bd5
- [ ] Apply to current `app/gallery/page.tsx` file (without the logic errors)
- [ ] Test that original Mfer image appears correctly
- [ ] Maintain all 3-tier loading logic working

**Affected Files**: `app/gallery/page.tsx`

---

### 🔗 **2. "CONNECTED" LINE - Wallet Information**
**Problem**: Current builds eliminated the line showing which wallet is connected  
**Expected Location**: Between "Title" and "Price" on main page

**Implementation Strategy**:
- [ ] Locate where "Connected [abbreviated_address]" line should appear
- [ ] Check if it exists in `ArtworkMetadata.tsx` or `page.tsx`
- [ ] Implement conditional display (only when `isConnected && address`)
- [ ] Format: `Connected 0x1234...5678`
- [ ] Style consistent with current design

**Affected Files**: `app/components/ArtworkMetadata.tsx`

---

### 🎭 **3. MAGIC BUTTON REFLEX - Media Update**
**Problem**: Magic Button using old media for reflections  
**Fix**: Switch to `MagicButton-NewReflex-Box16.webp`

**Implementation Strategy**:
- [ ] Locate all reflex references in `MagicMintButton.tsx`
- [ ] Verify `MagicButton-NewReflex-Box16.webp` exists in `/public/MagicButton-OfficialAnimatedTitles/`
- [ ] Replace old references with new media
- [ ] Test that reflex appears correctly in all states

**Current File**: `/public/MagicButton-OfficialAnimatedTitles/MagicButton-NewReflex-Box16.webp` ✅ (already exists)  
**Affected Files**: `app/components/MagicMintButton.tsx`

---

### #️⃣ **4. HASH DISPLAY - Page 2 (Gallery)**
**Current Problem**: 
```
Hash
🔗 botar
```

**Desired Format**:
```
Hash    🔗 0x1a8b...421f
```

**Implementation Strategy**:
- [ ] Locate hash display section in `app/gallery/page.tsx`
- [ ] Implement hash abbreviation: `${hash.slice(0, 6)}...${hash.slice(-4)}`
- [ ] Keep clickable link to BaseScan
- [ ] Adjust spacing and formatting

**Affected Files**: `app/gallery/page.tsx`

---

### 💨 **5. SMOKE ADJUSTMENTS - Trait Display Format**
**Status**: ✅ Specification received  
**What is Smoke**: Mfer trait that contributes to rarity ("smoke" or "no smoke"). Used as part of metadata pack released with each Mfer-0-base mint, displayed in the area where we publish the original Mfer together with its metadata.

**Display Format**:
- **With Smoke**: `Smoke: a lot 🚬 ✔️` or `Smoke: a lot 🚬 🌀`
- **No Smoke**: `Smoke: 🚭 no 🚬 smoke`

**Implementation Strategy**:
- [ ] Locate where Smoke trait is displayed in original Mfer metadata section
- [ ] Implement conditional display based on trait value
- [ ] Apply specified emoji formatting for both smoke/no-smoke states
- [ ] Likely in `app/gallery/page.tsx` in the original Mfer metadata section

**Affected Files**: `app/gallery/page.tsx`

---

## 🔄 PROPOSED EXECUTION SEQUENCE

### **PHASE 1**: Preparation and Analysis (5 min)
1. Check current content of each affected file
2. Confirm exact location of each element
3. Validate that media files exist

### **PHASE 2**: Safe Implementations (15 min)
1. **Reflex Media** (simplest) - MagicMintButton.tsx
2. **Connected Line** (basic UI) - ArtworkMetadata.tsx  
3. **Hash Display** (formatting) - gallery/page.tsx

### **PHASE 3**: Complex Implementation (20 min)
4. **Original Mfer Image** (careful extraction from commit 5d40bd5)

### **PHASE 4**: Validation and Testing (10 min)
5. **Smoke Adjustments** (after confirming details)
6. Complete functionality testing
7. Final commit

---

## ⚠️ SPECIAL CARE

### **Magic Button (MagicMintButton.tsx)**
- ✅ **DO NOT TOUCH** transaction logic (working)
- ✅ **DO NOT TOUCH** wallet connection logic (working)  
- 🎯 **ONLY** update reflex media path

### **Gallery (gallery/page.tsx)**  
- ✅ **PRESERVE** 3-tier loading (Blockscout → RPC → localStorage)
- ✅ **PRESERVE** all fallback logic
- 🎯 **ONLY** add original Mfer image and adjust hash display

### **Artwork Metadata (ArtworkMetadata.tsx)**
- 🎯 **ONLY** add "Connected" line without affecting pricing/metadata

---

## 🎯 EXPECTED RESULTS

**Desired Final State**:
- ✅ Magic Button working (preserved)
- ✅ Gallery 3-tier working (preserved)  
- ✅ Hybrid wallet support working (preserved)
- ➕ Original Mfer image appearing
- ➕ "Connected" line visible
- ➕ Updated reflex on Magic Button
- ➕ Hash formatted correctly in Gallery
- ➕ Smoke adjusted (after confirmation)

**Risk**: 🟢 **LOW** - Changes are mainly visual/UI, don't affect core logic

---

## 📞 NEXT STEPS

1. **✅ CHECKPOINT CREATED** - Current state preserved (commit 16b93f1)
2. **✅ DOCUMENT CREATED** - Complete planning  
3. **✅ SMOKE FORMAT DEFINED** - Trait display specification received
4. **✅ ALL 5 IMPROVEMENTS DEFINED** - Ready for implementation

**IMPLEMENTATION READY**:
- Phase 1: Magic Button reflex media update (MagicMintButton.tsx)
- Phase 2: Connected wallet line (ArtworkMetadata.tsx)
- Phase 3: Hash formatting (gallery/page.tsx)
- Phase 4: Original Mfer image extraction (gallery/page.tsx)
- Phase 5: Smoke trait formatting (gallery/page.tsx)

**Status**: ✅ Ready to implement all 5 improvements when session resumes! 🚀

**Git Checkpoint**: `16b93f1` - 100% functional baseline preserved