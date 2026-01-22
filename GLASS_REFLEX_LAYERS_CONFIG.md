# 🪞 Glass Reflex Layers - Positioning & Configuration

**Arquivo**: [app/components/MagicMintButton.tsx](app/components/MagicMintButton.tsx)

---

## 📍 Estrutura HTML (Linhas 690-706)

```typescript
<div className="glass-reflex">
  <img src="/ballon-reflexes-cutout.webp" alt="" className="reflex-layer reflex-1" />
  <video 
    src="/MagicButton-OfficialAnimatedTitles/Magic-button-Shaderemovement,-veryhighQT-ProRes4444+Alpha-HQ.webm" 
    className="reflex-layer reflex-2"
    autoPlay
    loop
    muted
    playsInline
  />
  <img src="/reflexo-rightside-cutout.webp" alt="" className="reflex-layer reflex-3" />
</div>
```

### Camadas (Layers):
1. **reflex-1**: `ballon-reflexes-cutout.webp` (WebP still) - esquerda/topo
2. **reflex-2**: `Magic-button-Shader...webm` (WebM VP9 movimento) - centro/movimento
3. **reflex-3**: `reflexo-rightside-cutout.webp` (WebP still) - **APENAS DIREITA** ⚠️

---

## 🎨 Estilos CSS (Linhas 1100-1135)

### Container Principal
**Linhas 1107-1114**
```typescript
.glass-reflex {
  position: absolute;
  inset: 0;                    // ← Ocupa 100% do container (full overlay)
  pointer-events: none;
  z-index: 5;                  // ← Fica acima do botão
  mix-blend-mode: lighten;     // ← Modo de mistura (lighten = só brilho)
  opacity: 0.7;                // ← Opacidade geral (AJUSTÁVEL)
}
```

### Base das Camadas
**Linhas 1116-1123**
```typescript
.reflex-layer {
  position: absolute;
  width: 100%;                 // ← PROBLEMA: 100% de width
  height: 100%;                // ← PROBLEMA: 100% de height
  object-fit: cover;           // ← Cobre tudo
  pointer-events: none;
}
```

⚠️ **PROBLEMA IDENTIFICADO**: Cada `.reflex-layer` ocupa **100% de width + 100% de height**, então:
- **reflex-1** aparece cobrindo tudo (opacidade 0.6)
- **reflex-2** aparece cobrindo tudo (opacidade 0.8 + brightness 0.7)
- **reflex-3** aparece cobrindo tudo (mas é só do lado direito na imagem!)

**Resultado**: Os reflexos aparecem como uma máscara meio-transparente em toda a tela, não como reflexos visuais distintos.

---

## 🔧 SOLUÇÃO: Posicionar Cada Reflexo Separadamente

Para que cada reflexo apareça no lugar correto:

### Opção A: Usar `background-position` em vez de camadas sobrepostas

```typescript
.glass-reflex {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  mix-blend-mode: lighten;
  opacity: 0.7;
  
  // Adicionar background com as imagens posicionadas
  background-image: 
    url('/ballon-reflexes-cutout.webp'),
    url('/reflexo-rightside-cutout.webp');
  background-position: 
    left top,
    right top;
  background-repeat: no-repeat;
  background-size: 
    40% auto,     // reflex-1 (esquerda) - 40% da largura
    50% auto;     // reflex-3 (direita) - 50% da largura
}

/* WebM fica como elemento separado */
.reflex-layer.reflex-2 {
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;   // ← WebM só ocupa metade direita
  height: 100%;
  object-fit: contain;
  opacity: 0.8;
  filter: brightness(0.7);
}
```

### Opção B: Posicionar Cada Camada Individualmente (Mais Controle)

```typescript
.reflex-layer {
  position: absolute;
  pointer-events: none;
  object-fit: contain;  // ← Não cobre, apenas contém
}

.reflex-1 {
  left: 0;              // ← Lado esquerdo
  top: 0;
  width: 40%;           // ← 40% da largura
  height: 100%;
  opacity: 0.6;
}

.reflex-2 {
  right: 0;             // ← Lado direito
  top: 0;
  width: 50%;           // ← 50% da largura
  height: 100%;
  opacity: 0.8;
  filter: brightness(0.7);
}

.reflex-3 {
  right: 0;             // ← Lado direito (mesmo que reflex-2)
  top: 0;
  width: 50%;           // ← 50% da largura
  height: 100%;
  opacity: 0.5;
}
```

---

## 📊 Estado Atual vs Esperado

