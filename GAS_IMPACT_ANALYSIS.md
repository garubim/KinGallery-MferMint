# 🔥 Gas Impact Analysis - Funções para CDP Paymaster Dashboard

**Data**: 18 Janeiro 2026  
**Objetivo**: Identificar TODAS as funções que consomem gas no fluxo de mint  
**Para**: Configuração correta do CDP Paymaster Dashboard

---

## 📊 Fluxo Completo de Gas (ETH Mint)

```
USUÁRIO CLICA "MINT" COM ETH
    ↓
KinGallery.payAndMint(address, address, string)  ← FUNÇÃO 1 [GAS: ~150-200k]
    ├─ Validações (require statements)            ← Gas: ~5k
    ├─ owner() call em MferBk0Base                ← Gas: ~5k
    ├─ .call{} para artist (PAYEE1)              ← Gas: ~9k (agora com .call{})
    ├─ .call{} para gallery (PAYEE2)             ← Gas: ~9k (agora com .call{})
    └─ INTERNAL CALL → MferBk0Base.mintForWithEthFromGallery()  ← FUNÇÃO 2 [GAS: ~100-150k]
            ├─ Validações                         ← Gas: ~5k
            ├─ _safeMint(to, tokenId)            ← Gas: ~80-100k (MAIN CONSUMER)
            │   ├─ _tokenIdCounter++
            │   ├─ _checkOnERC721Received() (se to é contrato)
            │   ├─ Storage update (balanceOf, tokenId→owner)
            │   └─ Emit Transfer event
            └─ Transfer de ETH restante            ← Gas: ~9k

TOTAL APROX: 250-350k gas
```

---

## ✅ FUNÇÕES COM IMPACTO DIRETO DE GAS

### **1️⃣ KinGallery.payAndMint()**

**Assinatura:**
```solidity
function payAndMint(
    address artistContract,
    address to,
    string calldata paymentId
) external payable nonReentrant whenNotPaused
```

**Impacto de Gas:**
```
Base cost (CALL):           21,000 gas
Validations (requires):      ~5,000 gas
Storage write (processedPayment[paymentId] = true):  ~20,000 gas
External call (owner()):     ~5,000 gas
Transfer x2 (.call{}):      ~18,000 gas (2x 9k)
Internal call mintFor...():  ~100-150,000 gas
────────────────────────────────────────────
TOTAL:                      ~169,000-189,000 gas
```

**Componentes que afetam gas:**
- ✅ `processedPayment` mapping update (state change)
- ✅ `owner()` call em MferBk0Base (external call)
- ✅ Pagamentos para artist + gallery (transfers)
- ✅ Internal call para minting (delegado para MferBk0Base)

---

### **2️⃣ MferBk0Base.mintForWithEthFromGallery()**

**Assinatura:**
```solidity
function mintForWithEthFromGallery(
    address to,
    string calldata paymentId
) external payable onlyGallery
```

**Impacto de Gas:**
```
Base cost (CALL):           21,000 gas
Validations (requires):      ~8,000 gas
Storage write (mintedWithPaymentId[paymentId] = true):  ~20,000 gas
_safeMint(to, tokenId):     ~80-100,000 gas ⭐ MAIN CONSUMER
  ├─ _tokenIdCounter++ (storage):  ~5,000 gas
  ├─ _owners[tokenId] = to (storage):  ~20,000 gas
  ├─ _balances[to]++ (storage):  ~5,000 gas
  ├─ ERC721Received check (if to is contract):  ~30,000 gas (conditional)
  └─ Emit Transfer event:  ~1,000 gas
Transfer de ETH:            ~9,000 gas
────────────────────────────────────────────
TOTAL:                      ~138,000-158,000 gas
```

**Componentes que afetam gas:**
- ✅ `mintedWithPaymentId` mapping update (state change)
- ✅ `_tokenIdCounter++` (state change)
- ✅ `_safeMint()` internals (ownership tracking, balance updates)
- ✅ ETH transfer para owner() via `.call{}`
- ⚠️ **MAIOR CONSUMIDOR**: `_safeMint()` é ~80-100k gas

---

### **3️⃣ KinGallery.processPayment() - USDC Flow**

**Assinatura:**
```solidity
function processPayment(
    address artistContract,
    address to,
    uint256 amount,
    string calldata paymentId
) external nonReentrant whenNotPaused
```

