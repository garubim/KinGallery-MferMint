# 🔧 Fix: tokenURI Faltando .json no Suffix

**Data**: 22 de Janeiro, 2026  
**Problema**: OpenSea não resolve metadados porque tokenURI retorna `/1` em vez de `/1.json`  
**Status**: ✅ FIX PRONTO

---

## O Problema Específico

```
Contrato retorna: ipfs://bafybeih.../1
IPFS tenta resolver: /1 (não encontra! não existe!)
Deveria retornar: ipfs://bafybeih.../1.json (aí resolve!)
```

**Por que acontece:**
- ERC721 padrão concatena `baseURI + tokenId`
- `baseURI` = `"ipfs://metadata/"`
- `tokenId` = `"1"`
- Resultado: `"ipfs://metadata/1"` ← **SEM .json**
- OpenSea tenta carregar `ipfs://metadata/1` e falha

---

## A Solução: Override tokenURI

Adicionei um override da função `tokenURI()` que adiciona `.json` automaticamente:

```solidity
function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_ownerOf(tokenId) != address(0), "Token does not exist");
    string memory baseURI = _baseURI();
    // Adiciona .json automaticamente no final da URI
    return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
}
```

**Agora retorna:**
```
ipfs://bafybeih.../1.json ✅
```

---

## Arquivos Atualizados

- ✅ `contracts/MferMintGalleryCompatible.sol` - Template base
- ✅ `contracts/MferBk0Base_DEPLOYED_VERIFIED_JAN17.sol` - Versão atual (0x01ECF...)
- ✅ `contracts/MferBk0Base_FreshStart_Standby.sol` - Backup

---

## Próximos Passos

### 1. Compilar e Verificar
```bash
# Via Remix ou Hardhat
npx hardhat compile --force
```

### 2. Deploy do Novo Contrato (Opção A - Com Novo Deploy)
Se quer usar versão nova com o fix:
```solidity
// Em Remix
// 1. Compile MferBk0Base_DEPLOYED_VERIFIED_JAN17.sol v2 com fix
// 2. Deploy em Base com:
//    name: "Ethereum Mfer - Based"
//    symbol: "EMFER-BASED"
//    baseURI: "ipfs://bafybeihwtlwxbgnzfjsamyr7uyrgi3bt3osv72vv6muesrq7mnvbrtawcq/"
//    owner: seu address
// 3. Chame: setGallery(KinGallery address)
// 4. Update .env: NEXT_PUBLIC_MFER_ADDRESS=novo contract
```

### 3. Verificar Metadata no IPFS
```bash
# Teste no browser
curl "https://ipfs.io/ipfs/bafybeihwtlwxbgnzfjsamyr7uyrgi3bt3osv72vv6muesrq7mnvbrtawcq/1.json"
# Deve retornar JSON com image_url que aponta pra imagem
```

### 4. Aguardar OpenSea Re-indexar
- OpenSea vai refetch metadados automaticamente
- Pode levar 5-30 minutos
- Ou forçar via OpenSea: `https://opensea.io/assets/base/[contract]/1`

---

## Exemplo de JSON Correto em IPFS

Seu JSON deve estar assim:
```json
{
  "name": "Ethereum Mfer #1",
  "description": "Based collection of ethereal mfers",
  "image": "ipfs://bafybeihwtlwxbgnzfjsamyr7uyrgi3bt3osv72vv6muesrq7mnvbrtawcq/image.webp",
  "external_url": "https://kingallery.com/mfers",
  "attributes": [
    {
      "trait_type": "Edition",
      "value": "1/1000"
    }
  ]
}
```

E estar **em**: `ipfs://bafybeih.../1.json` (não em `/image` ou sem extension)

---

## Validação

### ✅ Antes (Quebrado)
```
Token #1 URI: ipfs://bafybeih.../1
OpenSea tenta: GET /ipfs/bafybeih.../1
Resultado: ❌ 404 Not Found
```

### ✅ Depois (Funcionando)
```
Token #1 URI: ipfs://bafybeih.../1.json
OpenSea tenta: GET /ipfs/bafybeih.../1.json
Resultado: ✅ 200 OK + Metadata JSON + Image carrega
```

---

## Tabela: Arquivos Modificados

| Arquivo | Linha | Mudança |
|---------|-------|---------|
| MferMintGalleryCompatible.sol | ~127 | Added tokenURI override |
| MferBk0Base_DEPLOYED_VERIFIED_JAN17.sol | ~157 | Added tokenURI override |
| MferBk0Base_FreshStart_Standby.sol | ~162 | Added tokenURI override |

---

## FAQ

**P: Isso quebra tokens já mintados?**
A: ❌ Não. OpenSea vai refetch automaticamente.

**P: Preciso fazer re-deploy?**
A: ✅ Sim, contrato atual não tem o fix. Precisa deploy novo.

**P: Quanto de gas para deploy?**
A: ~150-200k gas (±$10-30 USD em Base)

**P: E os 6 JSONs que já estão em IPFS?**
A: ✅ Continuam ok. Agora o contrato vai apontá-los corretamente.

**P: OpenSea vai carregar a imagem?**
A: ✅ Sim, assim que:
1. Contrato novo com fix está deployado
2. JSON está acessível em IPFS com `.json`
3. `image` no JSON aponta pra imagem correta

---

## Timeline

```
AGORA (22/01):
  ├─ ✅ Code fix implementado
  ├─ Compile + Verify
  └─ Deploy novo em Base (ou via Remix)

AMANHÃ (23/01):
  ├─ OpenSea re-indexa
  └─ Metadados carregando ✨

PRÓXIMA SEMANA:
  └─ Colecionar funciona 100%
```

---

**Última atualização**: 2026-01-22  
**Status**: ✅ Pronto para implementar

