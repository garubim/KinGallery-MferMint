# 🎬 Timeline de Eventos UI - KinGallery Mint Flow

**Atualizado**: 11 de janeiro de 2026  
**Status**: ✅ WebP pausado no click implementado

---

## 📍 PONTO DE PARTIDA (Tela Descoberta)

**Quando**: Splash screen desaparece (após 4.5s conforme seu pedido)  
**Estado**: Magic Button visível, WebP animation tocando em loop infinito  
**User vê**: Botão landscape 420x120px com animação "Welcome to Connect"

```
┌─────────────────────────────────────────────┐
│                                             │
│         [ARTWORK KINKER MFER]               │
│                                             │
│  ╔═══════════════════════════════════════╗  │
│  ║  🎬 WebP Animation TOCANDO (LOOP)    ║  │
│  ║  "Welcome to Connect" texto animado  ║  │
│  ║                                       ║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
└─────────────────────────────────────────────┘

Estado: NOT_CONNECTED
WebP: PLAYING (infinite loop)
```

---

## 🎯 EVENTO 1: User Clica para Conectar

**Duração**: Click instantâneo  
**Trigger**: `handleConnect()` executado  
**Ação do código**: `setWebpAnimationPaused(true)`

### O que acontece:

```typescript
// ✅ IMPLEMENTADO
handleConnect = () => {
  setWebpAnimationPaused(true);  // 🛑 PAUSA WEBP AQUI
  // WalletConnect modal abre
  connect({ connector: walletConnectConnector });
}
```

### Visual:

```
Frame no momento do click:
┌─────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗  │
│  ║  🛑 WebP Animation PAUSADO           ║  │
│  ║  Frame congelado na posição atual    ║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│     [WalletConnect Modal aparecendo]        │
│     - QR Code                               │
│     - Ou deep link mobile                   │
└─────────────────────────────────────────────┘
```

**Backend Event**: Nenhum (frontend apenas)

---

## 🎯 EVENTO 2: Wallet Conectada

**Duração**: 0-3s (depende do usuário conectar)  
**Trigger**: `isConnected = true`, `address` definido  
**Ação do código**: Re-render com novo estado

### O que acontece:

```typescript
// wagmi detecta conexão
const { address } = useAccount();  // agora tem endereço
const isConnected = !!address;      // true
```

### Visual:

```
┌─────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗  │
│  ║  🛑 WebP AINDA PAUSADO               ║  │
│  ║  Texto muda: "MINT ETH" ou "MINT USDC"║ │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  ┌──────────────────────┐                   │
│  │  [ETH] [USDC]        │  ← Payment toggle │
│  └──────────────────────┘                   │
└─────────────────────────────────────────────┘

Estado: CONNECTED
WebP: PAUSED (continua pausado)
```

**Backend Event**: Nenhum ainda

---

## 🎯 EVENTO 3: User Escolhe Moeda (ETH/USDC)

**Duração**: Instantâneo  
**Trigger**: Click no toggle ETH/USDC  
**Ação do código**: `setPaymentMode('eth' | 'usdc')`

### Visual:

```
Payment Mode = ETH:
  Button glow: Azul (#0069ff)
  Box-shadow: rgba(0, 105, 255, 0.2)

Payment Mode = USDC:
  Button glow: Verde (#27a17b)
  Box-shadow: rgba(39, 161, 123, 0.2)
```

**Backend Event**: Nenhum (só UI)

---

## 🎯 EVENTO 4: User Clica "MINT ETH" ou "MINT USDC"

**Duração**: Instantâneo (click)  
**Trigger**: `handleRelayerMintEth()` ou `handleRelayerMint()`  
**Ação do código**: `setIsRelaying(true)`

### O que acontece:

```typescript
// ✅ JÁ IMPLEMENTADO
const handleRelayerMintEth = async () => {
  setIsRelaying(true);  // 🎬 COMEÇA LOADING STATE
  
  // 1. Gera paymentId único
  const paymentId = `magic-eth-${Date.now()}`;
  
  // 2. Encode payAndMint() call
  const encodedData = encodeFunctionData({
    abi: ABI,
    functionName: 'payAndMint',
    args: [mferAddress, address, paymentId],
  });
  
  // 3. Envia transação com Paymaster
  const hash = await walletClient.sendTransaction({
    to: kingalleryAddress,
    data: encodedData,
    value: 300000000000000n, // 0.0003 ETH
  });
  
  // 4. Aguarda confirmação
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
}
```

### Visual (Loading State):

```
┌─────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗  │
│  ║  ⏳ PROCESSING...                    ║  │
│  ║  [Pode ter crawl "it's a ritual" →]  ║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  Status: isRelaying = true                  │
└─────────────────────────────────────────────┘
```

