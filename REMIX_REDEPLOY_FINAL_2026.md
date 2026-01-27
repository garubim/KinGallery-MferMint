# 🚀 REDEPLOY FINAL - KinGallery + MferBk0Base (Fresh Start)

**Status**: ✅ **PRONTO PARA REMIX**  
**Data**: 27 de janeiro de 2026  
**Tokens**: Fresh start token #1 (nada herdado!)

---

## 📋 CHECKLIST PRÉ-DEPLOY

- ✅ **KinGallery**: Nome público "KinGallery" registrado no contrato
- ✅ **MferBk0Base**: maxTotalSupply = 1000 (aparecerá na BaseScan)
- ✅ **Ambos**: Fresh start (token counter começa em 1, nenhum herdado)
- ✅ **Metadata**: Pronto para `.json` suffix (compatível com onchainkit)
- ✅ **Farcaster**: Compatible com ERC721 standard + royalties (ERC2981)

---

## 🎯 CONTRATO #1: KinGallery (Galeria)

### Arquivo para Copiar
```
/Users/gabrielrubim/dev/GitHub/KinGallery+MferMint/contracts/KinGallery_REDEPLOY.sol
```

### Constructor Arguments (EXATOS)

```solidity
constructor(
  address _usdc,          // Base USDC
  address _multisig,      // Gnosis Safe
  address _payee2         // Sua Smart Wallet
)
```

### Valores para Passar no Remix

| Parâmetro | Valor | Descrição |
|-----------|-------|-----------|
| `_usdc` | `0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913` | Base USDC oficial |
| `_multisig` | `0x4d639D1Bd428899599F0Da564926DA1a1A3bd3a8` | Gnosis Safe multisig |
| `_payee2` | `0x26dCd83d4e449059ABf0334e4435d48e74f28EB0` | Sua Smart Wallet (Gallery) |

### Passo a Passo Remix

1. Abra https://remix.ethereum.org
2. Crie novo arquivo: `KinGallery_REDEPLOY.sol`
3. Cole o código de `/contracts/KinGallery_REDEPLOY.sol`
4. Compile com **Solidity 0.8.19**
5. Vá para "Deploy & Run Transactions"
6. Selecione "Injected Provider (MetaMask)" + **Base network**
7. Em "Contract" selecione `KinGallery`
8. Preencha Constructor com valores acima
9. Clique "Transact"
10. ✅ **Anote o endereço do novo contrato**

### Features Confirmadas

✅ Nome público: "KinGallery" (linha 23)  
✅ payee2 recebe ADMIN_ROLE automaticamente  
✅ Mint price: 0.0003 ETH (configurável)  
✅ Fresh start (nada herdado)

---

## 🎨 CONTRATO #2: MferBk0Base (Artista)

### Arquivo para Copiar
```
/Users/gabrielrubim/dev/GitHub/KinGallery+MferMint/contracts/MferBk0Base_REDEPLOY.sol
```

### Constructor Arguments (EXATOS)

```solidity
constructor(
  string memory name_,         // Nome do contrato
  string memory symbol_,       // Símbolo (ticker)
  string memory baseURI_,      // Metadata base URL
  address initialOwner_        // Seu EOA (artist + owner)
)
```

### Valores para Passar no Remix

| Parâmetro | Valor | Descrição |
|-----------|-------|-----------|
| `name_` | `Mfer-0-Base` | Nome da coleção |
| `symbol_` | `MFR0BASE` | Ticker/Symbol |
| `baseURI_` | `https://api.example.com/metadata/` | ⚠️ Ver nota abaixo |
| `initialOwner_` | `0xbcd980d37293CBee62Bf5f93a26a0B744C18964D` | Seu EOA (artist) |

### ⚠️ Nota Importante: baseURI

A baseURI **DEVE TERMINAR COM `/`**. Opções:

**Opção A: Usar o endpoint dinâmico do app** (Recomendado!)
```
https://kingallery-app-url.com/api/metadata/
```
Isso fará que o contrato automaticamente gere URLs como:
```
https://kingallery-app-url.com/api/metadata/1.json
https://kingallery-app-url.com/api/metadata/2.json
```

