# 🧬 Entangled Mfers - Architecture & Implementation

## 📖 **Conceito**

Quando alguém minta um Mfer no KinGallery (Base), o sistema cria uma **ligação permanente** com um Mfer original do Ethereum Mainnet.

Isso não é uma cópia ou tributo — é **evolução documentada**.

---

## 🎯 **Por que Entanglement?**

### **Narrativa**
```
Mfer Original (Ethereum) = Base de conhecimento, criatividade histórica
Mfer Novo (Base) = Evolução, melhoria, nova tecnologia, novo contexto

Entanglement = Prova que progresso é registrável
```

### **Técnico**
- Cria rastreabilidade entre cadeias
- Documenta evolução de conceito
- Permite queries cruzadas (Ethereum ↔ Base)
- Adiciona contexto ao NFT

---

## 🏗️ **Estrutura de Dados**

### **Solidity - MferMint Contract**

```solidity
// Storage
mapping(uint256 => EntangledReference) public entanglements;

struct EntangledReference {
    address originalChain;           // Ethereum (ou ID da chain)
    uint256 originalTokenId;         // ID do Mfer original
    uint256 ourTokenId;              // ID do nosso Mfer aqui
    uint256 mintedAt;                // Timestamp do mint
    string ipfsMetadataLink;         // Link com dados merged
    bool isActive;                   // Flag de validade
}

// Events
event MferEntangled(
    uint256 indexed ourTokenId,
    uint256 indexed originalTokenId,
    address originalChain,
    uint256 timestamp
);

// Functions
function mintWithEntanglement(
    address to,
    uint256 originalMferId,
    string memory paymentId
) external payable returns (uint256) {
    // 1. Valida originalMferId existe em Ethereum
    // 2. Minta novo Mfer aqui
    // 3. Busca metadata do original
    // 4. Armazena entanglement
    // 5. Emite evento
    // 6. Retorna novo tokenId
}

function getEntanglement(uint256 tokenId) 
    external view returns (EntangledReference memory) {
    return entanglements[tokenId];
}
```

---

## 🔄 **Fluxo de Mint com Entanglement**

```
1. User clica "Bend the line"
   ↓
2. Sistema gera número aleatório (1-11000 para Mfer original)
   OU usa um Mfer específico selecionado pelo user
   ↓
3. Valida via TheGraph/Etherscan API que originalMferId existe
   ↓
4. Busca metadata do original:
   - traits
   - rarity score
   - cor dominante
   - história
   ↓
5. Minta novo Mfer aqui na Base
   ↓
6. Armazena entanglement no mapping
   ↓
7. Cria metadata merged no IPFS:
   {
     "name": "Mfer #432 (entangled with Ethereum Mfer #1847)",
     "original_mfer_id": 1847,
     "original_chain": "ethereum",
     "base_mfer_id": 432,
     "minted_at": 1705084800,
     "characteristics": {
       "original_rarity": "legendary",
       "dominant_color": "#FF6B35",
       "evolution_moment": "Base mainnet era"
     }
   }
   ↓
8. Emit MferEntangled event
   ↓
9. Return tokenId + metadata
```

---

## 💾 **Integração Frontend**

### **Nova informação no ArtworkMetadata**

```typescript
// Após mint bem-sucedido, mostrar:
<div className="entanglement-info">
  <p>Entangled with Ethereum Mfer #1847</p>
  <a href="https://etherscan.io/nft/...">View Original</a>
</div>
```

### **NFTSuccessCard atualizado**

```typescript
// Mostrar:
- Your Mfer: #432 (Base)
- Entangled with: #1847 (Ethereum)
- Evolution moment: [timestamp]
- View original on Etherscan
- View yours on BaseScan
```

---

## 🔌 **APIs Necessárias**

### **Para buscar Mfer Original**

1. **TheGraph (Mainnet)**
   ```graphql
   query GetMferMetadata($id: ID!) {
     nft(id: $id) {
       name
       tokenId
       rarityScore
       traits
     }
   }
   ```

2. **Etherscan/SimplehashAPI**
   - Buscar metadata do NFT original
   - Validar ownership/existence

3. **IPFS/Arweave**
   - Armazenar metadata merged

---

## 🎨 **Metadados Merged**

### **Estrutura IPFS**

```json
{
  "name": "Mfer #432 (entangled with Ethereum Mfer #1847)",
  "description": "Evolution of the original Mfer. Base Layer moment captured and registered.",
  
  "our_mfer": {
    "id": 432,
    "chain": "base",
    "minted_at": "2026-01-13T10:30:00Z",
    "minted_by": "0x...",
    "image": "ipfs://bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq",
    "animation_url": "ipfs://bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq"
  },
  
  "original_mfer": {
    "id": 1847,
    "chain": "ethereum",
    "name": "Mfer #1847",
    "image": "https://...",
    "rarity": "legendary",
    "traits": [...]
  },
  
  "entanglement": {
    "type": "evolution",
    "concept": "Base Layer evolution of Ethereum moment",
    "timestamp": 1705084800,
    "message": "Proof that improvements lead to progress"
  },
  
  "attributes": [
    { "trait_type": "Entangled With", "value": "1847" },
    { "trait_type": "Original Chain", "value": "Ethereum" },
    { "trait_type": "Evolution Layer", "value": "Base" }
  ]
}
```

---

## 🚀 **Implementação Roadmap**

### **Phase 1: Core (Esta semana)**
- [ ] Adicionar `entanglements` mapping ao contrato
- [ ] Implementar `mintWithEntanglement()` 
- [ ] Testar com UI local

### **Phase 2: Validation (Próxima semana)**
- [ ] Integrar TheGraph para validação
- [ ] Testar busca de metadata original
- [ ] Gerar metadata merged corretamente

### **Phase 3: Polish (Antes do deploy)**
- [ ] Implementar NFTSuccessCard atualizado
- [ ] Link para Etherscan (original)
- [ ] Link para BaseScan (nossas)
- [ ] Testes de ponta a ponta

### **Phase 4: Deploy**
- [ ] Audit do contrato
- [ ] Deploy em Base testnet
- [ ] Deploy em Base mainnet
- [ ] Anúncio + celebração

---

## 🎯 **Success Metrics**

Quando a implementação estiver pronta:

✅ Cada novo Mfer tem referência clara ao original  
✅ Metadatas mergeados salvos no IPFS  
✅ Links funcionando em Etherscan + BaseScan  
✅ Narrativa clara: "Evolution documented, not imitation"  
✅ Usuários entendem o valor de ter um "Entangled Mfer"

---

**Status**: 📋 Architecture documented, ready for implementation  
**Prioridade**: 🔴 HIGH - Core para a narrativa completa
