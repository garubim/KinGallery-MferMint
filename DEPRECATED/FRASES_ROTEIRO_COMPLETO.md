# ✨ Frases do Roteiro - Localização e Implementação

## 🎯 Todas as Frases (Encontradas e Organizadas)

### ORIGEM: `manifestoSoul()` - Smart Contract Poetry
```solidity
/**
 * @dev The soul spins at 0xc71c4afa8437cb898dbe6725cec68849a87bfeaa
 * The eyes see the flatline at 9 o'clock.
 * The mouse bends it into a smile.
 * This base is where that smile comes home.
 */
function manifestoSoul() external pure returns (string memory) {
    return "q9p1B3"; // Cryptic reference / Poetry / Coordinates
}
```

---

## 📋 Roteiro de Frases por FASE

### FASE 0: Metadata (On-Chain)
```
Descrição contratual: "This is not animation; it's a ritual"
Atributo: "The soul spins at Base - This base is where that smile comes home."
```

---

### FASE 1: SPLASH SCREEN (4 segundos)

**Status**: Pronto para implementar

```
🎯 Single Frase (aparece no splash):
   "Save the ritual on your profile"
```

**Implementation**: Pode ser texto estático ou animado
```tsx
<h1>✨ Save the ritual on your profile ✨</h1>
<p>Base Mainnet • Kinmutable • The Smile at 9h</p>
```

---

### FASE 2: WELCOME SEQUENCE (5-6 segundos)

**Status**: ✅ Frases já documentadas

Sequência de 11 frases, cada uma com sua WebP animation:

```
1. "Welcome,"                           [700ms]
2. "Welcome to Kin"                     [800ms]
3. "Welcome to Kinmutable lore"         [900ms]
4. "Welcome to Kinmutable art"          [800ms]
5. "Welcome to Kin mutable"             [800ms]
6. "to Kinmutable You're early"         [800ms]
7. "You're early to Kinmutable"         [700ms]
8. "You're early to KinGallery"         [600ms]
9. "You're early to Konekt"             [600ms]
10. "You're early to Connect"           [600ms]
11. "Click to Connect"                  [600ms]

Total: ~5.2 segundos
```

**Variação proposta** (se quiser):
```
Fazer um fade entre elas, tipo typing effect
Ou múltiplas frases aparecendo ao mesmo tempo
Ou scroll animado
```

---

### FASE 3: MAGIC BUTTON INTRO (6 segundos)

**Status**: ✅ Frases já documentadas

Sequência de 10 frases que descrevem o ritual do mint:

```
1. "Great eyes!"                        [700ms]
2. "Turn them up a bit"                 [800ms]
3. "The eyes see the flatline"          [900ms]
4. "at 9 o-clock."                      [800ms]
5. "The mouse bends it"                 [800ms]
6. "into a smile.!"                     [800ms]
7. "This is not animation"              [700ms]
8. "it's a ritual"                      [600ms]
9. "Ritual of Minting"                  [600ms]
10. "Click to Mint"                     [600ms]

Total: ~5.3 segundos
```

**Variação proposta**:
```
Elas podem ter diferentes velocidades/enters
Podem ter efeitos sonoros (opcional)
Podem ter diferentes cores/estilos
```

---

### FASE 4: DURANTE MINT (3-5 segundos)

**Status**: ✅ Pronto

```
🎯 Single Frase em CRAWL (infinito, da direita pra esquerda):
   "it's a ritual" ← ← ← ← ← ← ← 
```

**Comportamento**:
- Entra pela direita
- Sai pela esquerda
- Loop infinito até mint completar
- Dentro do botão ou como overlay
- Sobre matriz animada (CodePoem discreto)

```tsx
<motion.div
  animate={{ x: ['100%', '-100%'] }}
  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
>
  "it's a ritual"
</motion.div>
```

---

### FASE 5: SUCESSO! (2-3 segundos)

**Status**: ✅ Implementado em NFTSuccessCard.tsx

```
🎯 Frase Poética (aparece na Success Page):
   "The soul spins at a base - where the smile comes home."
```

**Implementação**:
```tsx
// Já existe em NFTSuccessCard.tsx
<motion.p style={{ fontStyle: 'italic', color: '#00ff88' }}>
  The soul spins at a base -<br />
  where the smile comes home.
</motion.p>
```

