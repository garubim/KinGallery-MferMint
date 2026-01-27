# 🔗 Metadata Automática com Endpoint Dinâmico

## Problema Atual
- Cada NFT precisava de upload manual no Pinata
- Apenas 6 de 15 tokens estão indexados corretamente
- Processo é insustentável em produção (1000 tokens!)

## Solução Implementada
KinGallery agora tem um **endpoint dinâmico de metadata** que gera metadata automaticamente para cada token:

### API Endpoint
```
GET /api/metadata/[tokenId]
```

**Exemplo:**
```
https://kingallery.netlify.app/api/metadata/1
```

**Retorna:**
```json
{
  "name": "Mfer-0'-Base #1/1000",
  "description": "Your mark is recorded...",
  "image": "https://kingallery.netlify.app/api/generate-image/1",
  "external_url": "https://kingallery.netlify.app/gallery?tokenId=1",
  "attributes": [
    { "trait_type": "Collection", "value": "Mfer-0'-Base" },
    { "trait_type": "Chain", "value": "Base (8453)" },
    { "trait_type": "Edition", "value": "1/1000" },
    ...
  ]
}
```

## Como Usar no Contrato

### Passo 1: Deploy do contrato com baseURI correto

No Remix, quando fazer deploy de **MferBk0Base**:

```solidity
constructor(
  address _usdc,
  string memory _baseURI,  // ← Passe aqui!
  ...
)
```

**Parameter:**
```
https://kingallery.netlify.app/api/metadata/
```

⚠️ **Importante**: DEVE terminar com `/` (slash)!

### Passo 2: Verificar se está funcionando

```bash
# Via terminal/curl:
curl https://kingallery.netlify.app/api/metadata/1

# Via BaseScan:
# 1. Vá ao contrato MferBk0Base
# 2. Read Contract → tokenURI(1)
# 3. Deve retornar a URL do metadata endpoint
```

### Passo 3: Verificar no OpenSea

1. Ir em https://opensea.io
2. Procurar por "Mfer-0'-Base #1"
3. OpenSea faz fetch automático do metadata
4. Imagem, atributos tudo deve aparecer

## Tecnicamente O que Acontece

```
User compra NFT (#5)
        ↓
blockchain: tokenId = 5
        ↓
OpenSea/Explorer chama: tokenURI(5)
        ↓
Contrato retorna: https://kingallery.netlify.app/api/metadata/5
        ↓
OpenSea faz GET /api/metadata/5
        ↓
Endpoint gera JSON automaticamente
        ↓
OpenSea renderiza imagem, atributos, descrição
```

## Customizações Futuras

Se quiser customizar metadata por token (ex: imagens diferentes):

**Arquivo:** `app/api/metadata/[tokenId]/route.ts`

```typescript
// Exemplo: mostrar imagem diferente por token
if (tokenId === 1) {
  metadata.image = 'ipfs://special-image-for-1';
}
```

## Environment Variables

Certifique-se que `.env.local` tem:
```
NEXT_PUBLIC_BASE_URL=https://kingallery.netlify.app
```

(Já deve estar configurado)

## Benefícios

✅ Sem upload manual no Pinata  
✅ Metadata sempre atualizado (cache 1 hora)  
✅ Escalável para 1000+ tokens  
✅ Personalizável por token se necessário  
✅ Funciona com OpenSea, Etherscan, etc.

## Troubleshooting

**OpenSea não mostra imagem?**
- Aguarde 15-30min (OpenSea cache)
- Force refresh: em Collections → "Refresh metadata"
- Verifique `/api/metadata/tokenId` manualmente

**Erro 404?**
- Verifique se baseURI no contrato termina com `/`
- Verifique se URL está completa: `https://...`

---

**Status:** ✅ Implementado e pronto pro redeploy
