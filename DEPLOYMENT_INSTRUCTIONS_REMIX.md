# 🚀 DEPLOYMENT CHECKLIST - KinGallery + MferBk0Base (Fresh Start)

**Data**: 27 de Janeiro de 2026  
**Chain**: Base (8453)  
**Status**: Pronto para Remix Deploy

---

## 📋 PRÉ-DEPLOYMENT

### Verificar Endereços Antes de Começar:

```
Artist/Deployer:     0xbcd980d37293CBee62Bf5f93a26a0B744C18964D ✅
Smart Wallet/Gallery: 0x26dcd83d4e449059abf0334e4435d48e74f28eb0 ✅
Gnosis Safe Multisig: 0x4d639D1Bd428899599F0Da564926DA1a1A3bd3a8 ✅
Base USDC:           0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913 ✅
```

---

## 🎯 PASSO 1: Deploy KinGallery

### 1.1 Abrir Remix
- URL: https://remix.ethereum.org
- Create > New File: `KinGallery_REDEPLOY.sol`
- Copiar conteúdo de: `/contracts/KinGallery_REDEPLOY.sol`

### 1.2 Compilar
- Solidity Compiler: `0.8.19+commit.7dd6d404`
- Compile Button

### 1.3 Deploy
- Deploy & Run Transactions > Environment: **Injected Provider (MetaMask)**
- Conectar com sua EOA (0xbcd980...)
- **Certifique-se que está em Base (8453)**

### 1.4 Constructor Parameters (nessa ordem)
```
_usdc:    0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913
_multisig: 0x4d639D1Bd428899599F0Da564926DA1a1A3bd3a8
_payee2:  0x26dcd83d4e449059abf0334e4435d48e74f28eb0
```

### 1.5 Transact
- Clique "Transact"
- Aprovar no MetaMask
- **Anotar endereço**: KinGallery v2 = 0x...

---

## 🎯 PASSO 2: Deploy MferBk0Base

### 2.1 Novo Arquivo no Remix
- Create > New File: `MferBk0Base_REDEPLOY.sol`
- Copiar conteúdo de: `/contracts/MferBk0Base_REDEPLOY.sol`

### 2.2 Compilar
- Solidity Compiler: `0.8.19+commit.7dd6d404`
- Compile Button

### 2.3 Deploy
- Deploy & Run Transactions > Environment: **Injected Provider (MetaMask)**
- Conectar com sua EOA (0xbcd980...)
- **Certifique-se que está em Base (8453)**

### 2.4 Constructor Parameters (nessa ordem)
```
name_:           "Mfer-0-Base"
symbol_:         "MFR0BASE"
baseURI_:        "ipfs://metadata/"
initialOwner_:   0xbcd980d37293CBee62Bf5f93a26a0B744C18964D
```

### 2.5 Transact
- Clique "Transact"
- Aprovar no MetaMask
- **Anotar endereço**: MferBk0Base v2 = 0x...

---

## ⚙️ PASSO 3: Configurar Relacionamento Entre Contratos

### 3.1 Em MferBk0Base: Setar Gallery (KinGallery)
- Em Remix, expanda "MferBk0Base" (Deployed Contracts)
- Clique em `setGallery` (Write Contract)
- Parameter: `0x...` (endereço do KinGallery v2 que você anotou)
- Transact
- Aprovar no MetaMask

### 3.2 Em MferBk0Base: Transferir Ownership para Smart Wallet
- Clique em `transferOwnership` (Write Contract)
- Parameter: `0x26dcd83d4e449059abf0334e4435d48e74f28eb0`
- Transact
- Aprovar no MetaMask

### 3.3 Verificar Configuração
- Clique em `gallery()` (Read)
  - Resultado: 0x... (KinGallery) ✅
- Clique em `owner()` (Read)
  - Resultado: 0x26dcd... (Smart Wallet) ✅

---

## 📋 PASSO 4: Verificação na BaseScan

