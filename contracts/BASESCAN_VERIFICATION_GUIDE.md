# Guia de Verificação do Contrato KinGallery na BaseScan

## 📋 Informações Importantes

**Arquivo gerado:** `KinGallery_StandardJSON_Complete.json` (69KB)
**Compilador Solidity:** v0.8.19+commit.7dd6d404
**Método de Verificação:** Standard-Json-Input

---

## 🚀 Passo a Passo para Verificação

### 1. Acesse seu Contrato na BaseScan
- Vá para: https://basescan.org/address/SEU_ENDERECO_DO_CONTRATO
- Clique na aba **"Contract"**
- Clique em **"Verify and Publish"**

### 2. Selecione o Método de Verificação
- **Compiler Type:** Solidity (Standard-Json-Input)
- **Compiler Version:** v0.8.19+commit.7dd6d404
- **Open Source License Type:** MIT License (SPDX)

### 3. Faça Upload do Arquivo JSON
- Clique em **"Choose File"** ou arraste o arquivo
- Selecione: `KinGallery_StandardJSON_Complete.json`

### 4. Informações do Constructor (se solicitado)

O contrato KinGallery foi implantado com **5 parâmetros** no constructor:

```solidity
constructor(
    address _usdc,        // Endereço do USDC na Base
    address _multisig,    // Endereço da Gnosis Safe Multisig
    address _payee2,      // Endereço da Gallery (fixo)
    address _relayer,     // Endereço do Relayer
    address _admin        // Endereço do Admin
)
```

#### Endereços Padrão (Base Mainnet):
- **USDC:** `0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`
- **Multisig:** (seu endereço da Gnosis Safe)
- **Payee2 (Gallery):** (seu endereço da gallery)
- **Relayer:** (endereço do relayer CDP)
- **Admin:** (seu endereço admin)

#### Como Gerar Constructor Arguments (ABI-encoded):
Se a BaseScan pedir o campo "Constructor Arguments ABI-encoded", use o script Python:

```bash
cd /Users/gabrielrubim/dev/GitHub/KinGallery+MferMint/contracts
python3 generate_constructor_args.py
```

Ou use o Remix:
1. Deploy > At Address
2. Copie os argumentos encoded do campo "Encoded constructor arguments"

---

## 📝 Informações Técnicas

### Configuração do Compilador
- **Optimizer:** Desabilitado (enabled: false)
- **Runs:** 200
- **EVM Version:** paris
- **Via IR:** false

### Imports do Contrato
O contrato importa as seguintes bibliotecas OpenZeppelin v4.9.0:
- `IERC20Metadata.sol`
- `SafeERC20.sol`
- `ReentrancyGuard.sol`
- `Pausable.sol`
- `AccessControl.sol`

Todas estão incluídas no arquivo flattened.

---

## ✅ Checklist de Verificação

- [ ] Arquivo JSON gerado (69KB)
- [ ] Compiler version: v0.8.19+commit.7dd6d404
- [ ] Método: Standard-Json-Input
- [ ] License: MIT
- [ ] Constructor arguments prontos (se necessário)
- [ ] Contrato deployed no endereço correto

---

## ⚠️ Troubleshooting

### Erro: "Bytecode does not match"
1. Verifique se o compilador é **exatamente** v0.8.19+commit.7dd6d404
2. Confirme que o optimizer está **desabilitado** (enabled: false)
3. Verifique os constructor arguments

### Erro: "Invalid JSON format"
- O arquivo JSON foi gerado corretamente pelo script Python
- Se der erro, tente fazer upload novamente

### Erro: "Constructor arguments required"
1. Use o script `generate_constructor_args.py` ou
2. Extraia do Remix IDE após deploy simulado

---

## 🔗 Links Úteis

- **BaseScan:** https://basescan.org
- **Remix IDE:** https://remix.ethereum.org
- **Base Chain ID:** 8453
- **Base RPC:** https://mainnet.base.org

---

## 📞 Próximos Passos

Após verificar o contrato:
1. Teste a interação via BaseScan UI
2. Verifique as funções públicas (read/write)
3. Conecte com o relayer-v2.mjs
4. Teste o frontend em localhost:3000
5. Deploy para produção

---

**Gerado em:** 11 de janeiro de 2026
**Status:** Pronto para Verificação ✅
