# ✅ BASESCAN VERIFICATION PREP (Fresh Contracts - 27 Jan 2026)

**Status**: Ready to Copy-Paste na BaseScan  
**Data**: 27 de janeiro de 2026

---

## 🎯 Quick Reference: Os 2 Contratos

### 1️⃣ KinGallery
**Compiler**: Solidity 0.8.19  
**Method**: Standard-Json-Input  
**License**: MIT  
**Constructor Args**: 3 parâmetros (ver abaixo)

### 2️⃣ MferBk0Base
**Compiler**: Solidity 0.8.19  
**Method**: Standard-Json-Input  
**License**: MIT  
**Constructor Args**: 4 parâmetros (ver abaixo)

---

## 📋 ANTES DE VERIFICAR NA BASESCAN

✅ Anote os **dois endereços de deploy**:
```
KinGallery novo:   0x________________  ← Você vai preencher
MferBk0Base novo:  0x________________  ← Você vai preencher
```

---

## 🔧 BASESCAN VERIFICATION PARA KinGallery

### Passo 1: Ir para BaseScan

Acesse:
```
https://basescan.org/address/[SEU_KINGALLERY_ADDRESS]
```

### Passo 2: Clicar "Verify and Publish"

Escolha as opções:

| Campo | Valor |
|-------|-------|
| **Compiler Type** | Solidity (Single file) |
| **Compiler Version** | v0.8.19+commit.7dd6d404 |
| **License Type** | MIT |

### Passo 3: Colar o Código

Vá para: `/contracts/KinGallery_CLEAN_REDEPLOY.sol`

Copie **TODO o código** e cole no campo de código da BaseScan.

### Passo 4: Constructor Arguments (ABI-encoded)

No Remix, após deployr o KinGallery, copie os constructor arguments encoded.

Ou, use este formato e encode no site: https://tool.soliditydeveloper.com/encodedata

**Formato dos 3 argumentos:**
```solidity
address _usdc     = 0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913
address _multisig = 0x4d639D1Bd428899599F0Da564926DA1a1A3bd3a8
address _payee2   = 0x26dCd83d4e449059ABf0334e4435d48e74f28EB0
```

**Se a BaseScan pedir "Constructor Arguments (ABI-encoded)":**
- Codifique como: `address,address,address` com os 3 valores acima
- Ou copie direto do Remix após deploy

### Passo 5: Confirmar e Pronto!

Esperar verificação (geralmente 2-5 minutos). ✅

---

## 🔧 BASESCAN VERIFICATION PARA MferBk0Base

### Passo 1: Ir para BaseScan

Acesse:
```
https://basescan.org/address/[SEU_MFERBK0BASE_ADDRESS]
```

### Passo 2: Clicar "Verify and Publish"

Mesmas opções do KinGallery:

| Campo | Valor |
|-------|-------|
| **Compiler Type** | Solidity (Single file) |
| **Compiler Version** | v0.8.19+commit.7dd6d404 |
| **License Type** | MIT |

### Passo 3: Colar o Código

Vá para: `/contracts/MferBk0Base_CLEAN_REDEPLOY.sol`

Copie **TODO o código** e cole.

### Passo 4: Constructor Arguments (ABI-encoded)

**Formato dos 4 argumentos:**
```solidity
string   name_         = "Mfer-0-Base"
string   symbol_       = "MFR0BASE"
string   baseURI_      = "https://[seu-app]/api/metadata/"
address  initialOwner_ = 0xbcd980d37293CBee62Bf5f93a26a0B744C18964D
```

**No Remix para copiar encoded:**
1. Deploy o contrato
2. Na saída, copie o campo "Encoded constructor arguments"
3. Cole na BaseScan

**Ou, use encoder do site:** https://tool.soliditydeveloper.com/encodedata

### Passo 5: Confirmar e Pronto!

Esperar verificação. ✅

---

## ✅ O Que Você Vai Ver na BaseScan (Depois Verificado)

### KinGallery
- ✅ Nome público: **"KinGallery"** (aparece no header)
- ✅ Funções: `payAndMint`, `setGalleryPayee`, `setMintPrice` (read/write)
- ✅ State: `payee2`, `mintPrice` (read)
- ✅ Events: `Processed`, `GalleryPayeeUpdated`, etc

### MferBk0Base
- ✅ Max Supply: **1000** (aparece em "Token Info")
- ✅ Funções: `mintForWithEthFromGallery`, `creatorMint`, `setGallery` (read/write)
- ✅ Token Counter: **1** (fresh start!)
- ✅ Royalties: **5%** (ERC2981 implementado)

---

## 🚨 Se Der Erro "Bytecode Mismatch"

**Causas mais comuns:**

1. **Compiler version errada**
   - Verifique: **v0.8.19+commit.7dd6d404** (exatamente isso)
   - Não use v0.8.20 ou v0.8.18!

2. **Otimizador ligado quando deveria desligar (ou vice-versa)**
   - Esses contratos usam **otimizador DESLIGADO**
   - Em Remix: Compiler → Optimization: OFF

3. **Constructor arguments errados ou faltando**
   - Copie direto do Remix após deploy
   - Não tente montar manualmente

4. **Cópias extras no código**
   - Certifique-se que só tem 1 contrato (não tem `contract KinGallery2 {`)
   - Importe só as bibliotecas OpenZeppelin necessárias

---

## 📊 Resumo: Standard-Json-Input vs Single File

| Aspecto | Single File | Standard-Json-Input |
|---------|------------|-------------------|
| **O que submeter** | Código completo em 1 arquivo | JSON com metadata do compilador |
| **Complexidade** | Mais simples ✅ | Um pouco mais complexo |
| **Recomendado** | ✅ Para contratos simples | Para contratos com imports |
| **Você vai usar** | **ÍS DISSO →** | **NÃO PRECISA** |

**Para seus contratos**: Use **Single File** (mais simples) e copie o código diretamente.

---

## 🎯 Checklist Final Antes de Verificar

- [ ] Copiei os endereços dos 2 contratos
- [ ] Compiler version é **v0.8.19+commit.7dd6d404**
- [ ] License é **MIT**
- [ ] Código está copiado inteiro (sem truncar)
- [ ] Constructor arguments estão prontos
- [ ] Confirmei que otimizador está OFF
- [ ] Network está selecionado como **Base (8453)**

---

## 📞 Pós-Verificação

Depois que ambos forem verificados ✅:

1. **Testar no frontend**: Atualizar endereços em `.env.local`
2. **Testar mint**: Clicar em Magic Button
3. **Conferir na BaseScan**: Ver transferências em "Internal Txns"
4. **Pronto!**

---

## 🔗 Links Rápidos

| Recurso | URL |
|---------|-----|
| **BaseScan Base** | https://basescan.org |
| **Remix** | https://remix.ethereum.org |
| **Encoder ABI** | https://tool.soliditydeveloper.com/encodedata |
| **Seu KinGallery** | https://basescan.org/address/[SEU_ENDERECO] |
| **Seu MferBk0Base** | https://basescan.org/address/[SEU_ENDERECO] |

---

**Criado em**: 27/01/2026  
**Status**: ✅ Ready to Use - Sem Surpresas!