### 4.1 Endereço KinGallery v2 na BaseScan
- https://basescan.org/address/SEU_ENDERECO_KINGALLERY
- Aba "Contract"
- Clique "Verify and Publish"

#### Método de Verificação:
- **Compiler Type**: Solidity (Standard-Json-Input)
- **Compiler Version**: v0.8.19+commit.7dd6d404
- **Open Source License**: MIT

#### Arquivo JSON:
- Use: `KinGallery_StandardJSON_CORRECTED.json`

#### Constructor Arguments:
- Será solicitado se necessário
- Usar: `generate_constructor_args.py` no diretório contracts

### 4.2 Endereço MferBk0Base v2 na BaseScan
- https://basescan.org/address/SEU_ENDERECO_MFERBK0BASE
- Repetir processo de verificação
- Use: `MferBk0Base_StandardJSON_Input.json` (ou gerar novo)

---

## ✅ PASSO 5: Update Frontend

### 5.1 Atualizar `.env.local`

```bash
# Update these variables:
NEXT_PUBLIC_KINGALLERY_CONTRACT=0xNEW_KINGALLERY_ADDRESS
NEXT_PUBLIC_MFERMINT_CONTRACT=0xNEW_MFERBK0BASE_ADDRESS

# Restart server
npm run dev
```

---

## 🧪 PASSO 6: Testes Básicos

### 6.1 Test Mint (EOA)
- Abrir http://localhost:3000
- Conectar com sua EOA (MetaMask)
- Clicar Magic Button para mintar
- Verificar sucesso em BaseScan

### 6.2 Test Mint (Smart Wallet)
- Desconectar e reconectar com Smart Wallet
- Clicar Magic Button
- Verificar sucesso

### 6.3 Verificar Galeria
- Após mint, ir para página 2
- Confetti deve aparecer
- Gallery de mints deve carregar

---

## 📊 Verificação Rápida Pós-Deploy

| Item | Status | Check |
|------|--------|-------|
| KinGallery deployado | ✅ | Endereço anotado |
| MferBk0Base deployado | ✅ | Endereço anotado |
| gallery configurado | ✅ | `gallery() = KinGallery` |
| owner transferido | ✅ | `owner() = Smart Wallet` |
| payee2 = Smart Wallet | ✅ | KinGallery.payee2() |
| maxTotalSupply = 1000 | ✅ | MferBk0Base.maxTotalSupply() |
| Frontend atualizado | ✅ | .env.local novo |
| EOA mint funciona | ✅ | Teste feito |
| Smart Wallet mint | ✅ | Teste feito |

---

## 🎯 Endereços Finais (preencher após deploy)

```
KinGallery v2:     0x_____________________________
MferBk0Base v2:    0x_____________________________
Artist (EOA):      0xbcd980d37293CBee62Bf5f93a26a0B744C18964D
Gallery (Smart):   0x26dcd83d4e449059abf0334e4435d48e74f28eb0
Multisig:          0x4d639D1Bd428899599F0Da564926DA1a1A3bd3a8
```

---

## ⚠️ Troubleshooting

### Erro: "Only gallery" na MferBk0Base
- Verificar que `gallery` está configurado corretamente via `setGallery()`

### Erro: "Bytecode does not match" na verificação BaseScan
- Compiler deve ser **exatamente** v0.8.19+commit.7dd6d404
- Optimizer deve estar **desabilitado**

### Mint falha com "Gallery payee not set"
- Confirmar que `payee2` está configurado em KinGallery
- Usar `setGalleryPayee()` se necessário

---

## 📞 Contato

Se tiver problemas:
1. Copiar hash da transação falhada
2. Verificar em https://basescan.org/tx/{hash}
3. Procurar pela mensagem de erro específica
4. Voltar com detalhes

---

**Última atualização**: 27 de Janeiro de 2026  
**Status**: Pronto para Remix Deploy ✅