**Backend Events**:
1. ✅ `console.log('📝 Preparing ETH mint transaction...')`
2. ✅ `console.log('📤 Sending transaction to blockchain with Paymaster...')`

---

## 🎯 EVENTO 5: Transação Enviada (Hash Recebido)

**Duração**: 1-2s após click  
**Trigger**: `sendTransaction()` retorna hash  
**Ação do código**: `console.log('✅ Transaction sent:', hash)`

### O que acontece:

```typescript
const hash = await walletClient.sendTransaction(...);
console.log('✅ Transaction sent:', hash);
// hash = "0x1234567890abcdef..."
```

### Visual (ainda loading):

```
┌─────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗  │
│  ║  ⏳ PROCESSING...                    ║  │
│  ║  TX: 0x1234...cdef                   ║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  [Pode mostrar link BaseScan aqui]          │
└─────────────────────────────────────────────┘
```

**Backend Events**:
- ✅ Transaction hash disponível
- 🔗 BaseScan link: `https://basescan.org/tx/${hash}`
- ⛽ Paymaster sponsorship aplicado (usuário não paga gas)

---

## 🎯 EVENTO 6: Aguardando Confirmação Blockchain

**Duração**: 2-5s (Base chain é rápido)  
**Trigger**: `waitForTransactionReceipt()` em execução  
**Estado**: Loading continua

### O que acontece:

```typescript
// Blockchain processing...
const receipt = await publicClient.waitForTransactionReceipt({ 
  hash,
  confirmations: 1  // espera 1 bloco
});
```

### Visual (loading com feedback):

```
┌─────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗  │
│  ║  ⏳ Confirming on Base...            ║  │
│  ║  ⛓️ Block confirmation in progress    ║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  [Spinner ou animation]                     │
└─────────────────────────────────────────────┘
```

**Backend Events** (interessantes para comentar):
- ⛓️ "Blockchain miners validating..."
- 🔒 "Smart contract executing payAndMint()"
- 💰 "Splitting payment: 0.0002 ETH → artist, 0.0001 ETH → gallery"
- 🎨 "Calling MferMint.mintFor()"
- 🖼️ "NFT metadata generating..."

---

## 🎯 EVENTO 7: Mint Confirmado! ✅

**Duração**: Instantâneo  
**Trigger**: `receipt.status === 'success'`  
**Ação do código**: Success state, redirect para gallery

### O que acontece:

```typescript
if (receipt.status === 'success') {
  console.log('🎉 Mint successful! ETH payment processed with Paymaster gas sponsorship.');
  const tokenId = `${Date.now()}`;
  setLastTokenId(tokenId);
  
  // Redirect após 2s
  setTimeout(() => {
    router.push(`/gallery?tokenId=${tokenId}`);
  }, 2000);
}
```

### Visual (Success State - 2s antes de redirect):

```
┌─────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗  │
│  ║  ✅ MINT SUCCESS!                    ║  │
│  ║  🎉 NFT #123456                      ║  │
│  ║  "The ritual is complete"            ║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  [Celebration animation - 2s]               │
└─────────────────────────────────────────────┘
```

**Backend Events** (final):
- ✅ `receipt.status === 'success'`
- 🎟️ Token ID extraído (pode ser do log do contrato)
- 📍 Transaction confirmada em block #XXXXXX
- ⛽ Gas: 0 (Paymaster pagou)

---

## 🎯 EVENTO 8: Redirect para Gallery (Segunda Tela)

**Duração**: 2s após success  
**Trigger**: `router.push('/gallery?tokenId=123456')`  
**Página**: Nova tela com NFT card

### O que acontece:

```typescript
router.push(`/gallery?tokenId=${tokenId}`);
// Navegação Next.js para /gallery
```

### Visual (Segunda Tela):

```
┌─────────────────────────────────────────────┐
│  "The soul spins at a base -               │
│   where the smile comes home."              │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  🖼️ NFT CARD                         │  │
│  │  Kinker Mfer #123456                  │  │
│  │  [Image preview]                      │  │
│  │  ────────────────────────────────────  │  │
│  │  Owner: 0xabcd...1234                 │  │
│  │  Minted: Jan 11, 2026                 │  │
│  │  Chain: Base (8453)                   │  │
│  │  ────────────────────────────────────  │  │
│  │  [View on BaseScan] [Share]           │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [Mint Another] [Go to Profile]             │
└─────────────────────────────────────────────┘
```

**Backend**: Gallery page carrega dados do NFT via tokenId

---

## 📋 RESUMO: Timeline Completa

