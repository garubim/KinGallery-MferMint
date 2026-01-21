# 🚨 NOVO DEPLOY CRÍTICO - KinGallery v2 + MferBk0Base v2

**Status**: ⏳ PENDENTE  
**Data Criação**: 21 de Janeiro de 2026  
**Razão**: Limpar histórico de 3 contratos de teste. Novo deploy com nomes públicos registrados.

---

## 📋 Contexto

### ❌ Problemas com deploy atual (Jan 17, 2026):
- ✗ 3 contratos diferentes misturados (confuso)
- ✗ KinGallery sem nome público na BaseScan
- ✗ Histórico sujo de testes
- ✗ Imagem profissional comprometida

### ✅ Novo deploy (v2):
- ✓ **1 KinGallery** com nome "KinGallery" registrado
- ✓ **1 MferBk0Base** com nome "MferBk0Base" registrado
- ✓ Histórico limpo desde o início
- ✓ Profissional, escalável

---

## 🎯 Checklist de Deploy

### FASE 1: Preparação (AGORA)
- [ ] Revisar KinGallery.sol (Solidity 0.8.19)
- [ ] Revisar MferBk0Base.sol (Solidity 0.8.19)
- [ ] Ter prontos: USDC address, Gnosis Safe address, novo KinGallery address (após deploy 1)
- [ ] Abrir Remix: remix.ethereum.org
- [ ] Conectar MetaMask em Base Mainnet (Chain ID: 8453)

### FASE 2: Deploy KinGallery v2
1. **Remix:**
   - [ ] Compilar KinGallery.sol com 0.8.19
   - [ ] Deploy em Base (via Injected Provider/MetaMask)
   - [ ] Copiar novo endereço: `0x[NEW_KINGALLERY]`

2. **BaseScan - Verificação:**
   - [ ] Ir para: https://basescan.org/address/0x[NEW_KINGALLERY]
   - [ ] Clicar "Write as Proxy" ou "Verify & Publish"
   - [ ] Upload flattened code + constructor args
   - [ ] **IMPORTANTE**: Registrar nome "KinGallery"

### FASE 3: Deploy MferBk0Base v2
1. **Remix:**
   - [ ] Compilar MferBk0Base.sol com 0.8.19
   - [ ] Constructor args:
     ```
     _name: "MferBk0Base"
     _symbol: "MFERBK0"
     _usdc: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
     _gnosis: [seu Gnosis Safe]
     _gallery: 0x[NEW_KINGALLERY]  ← do FASE 2
     ```
   - [ ] Deploy em Base
   - [ ] Copiar novo endereço: `0x[NEW_MFERBK0]`

2. **BaseScan - Verificação:**
   - [ ] Registrar nome "MferBk0Base"

### FASE 4: Update Frontend
- [ ] Atualizar `.env.local`:
  ```
  NEXT_PUBLIC_KINGALLERY_CONTRACT=0x[NEW_KINGALLERY]
  NEXT_PUBLIC_MFERMINT_CONTRACT=0x[NEW_MFERBK0]
  ```
- [ ] Testar mint com novo contrato
- [ ] Verificar OpenSea metadata com Netlify Functions

### FASE 5: Documentação
- [ ] Criar `BETA_DEPLOYMENTS.md` anotando:
  - Edições 1-6 em contratos antigos (beta testing)
  - Novos contratos v2 como "official launch"
  - Token tracker não inclui edições beta

---

## 📝 Beta Deployments (Histórico)

```
BETA TESTING (Jan 17 - Jan 21, 2026):
├─ KinGallery v0: 0x8ABb13088C1707E9d5BE43daC0e78E8D9D35e44F (sem nome)
├─ MferBk0Base v0: 0x01ECF65958dB5d1859d815ffC96b7b8C5e16E241
├─ Edições mintadas: 1-6 (nestes contratos)
└─ Status: Arquivados, mantidos pra transparência

OFFICIAL LAUNCH (Jan 21+, 2026):
├─ KinGallery v2: 0x[NEW] (nome registrado)
├─ MferBk0Base v2: 0x[NEW] (nome registrado)
├─ Token tracker: Só conta edições v2+
└─ Status: Produção
```

---

## 🔗 Links Úteis

- **Remix**: https://remix.ethereum.org
- **BaseScan Write Contract**: https://basescan.org/address/0x[contract]#writeContract
- **Base USDC**: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
- **Chain ID**: 8453

---

## ⚠️ Notas Importantes

1. **Gas cost**: ~$20-30 total (Base é barato)
2. **Time**: ~30 min (compilar + deploy + verificar)
3. **Reversible**: Se algo der errado, você pode fazer outro deploy
4. **Transparência**: Documentar tudo pra comunidade entender o "why"

---

**Status**: 🟡 EM ESPERA  
**Próximo passo**: Completar Netlify Functions, depois voltar ao deploy

