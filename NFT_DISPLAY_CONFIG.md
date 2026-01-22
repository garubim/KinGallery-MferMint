# 🖼️ CONFIGURAÇÕES DA TELA DO MFER (NFT Display)

**Arquivo**: [app/gallery/page.tsx](app/gallery/page.tsx)  
**Seção**: Hero Section (linhas 107-120) + CSS (linhas 307-337)

---

## 📐 DIMENSÕES PRINCIPAIS DO NFT

### Container do NFT (nft-frame)
**Linhas: 307-321**

```typescript
.nft-frame {
  position: relative;
  width: 100%;              // ← Ocupa 100% do container pai
  max-width: 400px;         // ← TAMANHO MÁXIMO (AJUSTÁVEL!) 🎯
  margin: 0 auto;           // Centralizado
  border-radius: 24px;      // ← Curvatura dos cantos (AJUSTÁVEL)
  overflow: hidden;
  border: 2px solid rgba(0, 230, 255, 0.3);  // ← Cor da borda
}
```

**KEY VALUES**:
- `max-width: 400px` ← **TAMANHO BASE** (pode aumentar/diminuir)
- `width: 100%` ← Responsivo (se tela < 400px, ocupa 100%)
- `border-radius: 24px` ← Arredondamento dos cantos

### Imagem do Mfer (nft-artwork)
**Linhas: 323-327**

```typescript
.nft-artwork {
  width: 100%;   400px      // ← 100% do container (400px ou menos)
  height: auto;             // ← Mantém proporção automática
  display: block;           // ← Remove espaço em branco extra
}
```

**Comportamento**: A imagem escala proporcionalmente com o `.nft-frame`

---

## ✨ EFEITO DE BRILHO (Frame Glow)

**Linhas: 329-337**

```typescript
.frame-glow {
  position: absolute;
  inset: -20px; dial-gradient(     // G                   // ← Extensão do brilho (~20px fora)
  background: raradiente radial (brilho em volta)
    circle, 
    rgba(0, 230, 255, 0.3),       // ← Cor ciano (AJUSTÁVEL)
    transparent
  );
  animation: pulse-glow 3s ease infinite;  // ← Pulsação (3s)
  pointer-events: none;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }      // Mínimo
  50% { opacity: 1; transform: scale(1.05); }          // Máximo (+5%)
}
```

**Valores Ajustáveis**:
- `inset: -20px` ← Distância do brilho (quanto maior = mais longe)
- `rgba(0, 230, 255, 0.3)` ← Cor e intensidade do brilho
- `3s` ← Duração da pulsação
- `scale(1.05)` ← Tamanho máximo do glow (5% maior)

---

## 🎯 QUICK REFERENCE - O Que Mudar

| O Que | Linha | Propriedade | Valor Atual | Para Testar |
|------|-------|-------------|-------------|------------|
| **Tamanho da tela** | 310 | `max-width` | 400px | 350px / 450px / 500px |
| **Arredondamento** | 312 | `border-radius` | 24px | 16px / 32px |
| **Cor da borda** | 314 | `rgba(0, 230, 255, 0.3)` | Ciano | Mudar valores RGB |
| **Brilho extensão** | 332 | `inset: -20px` | -20px | -10px / -30px |
| **Cor do glow** | 335 | `rgba(0, 230, 255, 0.3)` | Ciano | Mudar valores RGB |
| **Intensidade glow** | 335 | valor `0.3` | 0.3 | 0.2 / 0.5 |
| **Pulsação velocidade** | 337 | `3s` | 3 segundos | 2s / 4s |
| **Pulsação escala** | 345 | `scale(1.05)` | +5% | 1.03 / 1.10 |

---

## 🧪 COMO TESTAR AS 3 ALTERNATIVAS

### Alternativa 1: Aumentar Tamanho (mantendo proporção)
```typescript
// Linha 310 - mude de:
max-width: 400px;

// Para um dos valores:
max-width: 450px;  // +50px (maior)
max-width: 350px;  // -50px (menor)
max-width: 500px;  // +100px (bem maior)
```

**Resultado**: Imagem fica proporcionalmente maior ou menor

---

### Alternativa 2: Ajustar Brilho (Glow)
```typescript
// Linha 332 - mude de:
inset: -20px;

// Para:
inset: -10px;  // Brilho mais próximo
inset: -30px;  // Brilho mais distante
inset: -40px;  // Brilho bem distante
```

**Resultado**: Aura ao redor da imagem fica mais próxima ou distante

---

### Alternativa 3: Mudar Cores

#### Opção A: Borda do NFT (linha 314)
```typescript
// De:
border: 2px solid rgba(0, 230, 255, 0.3);

// Para (exemplos):
border: 2px solid rgba(100, 200, 255, 0.3);   // Azul mais claro
border: 2px solid rgba(0, 255, 100, 0.3);     // Verde
border: 2px solid rgba(255, 100, 0, 0.3);     // Laranja
border: 2px solid rgba(200, 0, 255, 0.3);     // Roxo
```

