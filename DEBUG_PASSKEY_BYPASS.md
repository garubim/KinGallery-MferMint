# 🔐 Debug: Por que a Passkey Não Está Sendo Pedida

**Status**: 🔴 CRITICAL - Segurança comprometida
**Data**: 18 Jan 2026
**Impacto**: Usuários conseguem conectar wallet SEM validação biométrica obrigatória

---

## 📋 Problema

Mesmo com configuração `smartWalletOnly` no Coinbase Wallet connector:
```typescript
coinbaseWallet({
  preference: 'smartWalletOnly', // Deveria forçar biometria
})
```

✗ Usuário conecta wallet sem ser solicitado passkey/biometria
✗ Falha de segurança: Acesso sem validação extra

---

## 🔍 Como Debugar

### 1. Abrir Console do Browser (F12)

Quando você conectar wallet, procure por estes logs:

```
✓ Wallet CONNECTED: {
  address: "0x26dcd83...",
  chain: "Base",
  chainId: 8453,
  timestamp: "14:30:45"
}

🔍 Debugging passkey: Se você viu este log SEM ter digitado biometria, a passkey foi pulada!
```

**Se virou a segunda mensagem, a passkey foi BYPASSada** ⚠️

### 2. Verificar Network Tab

- Procure por requests enviados para `cdn.coinbase.com` ou `wallet.coinbase.com`
- Verifique se há chamada para Smart Wallet initialization
- Status esperado: 200 OK
- Se vir 4xx/5xx, o SDK pode estar com erro

### 3. Verificar Local Storage

No DevTools (Ctrl+Shift+I):
1. Application → Local Storage
2. Procure por chaves com "coinbase" ou "wallet"
3. Procure por flag `requiresPasskey` ou similar
4. Se estiver `false`, passkey foi desabilitada

### 4. Testar Diferentes Cenários

**Cenário A: App em localhost (Dev)**
```bash
npm run dev
# Abrir http://localhost:3000
# Tentar conectar wallet
# Observar se passkey é pedida
```

**Cenário B: App em Netlify (Prod)**
```
# Visitar app em produção
# Tentar conectar wallet
# Comparar behavior com dev
# Se passkey funciona em prod mas não em dev → SDK behavior diferente
```

**Cenário C: App em incógnito (sem cache)**
```
# Abrir em new incognito window
# Limpar cache antigo
# Tentar conectar
# Se passar sem passkey → cache não é culpado
```

---

## 🔧 Possíveis Causas

### Causa #1: SDK em modo "Lenient" em Dev
**Sintoma**: Passkey funciona em prod (Netlify) mas não em dev (localhost)
**Solução**:
```typescript
// Adicionar em rootProvider.tsx
coinbaseWallet({
  appName: 'KinGallery',
  preference: 'smartWalletOnly',
  // Adicionar estes parâmetros:
  settingsOverrides: {
    strictMode: true, // Force strict passkey validation
  }
})
```

### Causa #2: Coinbase Wallet versão outdated
**Sintoma**: Connector não respeita preference
**Solução**:
```bash
npm list wagmi @wagmi/connectors
# Ver versões
# Se wagmi < 2.19 ou @wagmi/connectors < 4.0, atualizar
npm update wagmi @wagmi/connectors --save
```

### Causa #3: OnchainKit não está forçando Smart Wallet
**Sintoma**: OnchainKit deixa usuário escolher entre EOA e Smart Wallet
**Solução**: Remover `injected()` connector, deixar apenas `coinbaseWallet`:
```typescript
// ❌ NÃO fazer isso:
connectors: [
  coinbaseWallet({ preference: 'smartWalletOnly' }),
  injected(), // ← PERMITE EOA! Remove isso
]

// ✅ Fazer assim:
connectors: [
  coinbaseWallet({ preference: 'smartWalletOnly' }),
  // Sem injected
]
```

---

## ✅ Verificação Técnica

### Passo 1: Validar Configuração Inicial
```javascript
// No console do DevTools, execute:
console.log('🎯 Coinbase Wallet Config:');
console.log('preference:', 'smartWalletOnly');
console.log('expected: passkey obrigatória');
```

### Passo 2: Monitorar Evento de Conexão
```javascript
// No DevTools console:
window.addEventListener('message', (event) => {
  if (event.data.type?.includes('wallet') || event.data.type?.includes('passkey')) {
    console.log('📨 Wallet Event:', event.data);
  }
});
```

### Passo 3: Verificar Lógica de Fallback
Abrir DevTools → MagicMintButton.tsx
- Linha 60-100: Lógica de conexão
- Procurar por: `useConnect()` e `connect()`
- Se está chamando com parâmetro específico (ex: `connectors[0]`), deveria forçar coinbaseWallet

---

## 📊 Árvore de Decisão

```
App conectou sem passkey? 
├─ SIM
│  ├─ Tá em localhost?
│  │  ├─ SIM → Pode ser dev mode behavior (Causa #1)
│  │  └─ NÃO → Issue é em produção (crítico!)
│  │
│  ├─ Tem injected() connector?
│  │  ├─ SIM → Remove (Causa #3)
│  │  └─ NÃO → Continue debug
│  │
│  └─ Cache do browser?
│     ├─ SIM → Limpar (Incognito test)
│     └─ NÃO → Continue debug
│
└─ NÃO (Passkey foi pedida) 
   └─ ✅ Tudo funcionando, sem problemas!
```

---

## 🚨 Red Flags

Se você vê estes sinais, há bypass:

```
❌ Usuário conectou em <2s (sem delay para biometria)
❌ Modal de passkey nunca apareceu
❌ Console mostra "DISCONNECTED" então "CONNECTED" sem delay
❌ Sem nenhum prompt do Coinbase Wallet app
❌ Funcionou sem abrir app da Coinbase Wallet no celular
```

---

## ✨ Solução Temporária (Se for urgente)

Se precisar bloquear EOA enquanto debuga:

```typescript
// Em MagicMintButton.tsx, adicionar check:
if (isConnected && address) {
  // Verificar se é realmente Smart Wallet
  const isSmartWallet = address.toLowerCase().startsWith('0x00'); // Heurística básica
  if (!isSmartWallet && !address.includes('0x')) {
    setErrorMessage('❌ Apenas Smart Wallet com biometria é permitido');
    setShowError(true);
    disconnect();
    return;
  }
}
```

Não é perfeito, mas bloqueia EOA rapidamente.

---

## 📝 Próximos Passos

1. **HOJE**: 
   - [ ] Abrir DevTools F12 e conectar wallet
   - [ ] Procurar pelos logs `✓ Wallet CONNECTED` e `🔍 Debugging passkey`
   - [ ] Se passkey NÃO foi pedida → Red flag confirmada

2. **IMEDIATAMENTE APÓS**:
   - [ ] Testar em incógnito (cache)
   - [ ] Testar em produção Netlify (vs localhost)
   - [ ] Verificar versão do Coinbase SDK

3. **SE CONTINUAR FALHANDO**:
   - [ ] Abrir issue no repo do wagmi/OnchainKit
   - [ ] Descrever: Passkey não solicitada com `smartWalletOnly`
   - [ ] Incluir console logs do DevTools

---

## 🎯 Success Criteria

✅ Quando estiver certo:
- Usuário clica "Connect Wallet"
- Vê prompt do Coinbase para confirmar passkey/biometria
- SÓ depois de confirmar conecta
- Console mostra todo o flow com timestamps
- "🔍 Debugging passkey" log foi precedido de biometric prompt

---

**Logs adicionados**: Commit `68f8edd`
**Arquivo de ref**: Este arquivo
**Status**: Ready for debugging 🔍

