# ⚠️ MAGIC BUTTON — HANDLE WITH CARE

> **One wrong backtick. One missing bracket. One extra import. The app breaks.**
> This is not an exaggeration. It has happened multiple times.

---

## What This File Is

`app/components/MagicMintButton.tsx` is the heart of the entire app.
It is **1700+ lines** of tightly integrated code that handles:

- Wallet connection (Smart Wallet + EOA + WalletConnect + Farcaster)
- Chain switching and validation (must be Base 8453, always)
- Transaction construction and submission
- CDP Paymaster integration (gas sponsorship)
- An 8-second animated ritual sequence with precise timing
- Entanglement calculation from transaction hash
- Slide-out transition to the gallery page
- Error states, overlays, countdowns, and confetti

All of this is **one component**. Touch one part, you risk breaking another.

---

## Known Ways It Has Broken Before

| What happened | Why it broke |
|---|---|
| Art image pointed to Netlify URL | Dynamic URL expired — marketplaces couldn't load art |
| Transactions going to ETH Mainnet | Wrong chain ID — money sent to wrong network |
| Agent added an import that didn't exist | App failed to compile entirely |
| Agent removed a hook that was "unused" | Broke paymaster detection silently |
| PT-BR comments confused an agent | It rewrote logic based on misread comments |
| Extra `}` or missing `,` in JSX | Cascading parse errors across the file |
| `useCapabilities` removed as "deprecated" | Broke Smart Wallet paymaster for all users |

---

## Rules Before Touching This File

1. **Read the whole file first.** Don't edit based on a 50-line snippet.
2. **Never remove hooks that look unused.** They may be defensive or have side effects.
3. **Never change chain IDs.** Always Base `8453`. Always.
4. **Never point art/media to Netlify or local paths.** IPFS only.
5. **Test the full flow** — connect → mint → gallery — before committing.
6. **CSS is load-bearing.** The animation timing, z-index stacking, and blend modes are intentional. Changing one value can destroy the visual entirely.
7. **Ask before adding dependencies.** Every new import is a risk.

---

## The Animation System

The button runs a sequence of states with precise timing:

```
idle → connecting → minting (8s countdown) → success overlay → slide to gallery
```

Each state has its own UI, CSS class, and media asset. The timing is **not arbitrary** — it was tuned to match video/WebP animation durations in `/public/MagicButton-OfficialAnimatedTitles/`.

If you change timing, you must also check the corresponding animation file lengths.

---

## The Paymaster

Gas is sponsored via **CDP Paymaster** for Smart Wallets. The detection is dynamic:

```typescript
// This is intentional and must stay — do not remove
const { data: availableCapabilities } = useCapabilities({ account: address });
```

If this is removed or refactored without care, users will be asked to pay gas even though the system is supposed to be gasless.

---

## The Entanglement

On successful mint, the transaction hash determines which Ethereum Mfer gets linked:

```typescript
const lastSixHash = hash.slice(-6);
const ethMferId = (parseInt(lastSixHash, 16) % 9999) + 1;
```

This runs **after** the transaction confirms. It must receive the real transaction hash — not a mock, not a timeout. If the tx flow is changed, verify this still runs with the real hash.

---

## Who Owns This

**Kinwiz** (kinwiz.base.eth) — artist and project owner.

Before making any changes to this file, UI visuals, or animation assets, **consult Kinwiz first**. Do not add phrases, commands, words, or symbols without explicit approval.

This is not standard web development. It is a crafted experience. Treat it accordingly.

---

*Last updated: May 2026*