### ❌ Atual (Problema)
```
┌─────────────────────────────────┐
│  reflex-1 (100% width)          │
│  ➜ Aparece como máscara         │
│  ➜ Cobre tudo (opac 0.6)        │
│                                 │
│  reflex-2 (100% width WebM)     │
│  ➜ Aparece como máscara         │
│  ➜ Cobre tudo (opac 0.8)        │
│                                 │
│  reflex-3 (100% width)          │
│  ➜ Imagem só tem lado direito   │
│  ➜ Mas aparece em todos lugar   │
└─────────────────────────────────┘
```

### ✅ Esperado (Com Posicionamento)
```
┌─────────────────────────────────┐
│ reflex-1       │                │
│ (esquerda)     │  reflex-2+3    │
│ WebP balloon   │  (direita)     │
│                │  WebM + WebP   │
│                │                │
└─────────────────────────────────┘
```

---

## 🎯 Recomendação: Qual Estrutura Usar?

**Opção B é melhor porque**:
- ✅ Controle fino de cada reflexo
- ✅ Fácil ajustar tamanhos (40%, 50%, etc)
- ✅ Fácil mudar posições (left, right, top, bottom)
- ✅ Fácil substituir um WebP por WebM
- ✅ Opacidades independentes

---

## 🔄 Como Substituir reflex-1 por WebM

Se quiser usar WebM em movimento em vez de WebP estático:

### Passo 1: Atualizar HTML
```typescript
<div className="glass-reflex">
  {/* reflex-1: substituir por WebM */}
  <video 
    src="/seu-webm-esquerda.webm" 
    className="reflex-layer reflex-1"
    autoPlay
    loop
    muted
    playsInline
  />
  
  {/* reflex-2: WebM atual (direita) */}
  <video 
    src="/MagicButton-Shaderemovement...webm" 
    className="reflex-layer reflex-2"
    autoPlay
    loop
    muted
    playsInline
  />
  
  {/* reflex-3: WebP direita (manter) */}
  <img src="/reflexo-rightside-cutout.webp" className="reflex-layer reflex-3" />
</div>
```

### Passo 2: Adicionar CSS (Opção B)
```typescript
.reflex-1 {
  left: 0;
  top: 0;
  width: 40%;
  height: 100%;
  opacity: 0.6;
}

.reflex-2 {
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  opacity: 0.8;
  filter: brightness(0.7);
}

.reflex-3 {
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  opacity: 0.5;
}
```

---

## 📐 Tamanhos Sugeridos

| Camada | Posição | Largura | Altura | Opacidade | Tipo |
|--------|---------|---------|--------|-----------|------|
| reflex-1 | Esquerda | 40% | 100% | 0.6 | WebM novo |
| reflex-2 | Direita | 50% | 100% | 0.8 | WebM (atual) |
| reflex-3 | Direita | 50% | 100% | 0.5 | WebP (estático) |

---

## 🧪 TESTE NO DEVTOOLS

1. Abra F12 (DevTools)
2. Inspecione o `.glass-reflex`
3. Mude os estilos em tempo real:

```css
.reflex-layer {
  width: 40%;        /* De 100% para 40% */
  height: 100%;
}

.reflex-1 {
  left: 0;           /* Adicione posição */
  top: 0;
  opacity: 0.6;
}

.reflex-2 {
  right: 0;          /* Adicione posição */
  top: 0;
  opacity: 0.8;
}

.reflex-3 {
  right: 0;          /* Adicione posição */
  top: 0;
  opacity: 0.5;
}
```

4. Verifique visualmente se ficou melhor
5. Copia os valores quando satisfeito
6. Atualiza no arquivo `.tsx`

---

## 📝 Linhas a Mexer

| Linha | Componente | O Que Mudar |
|-------|-----------|------------|
| 1107-1114 | `.glass-reflex` | Aumentar opacidade geral se quiser mais brilho |
| 1116-1123 | `.reflex-layer` | Adicionar `left`, `right`, `width`, `height` específicos |
| 1124-1126 | `.reflex-1` | Adicionar `left: 0; top: 0; width: 40%;` |
| 1128-1130 | `.reflex-2` | Adicionar `right: 0; top: 0; width: 50%;` |
| Nova | `.reflex-3` | Adicionar `right: 0; top: 0; width: 50%;` |

---

## ✨ Resultado Final

Depois de aplicar Opção B:

```
Magic Button (480x190px)
├─ Fundo Glass
├─ Reflexo Layer
│  ├─ reflex-1 (40% esquerda) = WebM em movimento
│  ├─ reflex-2 (50% direita) = WebM shader atual
│  └─ reflex-3 (50% direita) = WebP estático
└─ Botão invisível (funcional)
```

Cada reflexo aparecerá **no seu lugar correto**, não cobrindo tudo! 🎯

---

**Linhas Chave**:
- HTML: 690-706 (3 reflexos)
- CSS: 1107-1130 (estilos principais)
- Posicionamento: Opção B recomendada

**Status**: Pronto para testar e iterar! 🚀
