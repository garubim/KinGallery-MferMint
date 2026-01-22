# 🎯 MAPA DE CONFIGURAÇÕES - Magic Button

**Arquivo**: [app/components/MagicMintButton.tsx](app/components/MagicMintButton.tsx)

---

## 📐 **1. DIMENSÕES DA TELA PRINCIPAL**

### Container Principal
**Linhas: 1052-1059**
```typescript
.magic-button-container {
  width: 100%;                    // Ocupa 100% da tela
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 17px;              // ← AJUSTÁVEL
  margin-bottom: 20px;           // ← AJUSTÁVEL
  transition: all 3s cubic-bezier(0.77, 0, 0.175, 1);
}
```

### Glass Shell (Botão Principal)
**Linhas: 1086-1102**
```typescript
.glass-shell {
  position: relative;
  width: 480px;                   // ← LARGURA DO BOTÃO (AJUSTÁVEL)
  height: 190px;                  // ← ALTURA DO BOTÃO (AJUSTÁVEL)
  border-radius: 120px;           // ← CURVATURA AJUSTÁVEL
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(30px);    // ← BLUR DO FUNDO
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* ... restante */
}
```

**Valores Críticos:**
- `width: 480px` - Largura do botão
- `height: 190px` - Altura do botão
- `border-radius: 120px` - Curvatura (quanto maior, mais redondo)
- `backdrop-filter: blur(30px)` - Intensidade do blur de vidro

---

## ✨ **2. REFLEXOS E EFEITOS (Glass Reflex)**

### Camada de Reflexos
**Linhas: 1176-1211**

```typescript
.glass-reflex {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  mix-blend-mode: lighten;        // ← MODO DE MISTURA (AJUSTÁVEL)
  opacity: 0.7;                    // ← OPACIDADE GERAL (0-1)
}

.reflex-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.reflex-1 {
  opacity: 0.6;                    // ← Primeiro reflexo (balão)
}

.reflex-2 {
  opacity: 0.8;                    // ← Segundo reflexo (video shader)
  filter: brightness(0.7);         // ← Luminosidade do reflexo
}
```

**Arquivos de Imagem Utilizados:**
- `reflex-1`: `/ballon-reflexes-cutout.webp`
- `reflex-2`: `/MagicButton-OfficialAnimatedTitles/Magic-button-Shaderemovement,-veryhighQT-ProRes4444+Alpha-HQ.webm`
- `reflex-3`: `/reflexo-rightside-cutout.webp`

### Efeito de Brilho ao Passar Mouse
**Linhas: 1103-1109**
```typescript
.glass-shell:hover {
  transform: scale(1.02);          // ← Ampliação ao hover (AJUSTÁVEL)
  box-shadow: 
    0 12px 48px rgba(0, 230, 255, 0.2),  // ← Glow (cor ciano)
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
```

### Efeito de Sucesso (Green Glow)
**Linhas: 1118-1127**
```typescript
.glass-shell.success-ready::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40%;                      // ← Largura do glow verde (AJUSTÁVEL)
  background: linear-gradient(90deg, rgba(0, 200, 100, 0) 0%, rgba(0, 255, 150, 0.5) 100%);
                                   // ← Cor do gradiente verde
  border-radius: 0 24px 24px 0;
  opacity: 1;
  animation: greenGlowPulse 2s ease-in-out infinite;
  z-index: 4;
  pointer-events: none;
}

@keyframes greenGlowPulse {
  0%, 100% {
    opacity: 0.3;
    filter: blur(2px);
  }
  50% {
    opacity: 0.6;
    filter: blur(4px);             // ← Intensidade do blur da pulsação
  }
}
```

---

## 🎬 **3. ANIMAÇÕES E TRANSIÇÕES**

### Animação ao Conectar
**Linhas: 1062-1066**
```typescript
.magic-button-container.slide-out {
  animation: slideOutLeft 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
  pointer-events: none;
}
```

### Transição Geral
**Linhas: 1057-1058**
```typescript
transition: all 3s cubic-bezier(0.77, 0, 0.175, 1);
// ↑ Tempo de transição (3 segundos)
```

---

## 🔍 **4. SOMBRAS E BRILHOS (Box Shadow)**

### Sombra Principal do Botão
**Linhas: 1095-1099**
```typescript
box-shadow: 
  0 8px 32px rgba(0, 0, 0, 0.4),           // Sombra para baixo
  inset 0 1px 0 rgba(255, 255, 255, 0.1),  // Brilho interno superior
  inset 0 -1px 0 rgba(0, 0, 0, 0.2);       // Sombra interna inferior
```

### Sombra ao Hover
**Linhas: 1106-1109**
```typescript
box-shadow: 
  0 12px 48px rgba(0, 230, 255, 0.2),      // ← Glow ciano forte
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
```

