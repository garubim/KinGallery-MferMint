# 📋 TODO - Jan 11, 2026 (Noite/Madrugada)

## ✅ COMPLETADO HOJE

### Performance & Cleanup
- [x] Next.js Turbopack otimizado (Ready em 3.2s vs 30-50s)
- [x] SDKs atualizados (@farcaster/miniapp-sdk@0.2.1, @tanstack/react-query@5.90.16)
- [x] Splash screen simplificado (timeout único 4s)
- [x] **CANCER EXTIRPADO**: `poster="/splash.png"` removido de todos os vídeos
- [x] Provider otimizado (cache 30s, GC 5min, hydration melhorada)

### Bugs Resolvidos
- [x] Botão "Save the Ritual" quebrado (chamava `handleAddFrame()` inexistente)
- [x] Poster do vídeo causando "imagem fantasma" após splash
- [x] Configuração webpack conflitando com Turbopack

---

## 🎯 PRÓXIMOS PASSOS

### AMANHÃ (Jan 12, 2026)
**Frases Animadas - Implementação Final**

#### 5ª Frase Ritual - ESCOLHER UMA:
```typescript
// Arquivo: app/components/MagicMintButton.tsx (linha 16)

OPÇÕES:
1. "and clicks to own it"         [ATUAL - implementado]
2. "and writes it in history"     [blockchain permanence]
3. "and engraves its soul"        [poético, alma/identidade]  
4. "and spins the loop onchain"   [técnico, referência ao loop]
5. "and clicks to take it"        [direto, possessão]
```

#### Timeline Completa (Referência):
```
APÓS WALLET CONNECT:
1. "The eyes see the flatline"  [800ms]
2. "at 9 o'clock"               [800ms]
3. "The mouse bends it"         [800ms]
4. "into a smile"               [900ms]
5. [ESCOLHER ACIMA]             [1000ms]
Total: ~4.3 segundos
```

---

## 📦 ANTES DO DEPLOY

### Critical Checklist:
- [ ] **Splash**: Mudar `useState(false)` → `useState(true)` em `app/page.tsx` linha 9
  ```typescript
  // ATUAL (dev):
  const [showSplash, setShowSplash] = useState(false); // TODO: true para deploy
  
  // DEPLOY:
  const [showSplash, setShowSplash] = useState(true);
  ```

- [ ] **Testar mint** em produção (Base mainnet)
- [ ] **Verificar Paymaster** funding (Coinbase)
- [ ] **Confirmar contract** 0x8abb13088c1707e9d5be43dac0e78e8d9d35e44f ativo

---

## 🎨 MELHORIAS FUTURAS (Backlog)

### Gallery Page
- [ ] Mensagem de entrada: "The soul spins at a base - where the smile comes home."
- [ ] Mensagem final: "This is not animation... it's a ritual!"
- [ ] NFT Card design melhorado
- [ ] Botões: View on BaseScan, Share, Mint Another

### Farcaster Miniapp
- [ ] Manifest completo (/.well-known/farcaster.json)
- [ ] accountAssociation via Base Build tool
- [ ] Testar preview no Base Build

---

## 📝 NOTAS IMPORTANTES

### Arquitetura Atual:
- **Next.js 16.1.1** (Turbopack)
- **OnchainKit 1.1.2** (direct Paymaster, no relayer)
- **Contract**: 0x8abb13088c1707e9d5be43dac0e78e8d9d35e44f (Base 8453)
- **Video IPFS**: bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq

### Regra de Ouro:
**❌ NÃO MEXER EM `.env` SEM AUTORIZAÇÃO**

### Performance Esperada:
- **Compile time**: <5s (Turbopack)
- **Splash duration**: 4s
- **Ritual phrases**: 4.3s total
- **Mint transaction**: ~3-5s (Base + Paymaster)

---

**Status**: App funcional, pronto para mint testing  
**Próximo marco**: Escolher frase final → Deploy production
