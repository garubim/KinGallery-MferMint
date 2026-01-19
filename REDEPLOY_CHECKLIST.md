# 🚀 REDEPLOY CHECKLIST - KinGallery

**Data**: 18 de Janeiro de 2026  
**Status**: ✅ Código pronto para deploy  
**Mudanças Aplicadas**: 6 alterações

---

## ✅ O QUE FOI FEITO

### Mudanças Aplicadas em KinGallery.sol:

1. ✅ Removido `RELAYER_ROLE` constante
2. ✅ Removido `_relayer` e `_admin` do constructor (agora 3 params: usdc, multisig, payee2)
3. ✅ Removido validações de relayer no constructor
4. ✅ Removido funções `setRelayer()` e `removeRelayer()`
5. ✅ Corrigido `payAndMint()`: `.transfer()` → `.call{value:}("")` (2 transferências)
6. ✅ Corrigido `withdrawETH()`: `.transfer()` → `.call{value:}("")`

---

## 📋 PRÓXIMOS PASSOS

### Passo 1: Compilar no Remix
1. Abrir: https://remix.ethereum.org
2. Criar arquivo: `KinGallery_REDEPLOY.sol`
3. Copiar conteúdo de: `/contracts/KinGallery.sol`
4. Compilar com Solidity `0.8.19`
5. Verificar se compila SEM erros ✅

### Passo 2: Deploy em Base
1. Deploy & Run → Injected Provider (MetaMask)
2. Conectar com sua EOA (0xbcd980...)
3. **Estar em Base chain (8453)**
4. Em Constructor, copiar esses parametros:

```
_usdc: 0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913
_multisig: 0x4d639d1bd428899599f0da564926da1a1a3bd3a8
_payee2: 0x26dcd83d4e449059abf0334e4435d48e74f28eb0
```

5. Clique "Deploy"
6. **Anote o novo endereço:** `0xNEW...`

### Passo 3: Verificar em BaseScan
1. Ir para: https://basescan.org/address/0xNEW...
2. Clicar em "Verify Contract"
3. Solidity (Single File)
4. Versão: `0.8.19`
5. License: `MIT`
6. Copiar código de `KinGallery.sol`
7. Constructor Args (encode em Remix):
   ```
   0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913
   0x4d639d1bd428899599f0da564926da1a1a3bd3a8
   0x26dcd83d4e449059abf0334e4435d48e74f28eb0
   ```

### Passo 4: Atualizar Frontend
Arquivo: `.env.local`

```env
NEXT_PUBLIC_KINGALLERY_CONTRACT=0xNEW_ADDRESS_AQUI
```

### Passo 5: Atualizar Paymaster Dashboard (CDP)
1. Ir para: Coinbase Developer Dashboard
2. Encontrar seção "Contract Configuration"
3. Atualizar:

```
Name: KinGallery
Contract Address: 0xNEW_ADDRESS_AQUI
Functions: payAndMint(address,address,string), processPayment(address,address,uint256,string)
```

4. **MferBk0Base**: Deixar igual (não muda)
   ```
   Name: MferBk0Base
   Contract Address: 0x01ECF65958dB5d1859d815ffC96b7b8C5e16E241
   Functions: (não preencher - contrato não é chamado diretamente)
   ```

### Passo 6: Testar
1. Frontend: Desconectar/reconectar com MetaMask (EOA)
2. Clicar Magic Button
3. Tentar mintar

**Esperado**: ✅ Transação com 2 transfers bem-sucedidos

---

## 🎁 CONSTRUCTOR ARGS (PRÉ-ENCODADOS)

Se precisar dos constructor args já encoded para BaseScan:

```
0x0000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000004d639d1bd428899599f0da564926da1a1a3bd3a80000000000000000000000026dcd83d4e449059abf0334e4435d48e74f28eb0
```

(Paste diretamente em BaseScan "Constructor Arguments" field)

---

## 📊 RESUMO DE MUDANÇAS

| Item | Antes | Depois |
|------|-------|--------|
| **Constructor params** | 5 | 3 |
| **RELAYER_ROLE** | Ativo | ❌ Removido |
| **Transfer method** | `.transfer()` | `.call{}` |
| **Functions públicas** | Mesmo | Mesmo ✅ |
| **Interface do frontend** | Igual | Igual ✅ |

---

## ✅ CHECKLIST FINAL

- [ ] Código compilou no Remix SEM erros
- [ ] Deploy foi bem-sucedido em Base
- [ ] Contrato verificado em BaseScan
- [ ] .env.local atualizado com novo endereço
- [ ] Paymaster Dashboard atualizado
- [ ] Teste de mint com EOA funcionou
- [ ] Transação mostra 2 transfers (artist + gallery)

---

**Status**: 🟢 Pronto para deploy!

Quer que eu gere o arquivo **flattened** também, ou você prefere usar o Remix direct?