**Opção B: Usar IPFS base**
```
ipfs://bafyXXXXXXXXX/
```

**Opção C: Usar placeholder (mude depois)**
```
https://metadata.placeholder.io/
```

Você pode mudar depois com `setBaseURI()`.

### Passo a Passo Remix

1. Abra https://remix.ethereum.org
2. Crie novo arquivo: `MferBk0Base_REDEPLOY.sol`
3. Cole o código de `/contracts/MferBk0Base_REDEPLOY.sol`
4. Compile com **Solidity 0.8.19**
5. Vá para "Deploy & Run Transactions"
6. Selecione "Injected Provider (MetaMask)" + **Base network**
7. Em "Contract" selecione `MferBk0Base`
8. Preencha Constructor com valores acima
9. Clique "Transact"
10. ✅ **Anote o endereço do novo contrato**

### Features Confirmadas

✅ maxTotalSupply: **1000** (linha 31 - aparecerá na BaseScan!)  
✅ Metadata URI: string (compatível com `.json` suffix)  
✅ ERC2981 Royalties: 5% default  
✅ Fresh start (token counter = 1)  
✅ Farcaster compatible (ERC721 standard)

---

## 🔗 PÓS-DEPLOY: Configurar Relação entre Contratos

Depois que deployr ambos, você precisa **configurar a relação** no MferBk0Base:

### Via Remix (como owner do MferBk0Base)

1. Em "Deploy & Run Transactions"
2. Carregue o MferBk0Base deployado: "At Address" → cole endereço novo
3. Procure por `setGallery()`
4. Passe: `0x[endereço_novo_do_KinGallery]`
5. Clique "Transact"

**Comando exato:**
```solidity
setGallery("0x[seu_novo_KinGallery]")
```

---

## ✅ VALIDAÇÕES FINAIS (via BaseScan)

Depois do deploy, verifique em https://basescan.org:

### KinGallery
- [ ] Nome público: "KinGallery" aparece no header
- [ ] Estado: `payee2` = 0x26dCd...EB0
- [ ] Funções: `payAndMint`, `setGalleryPayee` disponíveis
- [ ] Verificação: Compare com padrão de contratos aprovados

### MferBk0Base
- [ ] Max Total Supply: **1000** (lista como "Max Supply")
- [ ] Total Minted: **0** (fresh start!)
- [ ] Token ID Range: 1 - 1000
- [ ] Metadata URI: Seu baseURI configurado
- [ ] Royalty: 5% aparece em "Royalty Info"

---

## 🔧 PRÓXIMO PASSO NO FRONTEND

Depois que deployr, me passa os dois endereços:

```
KinGallery novo:    0x...
MferBk0Base novo:   0x...
```

Aí eu atualizo:
1. `.env.local` com novos endereços
2. Metadata API pra adicionar `.json` suffix
3. Testamos tudo de novo!

---

## 📊 Resumo: O que NÃO vai ser herdado

| Item | Antigo | NOVO (Fresh) |
|------|--------|------|
| **Tokens Mintados** | 22 | 0 ✅ |
| **Token Counter** | 23 | 1 ✅ |
| **Contratos Distintos** | 4+ | 2 (único!) ✅ |
| **Metadata** | ipfs://xxx/mfer-22 | https://...metadata/22.json ✅ |
| **MaxTotalSupply** | 0 ou undefined | **1000** ✅ |
| **Nome Público** | (vazio) | **KinGallery** ✅ |

---

## 🚀 Você Está 100% Pronto!

Todos os arquivos têm:
- ✅ Fresh start (nada herdado)
- ✅ Metadata correta (.json ready)
- ✅ maxTotalSupply = 1000
- ✅ Nome público registrado
- ✅ Farcaster compatible
- ✅ BaseScan ready

**Bora pro Remix!** 🎉

---

**Criado em**: 27/01/2026 06:50 UTC  
**Status**: ✅ Ready for Deployment
