# 🛠️ Guia Prático: Fixar payAndMint via Remix

## Resumo Rápido do Problema

Suas transações EOA falham porque **`payee2` não está configurado** em KinGallery.

**A solução é simples**: Chamar uma função do contrato para configurar sua Smart Wallet como receptor de comissões.

---

## Passo 1️⃣: Abrir Remix

1. Acesse: https://remix.ethereum.org
2. No painel esquerdo, clique em "File Explorer" (pasta)
3. Crie um novo arquivo chamado `KinGallery.sol`

---

## Passo 2️⃣: Copiar o Contrato

Cole o seguinte ABI compacto no Remix:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IKinGallery {
    function payee2() external view returns (address);
    function setGalleryPayee(address _payee2) external;
    function mintPrice() external view returns (uint256);
    function PAYEE1_AMOUNT() external view returns (uint256);
    function PAYEE2_AMOUNT() external view returns (uint256);
    function owner() external view returns (address);
}

contract DebugKinGallery {
    address constant KINGALLERY = 0x8ABb13088C1707E9d5BE43daC0e78E8D9D35e44F;
    address constant YOUR_SMART_WALLET = 0x26dcd83d4e449059abf0334e4435d48e74f28eb0;
    
    // Função para ler estado atual
    function checkCurrentState() external view returns (
        address currentPayee2,
        uint256 mintPrice,
        uint256 payee1Amount,
        uint256 payee2Amount
    ) {
        IKinGallery kg = IKinGallery(KINGALLERY);
        return (
            kg.payee2(),
            kg.mintPrice(),
            kg.PAYEE1_AMOUNT(),
            kg.PAYEE2_AMOUNT()
        );
    }
    
    // Função para configurar payee2 (CHAMAR ISSO!)
    function fixPayee2() external {
        IKinGallery(KINGALLERY).setGalleryPayee(YOUR_SMART_WALLET);
    }
}
```

---

## Passo 3️⃣: Compilar

1. Clique em "Solidity Compiler" (esquerda)
2. Selecione Compiler: `0.8.19`
3. Clique em "Compile DebugKinGallery.sol"

---

## Passo 4️⃣: Verificar Estado Atual (Leitura)

1. Clique em "Deploy & Run Transactions" (esquerda)
2. Em "Environment", selecione: **"Injected Provider (MetaMask)"**
3. Conecte sua carteira EOA (0xbcd980...)
4. **Certifique-se de estar na Base**
5. Em "Contract", selecione **"DebugKinGallery"**
6. Clique em "Deploy"
7. Em "Deployed Contracts", clique em `checkCurrentState()`

**Resultado esperado:**
```
currentPayee2: 0x0000000000000000000000000000000000000000 ❌ (ou outro endereço)
mintPrice: 300000000000000
payee1Amount: 200000000000000
payee2Amount: 100000000000000
```

---

## Passo 5️⃣: Configurar payee2 (Escrita - AÇÃO CRÍTICA)

1. Ainda em "Deployed Contracts"
2. Clique em `fixPayee2()` 
3. **Vai abrir MetaMask pedindo confirmação**
4. Aprove a transação
5. Aguarde confirmação

**Após confirmar:**
- Hash da transação vai aparecer no console
- Aguarde ~20 segundos para confirmar na Base
- Verifique em: https://base.blockscout.com/tx/{hash}

---

## Passo 6️⃣: Validar que Funcionou

1. Clique novamente em `checkCurrentState()`
2. Verifique:

```
currentPayee2: 0x26dcd83d4e449059abf0334e4435d48e74f28eb0 ✅
```

Se vir o endereço correto, **PRONTO!** ✨

---

## Passo 7️⃣: Testar Mint com EOA

Agora no seu frontend:

1. Abra o app em http://localhost:3000
2. Desconecte qualquer wallet e reconecte com **MetaMask/EOA**
3. Clique no Magic Button
4. Clique para mintar

**Esperado**: ✅ Transação bem-sucedida!

Se falhar, copie o erro e compartilhe comigo.

---

## ❓ Perguntas Frequentes

### "Preciso fazer mais alguma coisa?"

Se o `checkCurrentState()` retorna payee2 correto, você está **99% ok**.

Opcionalmente, validar MferBk0Base:
```solidity
// Chamar em MferBk0Base (0x01ECF...)

owner() → deve ser 0xbcd980... ✅
gallery() → deve ser 0x8ABb... ✅
artist() → deve ser 0xbcd980... ✅
```

Se `gallery()` não retorna KinGallery, chamar:
```solidity
setGallery(0x8ABb13088C1707E9d5BE43daC0e78E8D9D35e44F)
```

### "Posso usar o novo contrato (0x159137...)?"

**Não recomendo manter dois contratos em produção.**

Se deseja substituir:
1. Certifique-se que o novo contrato foi verificado corretamente
2. Faça testes completos de mint com EOA e Smart Wallet
3. Update `.env.local`: `NEXT_PUBLIC_MFER_ADDRESS=0x159137BF...`
4. **Depois que tudo funciona**

---

## 🆘 Se Algo der Errado

Compartilhe:
1. Hash da transação `fixPayee2()` 
2. Resultado de `checkCurrentState()` antes e depois
3. Erro específico (se houver)

---

**Tempo estimado**: 5-10 minutos  
**Risco**: Muito baixo (apenas configurando endereço que você controla)  
**Impacto**: Desbloqueia EOA mints completamente  

✅ **Você consegue!**