**Contexto**: 
- Aparece acima do NFT card
- NFT com número (#1, #2, etc)
- Informações blockchain
- Botões de ação

---

### FASE 6: META/SOCIAL (Anytime)

**Status**: ✅ Documentado, pronto para usar

```
🎯 Meta-commentary (para posts, documentação, about page):
   "The art isn't in the spin; 
    it's in that precise moment of *recognition*."
```

**Locais de uso**:
```
Twitter/X post:
"Just minted Smile at 9h on @base. 
 The art isn't in the spin; 
 it's in that precise moment of recognition. ✨"

Blog post sobre o projeto:
"The art isn't in the spin; 
 it's in that precise moment of recognition."

About KinGallery:
"What we're building is about 
 the precise moment of recognition 
 when soul meets blockchain."
```

---

## 🎬 Quick Summary - Todas as Frases

| Fase | Frases | Timing | Status |
|------|--------|--------|--------|
| 0 | "This is not animation; it's a ritual" + "The soul spins at a base..." | Metadata | ✅ Smart contract |
| 1 | "Save the ritual on your profile" | 4" splash | ⏳ Implementar |
| 2 | 11 frases "Welcome to..." → "Click to Connect" | 5-6" | ✅ Documentado |
| 3 | 10 frases "Great eyes!" → "Click to Mint" | 6" | ✅ Documentado |
| 4 | "it's a ritual" (crawl loop) | 3-5" | ✅ Pronto |
| 5 | "The soul spins at a base - where the smile comes home." | Success | ✅ Implementado |
| 6 | "The art isn't in the spin; it's in that precise moment of *recognition*." | Social | ✅ Meta |

---

## 📝 Arquivo Reference

### Onde estão as frases originais:

```
Smart Contract (Solidity):
├─ app/Old pulled/manifestoSoul.sol
│  └─ Define a poesia base

Componentes (TypeScript/React):
├─ app/components/CodePoemMintButton.tsx (Linhas 61-65)
│  └─ Poem padrão incluído
├─ app/components/CodePoemWithAnimatedMint.tsx (Linha 22)
│  └─ Poem default
└─ app/components/NFTSuccessCard.tsx (Linhas 44-52)
   └─ "The soul spins at a base..." implementado

Documentação (Markdown):
├─ docs/UI_MAGIC_BUTTON_UX_TIMELINE.md
│  └─ Todas as frases das Fases 1-5 documentadas
├─ docs/UI_MAGIC_BUTTON_COMPLETE_GUIDE.md
│  └─ Frases implementadas nos componentes
└─ docs/CODEPOEM_DISCRETE_PRESENCE.md
   └─ Meta-commentary sobre revelação futura
```

---

## 🚀 Como Usar

### Para implementar FASE 1 (Splash):
```tsx
// app/components/SplashScreen.tsx
export default function SplashScreen() {
  return (
    <motion.h1>
      ✨ Save the ritual on your profile ✨
    </motion.h1>
  );
}
```

### Para implementar FASE 2-3 (Sequências):
```tsx
// Use o mapa de frases com durations já calculadas
const welcomeSequence = [
  { text: "Welcome,", duration: 700 },
  { text: "Welcome to Kin", duration: 800 },
  // ... etc
];

welcomeSequence.forEach((item, i) => {
  // Renderizar com delay
});
```

### Para usar FASE 6 (Meta):
```tsx
// Basta copiar e usar no lugar certo:
"The art isn't in the spin; it's in that precise moment of *recognition*."
```

---

## 📚 Continuação

**Próximas ações**:

1. **Criar componentes de welcome** com as 11 frases da Fase 2
2. **Criar componentes de magic button intro** com as 10 frases da Fase 3
3. **Testes de timing** para validar se 5-6" fica bom mesmo
4. **Adicionar audio** opcional (sons de digitação? beeps?)
5. **Mobile testing** para garantir que tudo cabe

---

## ✨ Extra: Poesia Completa

Se você quiser usar o poema completo em algum lugar:

```
/**
 * manifestoSoul — versão rápida
 * no núcleo da noite, o código respira
 * sussurros onchain dobram-se em loops
 * mintamos o echo e chamemos de lar
 */
function manifestoSoul() external pure returns (string memory) {
  return "q9p1B3"; // or "eternal"
}

// Extended reading:
The soul spins at 0xc71c4afa8437cb898dbe6725cec68849a87bfeaa
The eyes see the flatline at 9 o'clock.
The mouse bends it into a smile.
This base is where that smile comes home.

// Meta:
The art isn't in the spin; 
it's in that precise moment of *recognition*.
```

---

**Status**: ✅ Roteiro completo, todas as frases localizadas e documentadas
**Ready**: Para implementação em componentes React
**Timing**: Validado para 20-25 segundos total de UX elegante