**Impacto de Gas:**
```
Base cost (CALL):           21,000 gas
Validations (requires):      ~5,000 gas
Storage write (processedPayment[paymentId] = true):  ~20,000 gas
Safe transfer USDC (ERC20):  ~65,000 gas
Internal call mintFor...:    ~100-150,000 gas
────────────────────────────────────────────
TOTAL:                      ~211,000-241,000 gas
```

**Nota**: `processPayment` não faz transfers para artist/gallery (apenas USDC para MferBk0Base), então é um pouquinho mais eficiente que `payAndMint` sem o split ETH.

---

## 📋 CONFIGURAÇÃO DO CDP PAYMASTER DASHBOARD

### **Para KinGallery (0xNEWADDRESS após redeploy):**

```
Nome: KinGallery
Endereço: 0xNEWADDRESS

Funções a PATROCINAR (ambas consomem gas):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. payAndMint(address,address,string)
   - Custo: ~169-189k gas
   - Fluxo: ETH payment → artist split + gallery split → NFT mint
   - Requer: msg.value == 0.0003 ETH (ou preço configurado)
   - Descrição: "Mint com ETH - paga artista + galeria + minta NFT"

2. processPayment(address,address,uint256,string)
   - Custo: ~211-241k gas
   - Fluxo: USDC transfer → NFT mint
   - Requer: USDC approval primeiro
   - Descrição: "Mint com USDC - transfere + minta NFT"
```

### **Para MferBk0Base (0x01ECF65958dB5d1859d815ffC96b7b8C5e16E241):**

```
Nome: MferBk0Base
Endereço: 0x01ECF65958dB5d1859d815ffC96b7b8C5e16E241

⚠️ NÃO CONFIGURAR NO PAYMASTER:
Essa função NÃO é chamada diretamente pelos usuários.
Ela é chamada INTERNAMENTE por KinGallery.

A cobertura de gas para MferBk0Base está INCLUÍDA 
quando você patrocina KinGallery.payAndMint() e 
KinGallery.processPayment().
```

---

## 🎯 IMPACTO DE NOSSAS MUDANÇAS NO GAS

### **Mudança: `.transfer()` → `.call{value:...}("")`**

```
ANTES (com .transfer()):
├─ payable(artistPayee).transfer(0.0002)  → 2,300 gas (fixed, + 21k overhead)
└─ payable(payee2).transfer(0.0001)       → 2,300 gas (fixed, + 21k overhead)

DEPOIS (com .call{}):
├─ payable(artistPayee).call{value: 0.0002}("")  → ~9,000 gas (mais flexível)
└─ payable(payee2).call{value: 0.0001}("")       → ~9,000 gas (mais flexível)

Diferença: ~14,000 gas a MAIS
Razão: .call{} passa mais gas ao recipient (não limitado a 2300)
```

**Impacto no Custo Total:**
```
Antes: ~169k gas
Depois: ~183k gas (+8%)

Custo em USD (em Base, com gás típico ~0.1 gwei):
Antes: ~169k * 0.1 = 16,900 gwei ≈ $0.0169
Depois: ~183k * 0.1 = 18,300 gwei ≈ $0.0183

DIFERENÇA: +$0.0014 por mint (+8%)
```

✅ **MAS**: Ganho de compatibilidade com Smart Wallets > custo adicional de 8%

---

## 📊 RESUMO PARA PAYMASTER DASHBOARD

### ✅ Funções a COLOCAR:

**KinGallery (novo endereço)**:
```
payAndMint(address,address,string)
processPayment(address,address,uint256,string)
```

### ❌ Funções a NÃO COLOCAR:

**MferBk0Base**:
```
mintForWithEthFromGallery() ← Não é chamada pelos usuários
(já está coberta quando você patrocina KinGallery)
```

---

## 🚀 VERIFICAÇÃO DE GAS

Depois do redeploy, você pode verificar gas estimado em Base:

```bash
# Via BlockScout
https://base.blockscout.com/tx/{hash}
→ Gas Used / Gas Limit

Esperado para ETH mint: 160-200k
Esperado para USDC mint: 210-240k
```

---

**Dados corretos para comunicar ao CDP Paymaster:**
- ✅ Funções públicas: 2 (payAndMint, processPayment)
- ✅ Gas estimado: 170k-240k por transação
- ✅ Funções internas: não listadas (cobertas automaticamente)

