# 🎯 Plano de Finalização - KinGallery + MferMint
**Criado**: 16 de janeiro de 2026  
**Projeto**: Mini App Farcaster + Base App  
**Status**: ~95% completo - faltam tarefas críticas finais

---

## ✅ O QUE JÁ ESTÁ FUNCIONANDO

### Infraestrutura
- ✅ Next.js 16 rodando com Turbopack (dev em 3.2s)
- ✅ Paymaster Coinbase integrado diretamente (sem backend)
- ✅ WalletConnect configurado com Project ID público
- ✅ Contratos verificados no BaseScan
- ✅ SDKs atualizados (wagmi v2.19, viem v2.44, @farcaster/miniapp-sdk v0.2.1)

### Frontend
- ✅ MagicMintButton com animações WebP (1280x720, 13.4MB otimizado)
- ✅ Sistema de frases ritualísticas (5 frases sequenciais após connect)
- ✅ Toggle ETH/USDC com feedback visual
- ✅ Glass morphism styling (3 estados: normal/hover/active)
- ✅ Auto-disconnect ao fechar tab
- ✅ ArtworkMetadata panel com pricing e info

### Smart Contracts
- ✅ KinGallery.sol deployado em `0x8abb13088c1707e9d5be43dac0e78e8d9d35e44f`
- ✅ MferMintGalleryCompatible.sol deployed at 0x3EAa38e66e4097262f75ba735A82740e64Afb308 Verified and published at BaseScan 
More inormation at https://repo.sourcify.dev/8453/0x3EAa38e66e4097262f75ba735A82740e64Afb308
- ✅ Código poético onchain incluído (`manifestoSoul()`)

---

## 🚨 TAREFAS CRÍTICAS (OBRIGATÓRIAS PARA PRODUÇÃO)

### 1. 🔧 Deploy MferBk0Base (MferMint Corrigido)
**Status**: ❌ BLOQUEADOR CRÍTICO  
**Problema**: Incompatibilidade de tipos entre contratos deployados
- KinGallery (0x8abb...) chama `mintForWithEthFromGallery(address to, string paymentId)`
- MferMint (0x3EAa...) espera `mintForWithEthFromGallery(address to, bytes32 paymentId)`
- **Tipos primitivos incompatíveis**: `string` ≠ `bytes32` (sem conversão on-chain possível)

**Solução**: Deploy novo contrato MferBk0Base com `string calldata paymentId`

**Arquivo corrigido**: `/contracts/MferMintGalleryCompatible_FIXED.sol`
**Nome do contrato**: `MferBk0Base` (aparecerá na BaseScan com nome público)

**Mudanças**:
- Linha 27: `mapping(string => bool) public mintedWithPaymentId;` (era bytes32)
- Linha 29-30: Events com `string paymentId` (era bytes32)
- Linha 62: `function mintFor(address to, string calldata paymentId)` (era bytes32)
- Linha 63: Validação `bytes(paymentId).length > 0` (era `!= bytes32(0)`)
- Linha 74: `function mintForWithEthFromGallery(address to, string calldata paymentId)` (era bytes32)
- Linha 75: Mesma validação com `bytes(paymentId).length > 0`
- Linha 105: `emit ArtistMinted(artist, tokenId, "");` (era bytes32(0))

**Passos no Remix**:
1. Copiar código de `MferMintGalleryCompatible_FIXED.sol`
2. Compilar com Solidity 0.8.19
3. Deploy contrato `MferBk0Base` com constructor:
   - `name_`: "Mfer #0 - Base"
   - `symbol_`: "MFERBK0"
   - `baseURI_`: "ipfs://bafybeiguvmp46oqypfvqiqsnjyraqul47zjqrfukw5tnwjjczl3aij3s6y/"
   - `initialOwner_`: 0x8abb13088c1707e9d5be43dac0e78e8d9d35e44f (KinGallery)
4. Verificar na BaseScan (nome do contrato será "MferBk0Base")
5. Atualizar `NEXT_PUBLIC_MFERMINT_CONTRACT` em `.env.local`
6. **NÃO afeta Paymaster** (KinGallery continua igual)

**Referência**: [MFERMINT_INCOMPATIBLE_FIX.md](MFERMINT_INCOMPATIBLE_FIX.md)

---

### 2. 🎨 Escolher 5ª Frase Ritual
**Status**: ❌ DECISÃO PENDENTE  
**Localização**: `app/components/MagicMintButton.tsx` linha ~16

**Opções** (escolha uma):
```typescript
1. "and clicks to own it"         // [ATUAL] Direto, possessão
2. "and writes it in history"     // Blockchain permanence
3. "and engraves its soul"        // Poético, alma/identidade  
4. "and spins the loop onchain"   // Técnico, referência ao loop
5. "and clicks to take it"        // Mais agressivo
```

**Timeline completa após escolha**:
```
APÓS WALLET CONNECT:
1. "The eyes see the flatline"  [800ms]
2. "at 9 o'clock"               [800ms]
3. "The mouse bends it"         [800ms]
4. "into a smile"               [900ms]
5. [SUA ESCOLHA AQUI]           [1000ms]
Total: ~4.3 segundos
```

---

### 3. 🧪 Teste E2E Completo
**Status**: ❌ NÃO VALIDADO EM PRODUÇÃO

**Checklist de teste**:
- [ ] Conectar wallet (MetaMask + Coinbase Wallet)
- [ ] Frases ritualísticas aparecem em ordem
- [ ] Toggle ETH/USDC muda cor do botão
- [ ] Mint com ETH (0.0003 ETH) → Sucesso
- [ ] Mint com USDC → Aprovação + Mint
- [ ] Paymaster cobre gas fee automaticamente
- [ ] Redirect para `/gallery?tokenId=...` funciona
- [ ] NFT aparece na galeria
- [ ] Auto-disconnect ao fechar tab

