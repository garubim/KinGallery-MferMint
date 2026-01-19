# 🎭 Ritual Phrases - Opções para Escolha

## Timeline implemented

### AFTER CONNECTION (4-5 seconds)
```
User connects wallet
  ↓
Phrases appear sequentially over the Magic Button:

1. "The eyes see the flatline"     [2000ms]
2. "at 9 o'clock"                  [1000ms]
3. "The mouse bends it"            [1200ms]
4. "into a smile"                  [200ms]
5. "and spins the loop onchain"    [3000ms]//

Total: ~8. seconds
```
### 5th Phrase - Call-to-Action Options

#### Implement:
```typescript
// function getEternalLoop() public pure returns (string memory) {
    return "The base is static. The soul spins. The smile returns at 9.";
}```

#### Other Options: archive these
```typescript
"and writes it in history"    // Blockchain permanence
"and engraves its soul"       // Poético, alma/identidade
"and clicks to take it"       // Direto, possessão
```

**To change**: Edit line 15 in `MagicMintButton.tsx`

---

## AFTER MINT (Transition to Gallery)
### Success State (2s before redirect)
```
✅ MINT SUCCESS!
NFT #123456

[Wait 2 seconds]
```

### Redirect to /gallery
```
router.push('/gallery?tokenId=123456')
```

---

## SECOND SCREEN (/gallery page)

### Entrance (Right after loading)
```
"The soul spins at a base -
 where the smile comes home."

[Dramatic pause 2s]

[NFT Card shows with tokenId and blockchain info]
```

### End of ritual time to check the art and other mints.
```
User checks the minted NFT and other pieces...

[Last message fades in bellorw the BFT card

"This is not an animation...
 it's a ritual!"
```

---

## Narrative Structure

### Act 1: Presentation (Splash)
- "Save the ritual on your profile"
- [WebP animation playing in loop]
### Act 2: Connection (Magic Button - connects to Wallet/Welcome)
- "Welcome to Kinmutable lore/art"
- "You're early to KinGallery"
- "Connect to KinGallery"
- "Click to Connect
- [WebP for when user clicks Connect]
- [WalletConnect modal]

### Ato 3: Describes the artwork (Magic Button - connected)
- "The eyes see the flatline"
- "at 9 o'clock"
- "The mouse bends it"
- "into a smile"
- "and spins the loop onchain"
- "[call-to-action]"
- [Ready to mint]

### Act 4: The Transaction (During mint)
- [Loading state]
- [Backend events on the timeline]

### Act 5: The Revelation (Gallery)
- "The soul spins at a base - where the smile comes home"
- [NFT appears]
- [User explores]
- "This is not animation... it's a ritual!"

---

## Correct Antagonism

❌ **WRONG**: "it's a ritual" alone (no context)

✅ **CORRECT**: 
```
"This is not animation...
 it's a ritual!"
```

The antagonism "animation vs ritual" is the core of the message:
- Animation = passive, just observe
- Ritual = active, participate, belong

---

## Total Timing

| Phase | Duration | Key Element |
|------|---------|----------------|
| Splash | 4.5s | Save the ritual |
| WebP Loop | ∞ | Welcome to Connect |
| Connect Click | instant | WebP pause |
| Wallet Modal | 2-5s | User action |
| Ritual Phrases | 4.3s | 5 sequential phrases |
| Ready to Mint | ∞ | User decides |
| Mint Process | 3-7s | Blockchain |
| Success | 2s | Celebration |
| Gallery Load | instant | New page |
| Soul Spins | 2-3s | Poetic transition |
| NFT Card | ∞ | User explores |
| Final Message | fade-in | "it's a ritual!" |

**Total**: ~15-30s from splash to complete mint (depends on user)



---

## Current Implementation
✅ Splash with 4.5s timeout
✅ WebP pause on click
✅ ETH/USDC buttons on the sides
✅ 5 animated phrases after connection
⏳ Second screen /gallery (to be created)
⏳ Final message "it's a ritual!" (to be created)

3 informations to iimplement:
*   **Real-time supply counter**: `totalMinted() / MAX_SUPPLY`
*   **Clear mint price**: `MINT_PRICE` (in ETH and aprox USD value)
*   **A direct link** to the verified contract on Basescan for transparency.