### Sombra ao Clique
**Linhas: 1111-1116**
```typescript
box-shadow: 
  0 4px 16px rgba(0, 230, 255, 0.15),
  inset 0 2px 4px rgba(0, 0, 0, 0.3);
```

---

## 📋 **AJUSTES FÁCEIS - Quick Reference**

| O Que | Linha | Propriedade | Valor Atual | Para Aumentar |
|------|-------|-------------|-------------|--------------|
| **Tamanho Botão** | 1088-1089 | `width` / `height` | 480px / 190px | Aumentar números |
| **Redondeza** | 1090 | `border-radius` | 120px | 150px+ |
| **Opacidade Reflexos** | 1183 | `.glass-reflex opacity` | 0.7 | 0.9 |
| **Brilho Verde** | 1131-1133 | `greenGlowPulse blur` | 2px-4px | Aumentar blur |
| **Cor Verde** | 1124 | `rgba(0, 255, 150, 0.5)` | Ciano-verde | RGB custom |
| **Glow ao Hover** | 1107 | `box-shadow rgba(...0.2)` | 0.2 | 0.3-0.5 |
| **Escala Hover** | 1105 | `scale(1.02)` | +2% | 1.05 = +5% |
| **Posição Botão** | 1054-1055 | `margin-top` / `bottom` | 17px / 20px | Ajustar números |

---

## 🎨 **Cores Principais**

```
Ciano (Primary Glow):       rgba(0, 230, 255, 0.X)   #00e6ff
Verde (Success Glow):       rgba(0, 255, 150, 0.X)   #00ff96
Branco (Highlights):        rgba(255, 255, 255, 0.X) 
Preto (Shadows):            rgba(0, 0, 0, 0.X)
```

---

## 🧪 **Para Testar Ajustes:**

1. Abra DevTools (F12) no browser
2. Clique em "Inspect" no Magic Button
3. Mude valores CSS em tempo real
4. Copie os valores que gostou
5. Atualize no arquivo `.tsx`

**Exemplo de Teste:**
```css
/* No DevTools, mude: */
.glass-shell {
  width: 550px;        /* Era 480px */
  height: 220px;       /* Era 190px */
  border-radius: 150px; /* Era 120px */
}
```

---

## ✅ **Quando Mudar:**

- **width/height**: Quando quer botão maior/menor
- **border-radius**: Quando quer mais/menos arredondado
- **opacity dos reflexos**: Quando quer mais/menos brilho
- **box-shadow colors**: Quando quer mudar cor do glow
- **blur valores**: Quando quer efeito mais/menos intenso
- **margin-top/bottom**: Quando quer mover verticalmente

---

**Arquivo Completo**: [app/components/MagicMintButton.tsx](app/components/MagicMintButton.tsx)  
**Total de Linhas CSS**: ~600 linhas  
**Último Update**: 22 Janeiro 2026

---

## 🧪 **SEÇÃO DE TESTES - Retouches em Tempo Real**

**Use esta seção para testar mudanças no Magic Button e documentar o que funcionou!**

### Teste #1: Ajustar Tamanho do Botão
**Data**: ___ | **Status**: ☐ Testado | ☐ Funciona | ☐ Aprovado

**O que quer fazer**: Aumentar tamanho do botão
**Valores atuais**: width: 480px, height: 190px
**Novos valores**: width: ___, height: ___

**Código para testar** (copiar pra DevTools):
```css
.glass-shell {
  width: 550px !important;      /* ← MUDE AQUI */
  height: 220px !important;     /* ← MUDE AQUI */
  border-radius: 150px !important;
}
```

**Resultado**: 
- ☐ Ficou bom
- ☐ Muito grande
- ☐ Muito pequeno

**Notas**: _______________

---

### Teste #2: Intensidade dos Reflexos
**Data**: ___ | **Status**: ☐ Testado | ☐ Funciona | ☐ Aprovado

**O que quer fazer**: Aumentar/diminuir opacidade dos reflexos
**Valor atual**: opacity: 0.7
**Novo valor**: opacity: ___

**Código para testar**:
```css
.glass-reflex {
  opacity: 0.85 !important;     /* ← MUDE AQUI (0-1) */
}

.reflex-1 {
  opacity: 0.75 !important;
}

.reflex-2 {
  opacity: 0.9 !important;
  filter: brightness(0.8) !important;  /* ← Também mude aqui se quiser */
}
```

**Resultado**: 
- ☐ Muito brilhante
- ☐ Perfeito
- ☐ Muito escuro

**Notas**: _______________

---

### Teste #3: Glow do Hover
**Data**: ___ | **Status**: ☐ Testado | ☐ Funciona | ☐ Aprovado

**O que quer fazer**: Intensificar glow ciano ao passar mouse
**Valor atual**: 0.2
**Novo valor**: ___

**Código para testar**:
```css
.glass-shell:hover {
  box-shadow: 
    0 12px 48px rgba(0, 230, 255, 0.3) !important,  /* ← MUDE 0.3 */
    inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
}
```