| # | Evento | Duração | WebP State | Backend Event |
|---|--------|---------|------------|---------------|
| 0 | Splash screen acaba | 4.5s | - | - |
| 1 | **Magic Button visível** | ∞ | **PLAYING LOOP** | - |
| 2 | User clica Connect | instant | **→ PAUSED** | - |
| 3 | WalletConnect modal | 0-3s | PAUSED | - |
| 4 | Wallet conectada ✅ | instant | PAUSED | Address available |
| 5 | User escolhe ETH/USDC | instant | PAUSED | UI only |
| 6 | User clica MINT | instant | PAUSED | `setIsRelaying(true)` |
| 7 | **TX preparada** | 0.5s | PAUSED | "Preparing..." |
| 8 | **TX enviada** | 1s | PAUSED | Hash received 🔗 |
| 9 | **Blockchain confirming** | 2-5s | PAUSED | Block validation ⛓️ |
| 10 | **Mint success** ✅ | 2s | PAUSED | Token ID, celebration 🎉 |
| 11 | **Redirect gallery** | instant | - | New page loads |

**Total**: ~10-15s do click Connect até Gallery

---

## 🎨 Animações/Textos para Implementar

### FASE: Wallet Conectada (após EVENTO 4)

**Momento**: Entre conexão e click do mint  
**Objetivo**: Convidar para o ritual, explicar o processo

#### Opção 1: Texto Rotativo (no lugar do WebP pausado)

```typescript
const inviteTexts = [
  "Great eyes!",
  "Turn them up a bit",
  "The eyes see the flatline",
  "at 9 o'clock",
  "The mouse bends it",
  "into a smile!",
  "This is not animation",
  "it's a ritual",
  "Click to Mint"
];

// Rodar cada frase por 600-800ms
```

#### Opção 2: Overlay Discreto

```tsx
{isConnected && !isRelaying && (
  <div className="ritual-invite">
    <motion.p 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      This is not animation; it's a ritual
    </motion.p>
  </div>
)}
```

### FASE: Durante Mint (EVENTO 7-9)

**Momento**: `isRelaying = true`  
**Objetivo**: Feedback visual, comentar o que está acontecendo

#### Crawl Text "it's a ritual"

```tsx
{isRelaying && (
  <motion.div 
    className="ritual-crawl"
    animate={{ x: ['100%', '-100%'] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
  >
    it's a ritual
  </motion.div>
)}
```

#### Backend Events Commentary (opcional)

```typescript
// Durante waitForTransactionReceipt
const backendComments = [
  "⛓️ Blockchain validators at work...",
  "💰 Splitting payment to artist + gallery...",
  "🎨 Calling MferMint contract...",
  "🖼️ Generating NFT metadata...",
  "✅ Almost there..."
];

// Mostrar um a cada 1s
```

### FASE: Success (EVENTO 10)

**Momento**: `receipt.status === 'success'`  
**Objetivo**: Celebração!

```tsx
{lastTokenId && (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, type: 'spring' }}
  >
    <h2>🎉 Mint Complete!</h2>
    <p>NFT #{lastTokenId}</p>
    <p className="ritual-quote">
      "The ritual is complete"
    </p>
  </motion.div>
)}
```

---

## 📄 Segunda Tela (Gallery Page)

**Documentação existente**: Procurar em docs/ sobre NFTSuccessCard  
**O que já existe**:

```typescript
// docs/FRASES_ROTEIRO_COMPLETO.md menciona:
"The soul spins at a base - where the smile comes home."
```

**Estrutura esperada**:

```tsx
// app/gallery/page.tsx (criar se não existe)
export default function GalleryPage({ searchParams }) {
  const tokenId = searchParams.tokenId;
  
  return (
    <div className="gallery-page">
      <motion.p className="ritual-complete">
        The soul spins at a base -<br />
        where the smile comes home.
      </motion.p>
      
      <NFTCard tokenId={tokenId} />
      
      <div className="actions">
        <button onClick={() => router.push('/')}>
          Mint Another
        </button>
        <button onClick={() => window.open(`https://basescan.org/nft/${kingalleryAddress}/${tokenId}`)}>
          View on BaseScan
        </button>
      </div>
    </div>
  );
}
```

---

## ✅ O Que Fazer Agora

1. **WebP Pause**: ✅ Implementado
2. **Timeline**: ✅ Documentada
3. **Próximos passos**:
   - [ ] Implementar textos rotativos após conexão (FASE wallet conectada)
   - [ ] Implementar crawl "it's a ritual" durante mint
   - [ ] Adicionar backend events commentary (opcional)
   - [ ] Criar página /gallery com NFTCard
   - [ ] Testar mint flow completo no mobile

**Prioridade**: Testar mint primeiro, adicionar animações depois de confirmar que funciona.