---

### 4. 📱 Configurar Farcaster Miniapp Manifest
**Status**: 🔄 RASCUNHO PRONTO  
**Referência**: [MINIAPP_DEPLOY_CHECKLIST.md](MINIAPP_DEPLOY_CHECKLIST.md)

**Arquivo**: `public/manifest.json` (criar)
```json
{
  "name": "KinGallery",
  "short_name": "KinGallery",
  "description": "Evolutionary NFT minting on Base",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#0052FF",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Passos**:
1. Criar ícones 192x192 e 512x512 (logo KinGallery)
2. Adicionar `manifest.json` ao `public/`
3. Linkar no `app/layout.tsx`:
   ```tsx
   <link rel="manifest" href="/manifest.json" />
   ```
4. Registrar no [Farcaster Developer Console](https://dev.farcaster.xyz)

---

## 📝 TAREFAS OPCIONAIS (MELHORIAS)

### 5. 🧹 Limpeza de Arquivos Legacy
**Status**: ⚙️ OPCIONAL MAS RECOMENDADO

Deletar arquivos obsoletos (ver [DEPLOY_STRATEGY.md](DEPLOY_STRATEGY.md) linhas 46-60):
```bash
git rm README.PAYMASTER.md
git rm README.md
git rm -r netlify/
git rm -r paymaster-app/
git rm -r my-wallet/
```

---

### 6. 📊 Analytics & Monitoring
**Status**: ⚙️ OPCIONAL

- [ ] Adicionar Vercel Analytics
- [ ] Configurar error tracking (Sentry)
- [ ] Monitorar Paymaster quota (Coinbase dashboard)

---

### 7. 🎬 Otimizar Animações WebP
**Status**: ⚙️ JÁ OTIMIZADO (13.4MB)

Arquivo atual: `MagicButton_LOGIN-to-MINT-COMPLETE+Alpha-1280x720px-30fps-AnimatedWebP-HighQ-Lossy-Letterbox-20%.webp`

Se necessário comprimir mais:
- Reduzir qualidade lossy (atual: 20%)
- Diminuir FPS (30fps → 24fps)
- Croppar letterbox

---

## 🚀 ORDEM DE EXECUÇÃO RECOMENDADA

1. **AGORA**: Deploy MferMintGalleryCompatible.sol (CRÍTICO)
2. **HOJE**: Escolher 5ª frase ritual e testar localmente
3. **AMANHÃ**: Teste E2E completo na Base mainnet
4. **DEPOIS**: Configurar Farcaster manifest
5. **FINAL**: Deploy production (Vercel/Netlify)

---

## 📌 INFORMAÇÕES IMPORTANTES

### Endereços de Contrato
- **KinGallery**: `0x8abb13088c1707e9d5be43dac0e78e8d9d35e44f` ✅ Deployado (sem nome público na BaseScan)
- **MferMint (INCOMPATÍVEL)**: `0x3EAa38e66e4097262f75ba735A82740e64Afb308` ❌ bytes32 paymentId (precisa redeploy)
- **MferMint OLD**: `0x86a34dfab59996c6fb809d1f2b016a0ed397e682` ❌ Sem funções gallery
- **USDC Base**: `0x833589fcd6edb6e08f4c7c32d4f71b54bda02913` ✅

### Variáveis de Ambiente (.env.local)
```bash
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base/f2382ec7-3413-485d-95d2-1fc127ec942c
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=44788a3961a4e5fa217c4ddb6ae62da8
NEXT_PUBLIC_KINGALLERY_CONTRACT=0x8abb13088c1707e9d5be43dac0e78e8d9d35e44f
NEXT_PUBLIC_MFERMINT_CONTRACT=0x86a34dfab59996c6fb809d1f2b016a0ed397e682
NEXT_PUBLIC_USDC_CONTRACT=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913
NEXT_PUBLIC_CHAIN_ID=8453
```

**⚠️ APÓS DEPLOY**: Atualizar `NEXT_PUBLIC_MFERMINT_CONTRACT` com novo endereço

---

## 🛑 BLOCKERS ATUAIS

1. **MferMint incompatível** → Impede mint de funcionar
   - Sem `mintFor()` e `mintForWithEthFromGallery()`
   - Solução: deploy MferMintGalleryCompatible.sol

2. **Frase ritual indefinida** → UI incompleta
   - Decisão artística necessária
   - Solução: escolher uma das 5 opções

---

## ✅ CHECKLIST FINAL DE DEPLOY

Antes de ir pra produção:

- [ ] MferMintGalleryCompatible.sol deployado e verificado
- [ ] `.env.local` atualizado com novo contrato
- [ ] 5ª frase ritual escolhida e implementada
- [ ] Teste E2E com ETH (0.0003 ETH) bem-sucedido
- [ ] Teste E2E com USDC bem-sucedido
- [ ] Paymaster cobrindo gas fees
- [ ] Auto-disconnect funcionando
- [ ] Farcaster manifest configurado
- [ ] Build production sem warnings (`npm run build`)
- [ ] Deploy no Vercel/Netlify

---

**Estimativa**: 4-6 horas de trabalho (considerando deploy de contrato + testes)  
**Prioridade**: Deploy do MferMintGalleryCompatible é BLOQUEADOR CRÍTICO

Qualquer dúvida, consulte:
- [MFERMINT_INCOMPATIBLE_FIX.md](MFERMINT_INCOMPATIBLE_FIX.md) - Detalhes do problema de compatibilidade
- [DEPLOY_STRATEGY.md](DEPLOY_STRATEGY.md) - Estratégia geral de deploy
- [TODO_JAN_11_2026.md](TODO_JAN_11_2026.md) - TODO list anterior (já resolvida)