**Resultado**: 
- ☐ Glow forte demais
- ☐ Perfeito
- ☐ Glow fraco demais

**Notas**: _______________

---

### Teste #4: Verde Glow Pulsação
**Data**: ___ | **Status**: ☐ Testado | ☐ Funciona | ☐ Aprovado

**O que quer fazer**: Ajustar intensidade do green glow quando sucesso
**Valores atuais**: blur 2px → 4px, opacity 0.3 → 0.6
**Novos valores**: blur ___, opacity ___

**Código para testar**:
```css
@keyframes greenGlowPulse {
  0%, 100% {
    opacity: 0.4 !important;           /* ← MUDE AQUI */
    filter: blur(3px) !important;      /* ← MUDE AQUI */
  }
  50% {
    opacity: 0.8 !important;           /* ← MUDE AQUI */
    filter: blur(6px) !important;      /* ← MUDE AQUI */
  }
}
```

**Resultado**: 
- ☐ Pulsação muito lenta
- ☐ Perfeita
- ☐ Pulsação muito rápida

**Notas**: _______________

---

### Teste #5: Cor do Verde Glow
**Data**: ___ | **Status**: ☐ Testado | ☐ Funciona | ☐ Aprovado

**O que quer fazer**: Mudar cor do glow verde (mais lime, mais emerald, etc)
**Valor atual**: rgba(0, 255, 150, 0.5)
**Novo valor**: rgba(___, ___, ___, 0.5)

**Código para testar**:
```css
.glass-shell.success-ready::after {
  background: linear-gradient(
    90deg, 
    rgba(0, 200, 100, 0) 0%, 
    rgba(50, 255, 120, 0.6) 100%  /* ← MUDE AQUI (R,G,B) */
  ) !important;
}
```

**Referência de Cores**:
- Verde Lime: `rgba(200, 255, 0, 0.5)`
- Verde Esmeralda: `rgba(0, 255, 127, 0.5)`
- Verde Água: `rgba(0, 200, 150, 0.5)`
- Ciano-Verde: `rgba(0, 255, 200, 0.5)`

**Resultado**: 
- ☐ Muito escuro
- ☐ Perfeito
- ☐ Muito claro

**Notas**: _______________

---

### Teste #6: Escala do Hover (Zoom ao passar mouse)
**Data**: ___ | **Status**: ☐ Testado | ☐ Funciona | ☐ Aprovado

**O que quer fazer**: Aumentar/diminuir zoom ao passar mouse
**Valor atual**: scale(1.02)
**Novo valor**: scale(___)

**Código para testar**:
```css
.glass-shell:hover {
  transform: scale(1.05) !important;  /* ← MUDE AQUI (1.02-1.10) */
  box-shadow: 
    0 12px 48px rgba(0, 230, 255, 0.2) !important,
    inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
}
```

**Resultado**: 
- ☐ Zoom demais (estranho)
- ☐ Perfeito
- ☐ Zoom pouco (não nota)

**Notas**: _______________

---

### Teste #7: Redondeza do Botão
**Data**: ___ | **Status**: ☐ Testado | ☐ Funciona | ☐ Aprovado

**O que quer fazer**: Mais/menos redondo
**Valor atual**: border-radius: 120px
**Novo valor**: border-radius: ___

**Código para testar**:
```css
.glass-shell {
  border-radius: 140px !important;  /* ← MUDE AQUI */
  /* ... resto do CSS ... */
}
```

**Valores sugeridos**:
- Pílula: 100px
- Redondo: 120px (ATUAL)
- Muito redondo: 150px
- Círculo quase: 200px

**Resultado**: 
- ☐ Muito quadrado
- ☐ Perfeito
- ☐ Muito redondo

**Notas**: _______________

---

## 📊 **RESUMO DE TESTES COMPLETADOS**

| Teste | Data | Valor Testado | Resultado | Aprovado? |
|-------|------|---------------|-----------|-----------|
| Tamanho | ___ | 480x190 → ??? | --- | ☐ |
| Reflexos | ___ | opacity: ??? | --- | ☐ |
| Glow Hover | ___ | 0.2 → ??? | --- | ☐ |
| Verde Pulsação | ___ | blur ??? | --- | ☐ |
| Cor Verde | ___ | rgb(???) | --- | ☐ |
| Scale Hover | ___ | 1.02 → ??? | --- | ☐ |
| Redondeza | ___ | 120px → ??? | --- | ☐ |

---

## 💡 **COMO USAR ESTA SEÇÃO**

1. **Escolha um teste acima**
2. **Copie o código CSS**
3. **Abra DevTools (F12) no navegador**
4. **Clique em "Inspect" > "Elements"**
5. **Cole o código no `<style>`**
6. **Veja o resultado em tempo real**
7. **Se gostou, anote o valor aqui**
8. **Depois eu atualizo o arquivo `.tsx`**

---

**Última Seção de Teste**: 22 Janeiro 2026