#### Opção B: Cor do Glow (linha 335)
```typescript
// De:
rgba(0, 230, 255, 0.3),  // Ciano

// Para:
rgba(100, 200, 255, 0.3),   // Azul
rgba(0, 255, 100, 0.3),     // Verde
rgba(255, 100, 0, 0.3),     // Laranja
rgba(200, 0, 255, 0.3),     // Roxo
```

---

## 🎨 PALETA DE CORES PARA TESTAR

```
Ciano (Atual):      rgb(0, 230, 255)     #00e6ff
Azul:              rgb(100, 200, 255)    #64c8ff
Verde:             rgb(0, 255, 100)      #00ff64
Laranja:           rgb(255, 100, 0)      #ff6400
Roxo:              rgb(200, 0, 255)      #c800ff
Rosa:              rgb(255, 0, 150)      #ff0096
Amarelo:           rgb(255, 200, 0)      #ffc800
```

---

## 📍 ESTRUTURA HTML (Para Referência)
rgba(255, 100, 0, 0.3),     // Laranja

```typescript
<section className="hero-">
  <div className="hero-Mfer#01">
    <h1>YMark-your-Mark</h1>
    <p className="hero-raklete">Mfer-0-Base #{001} / 1000</p>
  </div>

  <div className="400px">
    <div className="nft-">              {/* ← l */}
      <img 
        src={getIPFSUrl(html://ipfs://Kbafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq)}
        alt="Mfer #10"
        className="nft-MferBk-0-Base"               {/src={getIPFSUrl(https://ipfs://Kbafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq)}
 */}
      />
      <div className="frame-glow"></div>      {/* ← Brilho */}
    </div>
  </div>
</section>
```

---

## 🔧 TESTE PRÁTICO (Dev Tools)

1. Abra página 2 (após mintar)
2. Pressione F12 (DevTools)
3. Clique em "Inspect Element"
4. Selecione o elemento `.nft-frame`
5. Edite valores em "Styles":

```css
/* Teste mudando na aba Styles do DevTools: */

.nft-frame {
  max-width: 450px;      /* Aumenta para 450px */
  border-radius: 32px;   /* Mais arredondado */
}

.frame-glow {
  inset: -30px;          /* Brilho mais distante */
}
```

6. Veja resultado em tempo real!
7. Quando achar bom, copia os valores
8. Atualiza no arquivo `.tsx`

---

## 📊 RESUMO DAS LINHAS A MEXER

| Linha | Propriedade | Atual | Testável |
|-------|-------------|-------|----------|
| 310 | `max-width` | 400px | 350-500px |
| 312 | `border-radius` | 24px | 16-32px |
| 314 | `border: 2px solid rgba(...)` | Ciano | Qualquer cor |
| 332 | `inset` | -20px | -10 a -40px |
| 335 | `rgba(0, 230, 255, 0.3)` | Ciano | Qualquer cor |
| 335 | valor de opacidade | 0.3 | 0.1-0.5 |
| 337 | `animation: pulse-glow 3s` | 3s | 2-5s |
| 345 | `scale(1.05)` | +5% | 1.03-1.10 |

---

## ✅ CHECKLIST DE TESTES

### Teste 1: Tamanho
- [ ] Teste com `max-width: 350px`
- [ ] Teste com `max-width: 450px`  
- [ ] Teste com `max-width: 500px`
- [ ] Qual ficou melhor? _____

### Teste 2: Brilho (Glow)
- [ ] Teste com `inset: -10px` (próximo)
- [ ] Teste com `inset: -30px` (distante)
- [ ] Qual ficou melhor? _30px______

### Teste 3: Cores
- [ ] Teste verde (`rgba(0, 255, 100, 0.3)`)
- [ ] Teste roxo (`rgba(200, 0, 255, 0.3)`)
- [ ] Teste laranja (`rgba(255, 100, 0, 0.3)`)
- [ ] Qual ficou melhor? _______

---

## 💾 COMO SALVAR SUAS MUDANÇAS

1. Edita em DevTools (F12 → Styles)
2. Confirma que ficou bom visualmente
3. Abre arquivo: `app/gallery/page.tsx`
4. Vai para linha 310 (ou a propriedade específica)
5. Copia o valor de DevTools
6. Cola no arquivo `.tsx`
7. Save (Cmd+S ou Ctrl+S)
8. Next.js recompila automaticamente

---

## 🚀 DEPLOY DEPOIS

Depois que achar os valores perfeitos:

```bash
# Commit as mudanças
git add app/gallery/page.tsx
git commit -m "refine: adjust NFT display size/colors/glow"

# Push (Netlify auto-deploys)
git push origin main
```

---

**Arquivo**: [app/gallery/page.tsx](app/gallery/page.tsx) linhas 207-245  
**Componente**: `.nft-frame`, `.nft-artwork`, `.frame-glow`  
**Status**: Pronto para testar! 🎨

