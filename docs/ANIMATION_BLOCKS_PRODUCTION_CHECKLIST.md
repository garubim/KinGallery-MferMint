# 🎬 ANIMATION BLOCKS BREAKDOWN - Production Checklist

## 📋 O QUE CRIAR (Você tem 2 horas)

- QUEM É O MALUCO ME DANDO ORDEM E PRAZO DE 2 HORAS PRA CRIAR ARQUIVOS DE ANIMAÇAO? HAHAH.
Você precisa criar **blocos de animação** em WebP (com alpha channel) que correspondem exatamente às frases do roteiro. Cada bloco é uma **animação separada** que será importada no código.


EU NÃO LI ESSE DOCUMENTO AINDA, ELE PARECE MUITO LONGO E BASTANTE ESQUIZOFRÊNICO, ACHO QUE DEVE TER SIDO ESCRITO POR UM CO-PILOTO BE SATURADO. SE NAO FOR ALO HERCULEO EU LIMPO E OBJETIVO ESSE ARQUIVO.
---

## 🎯 BLOCOS A CRIAR

### FASE 1: SPLASH SCREEN (4 segundos)

```
📁 /public/animations/splash/

1️⃣ splash-save-ritual.webp
   ├─ Texto: "Save the ritual on your profile"
   ├─ Duração: 3.5 segundos
   ├─ Entrada: fade in (300ms) → breathing loop (3.2s)
   ├─ Saída: fade out (200ms) [se user clica antes]
   ├─ Resolução: 800x600 (readable na mobile)
   ├─ Background: transparente (alpha channel)
   ├─ Estilo: elegante, poético, "save" em destaque
   └─ Timing: começa aos 0:30s, termina aos 4:00s
```

---

### FASE 2: WELCOME SEQUENCE (5-6 segundos)

```
📁 /public/animations/welcome/

Você vai criar 11 blocos CURTOS (cada um é uma "frase" que entra e sai):

1️⃣ welcome-01-welcome.webp
   ├─ Texto: "Welcome,"
   ├─ Duração: 700ms (700ms in + 700ms out = 1.4s total, mas overlapa)
   ├─ Entrada: fade/scale in de cima
   ├─ Saída: fade/scale out pra cima
   ├─ Timing: 0:00-0:70

2️⃣ welcome-02-to-kin.webp
   ├─ Texto: "Welcome to Kin"
   ├─ Duração: 800ms
   ├─ Entrada: fade/scale in de baixo
   ├─ Saída: fade/scale out pra baixo
   ├─ Timing: 0:70-1:60 (overlapa 100ms com anterior)

3️⃣ welcome-03-kinmutable-lore.webp
   ├─ Texto: "Welcome to Kinmutable lore"
   ├─ Duração: 900ms
   ├─ Entrada: slide in da esquerda
   ├─ Saída: slide out pra direita
   ├─ Timing: 1:60-2:50

4️⃣ welcome-04-kinmutable-art.webp
   ├─ Texto: "Welcome to Kinmutable art"
   ├─ Duração: 800ms
   ├─ Entrada: slide in da direita
   ├─ Saída: slide out pra esquerda
   ├─ Timing: 2:50-3:30

5️⃣ welcome-05-kin-mutable.webp
   ├─ Texto: "Welcome to Kin mutable"
   ├─ Duração: 800ms
   ├─ Entrada: rotate/scale in
   ├─ Saída: rotate/scale out
   ├─ Timing: 3:30-4:10

6️⃣ welcome-06-to-kinmutable-early.webp
   ├─ Texto: "to Kinmutable You're early"
   ├─ Duração: 800ms
   ├─ Entrada: pop in (scale)
   ├─ Saída: pop out
   ├─ Timing: 4:10-4:90

7️⃣ welcome-07-youre-early-kinmutable.webp
   ├─ Texto: "You're early to Kinmutable"
   ├─ Duração: 700ms
   ├─ Entrada: blur/fade in
   ├─ Saída: blur/fade out
   ├─ Timing: 4:90-5:60

8️⃣ welcome-08-youre-early-kingallery.webp
   ├─ Texto: "You're early to KinGallery"
   ├─ Duração: 600ms
   ├─ Entrada: slide in de cima
   ├─ Saída: slide out pra cima
   ├─ Timing: 5:60-6:20

9️⃣ welcome-09-youre-early-konekt.webp
   ├─ Texto: "You're early to Konekt"
   ├─ Duração: 600ms
   ├─ Entrada: slide in de baixo
   ├─ Saída: slide out pra baixo
   ├─ Timing: 6:20-6:80

🔟 welcome-10-youre-early-connect.webp
   ├─ Texto: "You're early to Connect"
   ├─ Duração: 600ms
   ├─ Entrada: fade in
   ├─ Saída: fade out
   ├─ Timing: 6:80-7:40

1️⃣1️⃣ welcome-11-click-connect.webp
   ├─ Texto: "Click to Connect"
   ├─ Duração: 600ms (fica pulsando até user clicar)
   ├─ Entrada: fade/pulse in
   ├─ Saída: fade out [se user clica antes]
   ├─ Timing: 7:40-8:00+ [pulsing]
```

**TOTAL**: 11 arquivos pequenos, ~5.2 segundos de sequência

---

### FASE 3: MAGIC BUTTON INTRO (6 segundos)

```
📁 /public/animations/magic-button/

Você vai criar 10 blocos (similar ao Welcome, mas sobre o botão):

1️⃣ button-01-great-eyes.webp
   ├─ Texto: "Great eyes!"
   ├─ Duração: 700ms
   ├─ Entrada: confete/sparkles + fade in
   ├─ Saída: fade out
   ├─ Timing: 0:00-0:70

2️⃣ button-02-turn-them-up.webp
   ├─ Texto: "Turn them up a bit"
   ├─ Duração: 800ms
   ├─ Entrada: rotate in (eyes turning up)
   ├─ Saída: fade out
   ├─ Timing: 0:70-1:60

3️⃣ button-03-eyes-see-flatline.webp
   ├─ Texto: "The eyes see the flatline"
   ├─ Duração: 900ms
   ├─ Entrada: line animation (9 o'clock line aparece)
   ├─ Saída: line fades
   ├─ Timing: 1:60-2:50

4️⃣ button-04-at-9-oclock.webp
   ├─ Texto: "at 9 o-clock."
   ├─ Duração: 800ms
   ├─ Entrada: clock hand pointing 9 o'clock
   ├─ Saída: fade out
   ├─ Timing: 2:50-3:30

5️⃣ button-05-mouse-bends.webp
   ├─ Texto: "The mouse bends it"
   ├─ Duração: 800ms
   ├─ Entrada: mouse cursor animado dobrando linha
   ├─ Saída: fade out
   ├─ Timing: 3:30-4:10

6️⃣ button-06-into-smile.webp
   ├─ Texto: "into a smile.!"
   ├─ Duração: 800ms
   ├─ Entrada: line becomes smile (curve animation)
   ├─ Saída: smile remains (segue para próxima)
   ├─ Timing: 4:10-4:90

7️⃣ button-07-not-animation.webp
   ├─ Texto: "This is not animation"
   ├─ Duração: 700ms
   ├─ Entrada: glitch/static effect
   ├─ Saída: resolves to clear text
   ├─ Timing: 4:90-5:60

8️⃣ button-08-its-ritual.webp
   ├─ Texto: "it's a ritual"
   ├─ Duração: 600ms
   ├─ Entrada: glow in
   ├─ Saída: glow out
   ├─ Timing: 5:60-6:20

9️⃣ button-09-ritual-of-minting.webp
   ├─ Texto: "Ritual of Minting"
   ├─ Duração: 600ms
   ├─ Entrada: expand/breathe in
   ├─ Saída: breathe out
   ├─ Timing: 6:20-6:80

🔟 button-10-click-mint.webp
   ├─ Texto: "Click to Mint"
   ├─ Duração: 600ms+ [pulsing até user clicar]
   ├─ Entrada: fade/pulse in (sempre pulsando)
   ├─ Saída: fade out [se user clica]
   ├─ Timing: 6:80-7:40+ [pulsing]
```

**TOTAL**: 10 arquivos, ~5.3 segundos de sequência

---

### FASE 4: LOADING STATE - CRAWL TEXT (Infinito até mint)

```
📁 /public/animations/loading/

1️⃣ loading-crawl-its-ritual.webp
   ├─ Texto: "it's a ritual" (repetido 2-3x na mesma imagem)
   ├─ Duração: Loop infinito (3 segundos por ciclo)
   ├─ Entrada: da direita (x: 100% → -100%)
   ├─ Animation: linear translation (direita → esquerda)
   ├─ Saída: seamless loop
   ├─ Timing: quando user clica MINT
   └─ Nota: pode ser uma imagem estática que é animada via CSS/Framer,
           OU uma WebP que já tem o movimento interno

OU (Mais simples):
   Criar como componente CSS + texto
   (Não precisa WebP, apenas useMotion do Framer)
```

---

### FASE 5: SUCCESS - Já Implementado ✅

```
✅ NFTSuccessCard.tsx
   └─ "The soul spins at a base - where the smile comes home."
   └─ Já está renderizado como texto com animação fade in
```

---

## ⏱️ TIMING EXATO PARA CADA ANIMAÇÃO

### ENTRADA vs SAÍDA

Cada animação tem 2 fases:

**ENTRADA** (In-time):
- Fade in: 200-300ms
- Ou outro efeito (slide, rotate, scale): 300-400ms

**DURAÇÃO** (Visible):
- Como especificado (700ms, 800ms, etc)

**SAÍDA** (Out-time):
- Fade out: 100-200ms
- Ou outro efeito: 200-300ms

**Exemplo**:
```
welcome-02-to-kin.webp = 800ms visible

Total animation:
├─ Fade in (200ms)         [0:70-0:90]
├─ Visible (800ms)         [0:90-1:70]
├─ Fade out (100ms)        [1:70-1:80]
└─ Next animation starts   [1:80] ← overlap com próximo
```

---

## 🎬 COMO INTEGRAR NO CÓDIGO

### Arquivo: `app/components/MagicButton/AnimatedTextComposer.tsx`

Já existe, mas você vai adicionar seus blocos:

```tsx
// Adicione seus arquivos em um objeto de mapping:

const animationBlocks = {
  // WELCOME SEQUENCE
  'welcome-01-welcome': '/public/animations/welcome/welcome-01-welcome.webp',
  'welcome-02-to-kin': '/public/animations/welcome/welcome-02-to-kin.webp',
  // ... etc
  
  // MAGIC BUTTON INTRO
  'button-01-great-eyes': '/public/animations/magic-button/button-01-great-eyes.webp',
  // ... etc
};
```

### Arquivo: `app/components/MagicButton/MagicButton.tsx`

Que já existe e já suporta isso via `textAnimationMap`:

```tsx
<MagicButton
  textAnimationMap={{
    welcome: [
      { src: animationBlocks['welcome-01-welcome'], duration: 700, enterFrom: 'top' },
      { src: animationBlocks['welcome-02-to-kin'], duration: 800, enterFrom: 'bottom' },
      // ... todas as 11
    ],
    magicButton: [
      { src: animationBlocks['button-01-great-eyes'], duration: 700, enterFrom: 'scale' },
      // ... todas as 10
    ],
    loading: [
      { src: animationBlocks['loading-crawl-its-ritual'], duration: 3000, loop: true },
    ],
  }}
/>
```

---

## ⚡ TRATAMENTO DE INTERRUPTIONS

**Quando user clica ANTES de terminar a sequência:**

```tsx
// Já existe em AnimatedTextComposer.tsx
// Quando state muda, animação atual é interrompida:

const handleInterrupt = () => {
  // Animação atual faz fadeOut rápido (200ms)
  // Próxima animação começa imediatamente
  // Sem delay
};

// Exemplo: User vê "Welcome," mas clica antes de terminar
// O que acontece:
// 1. "Welcome," faz fade out (200ms)
// 2. Sistema para de iterar as frases
// 3. Vai direto para próximo state (MAGIC_BUTTON ou pronto pra clicar)
```

---

## 📊 CHECKLIST DE CRIAÇÃO (2 HORAS)

```
⏱️ Tempo estimado por bloco:

SPLASH (1 frase):
  └─ 10 min (criar, exportar, testar)

WELCOME (11 frases):
  ├─ 5 min por frase = 55 min
  ├─ Margem extra: 15 min (ajustes, overlap)
  └─ Total: ~70 min (1h 10m)

MAGIC BUTTON (10 frases):
  ├─ 5 min por frase = 50 min
  ├─ Margem extra: 10 min (ajustes)
  └─ Total: ~60 min (1h)

LOADING CRAWL (1 animação):
  └─ 10 min (ou use CSS, sem WebP)

SUCCESS (Já feito):
  └─ ✅ 0 min (texto com fade in)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEMPO TOTAL: ~2 horas (com margem)
```

---

## 📝 ESPECIFICAÇÕES TÉCNICAS

### Para TODOS os arquivos WebP:

```
✅ Formato: WebP com Alpha Channel
✅ Resolução: 
   - Splash: 800x600px
   - Welcome/Button: 1000x400px (largo, texto legível mobile)
   - Loading: 1200x200px (crawl text precisa ser comprido)

✅ Background: Transparente (alpha)
✅ Qualidade: 85-90% (balanceamento tamanho vs qualidade)
✅ FPS: 24fps (smooth, não muito pesado)
✅ Codec: VP8 (padrão WebP)
✅ Loops: Sim (para breathing, pulsing, etc)

✅ Nomes:
   - Sem espaços
   - Com números: 01, 02, 03...
   - Com category prefix: welcome-, button-, splash-, loading-
   - Exemplo: welcome-01-welcome.webp ✅
   - NÃO: welcome 01 - welcome.webp ❌
```

---

## 🎨 ESTILO & DESIGN

### Para manter consistência:

```
Cores:
├─ Primary: #00ff88 (neon green)
├─ Secondary: #00c6fb (cyan)
├─ Accent: #005bea (blue)
└─ Background: transparent ou muito escuro

Fontes:
├─ Principal: Inter (bold/semibold para destaque)
├─ Size: 24-32px (legível em mobile)
└─ Espaçamento: 40-60px padding

Efeitos:
├─ Glow: text-shadow 0 0 10px #00ff88
├─ Fade: 0-1 opacity transition
├─ Scale: 0.9-1.1 transform
├─ Rotation: 0-5deg (subtle)
└─ Blur: opcional para transições
```

---

## 💾 EXPORTAÇÃO (After Effects / Blender / Etc)

### Passos:

1. **Crie a animação** (suas frases animadas)
2. **Adicione alpha channel** (transparency)
3. **Exporte como WebP**:
   ```
   After Effects:
   ├─ File → Export → Add to Media Encoder
   ├─ Format: WebP
   ├─ Compression: 85%
   └─ Loop: ON (se necessário)

   Blender:
   ├─ Render → Output Properties
   ├─ Format: WebP
   ├─ Alpha: ON (Use Alpha)
   └─ Codec: VP8
   ```

4. **Coloque em** `/public/animations/[category]/`
5. **Teste no browser** para garantir alpha/transparência

---

## 🔗 INTEGRAÇÃO NO CÓDIGO (Código já existe, só precisa dos arquivos)

Após criar os 33 blocos, apenas:

1. Copie para `/public/animations/[category]/`
2. Atualize caminhos em `AnimatedTextComposer.tsx` (se necessário)
3. Run `npm run dev`
4. Teste cada sequência

**O código já suporta tudo isso!**

---

## ✅ FINAL CHECKLIST

```
Criar (2 horas):
  [ ] Splash-save-ritual.webp (1x)
  [ ] Welcome-01 até 11 (11x) ~1h 10m
  [ ] Button-01 até 10 (10x) ~1h
  [ ] Loading-crawl-its-ritual (1x)

Testar:
  [ ] Cada WebP carrega no browser
  [ ] Alpha channel funciona (não preto opaco)
  [ ] Timings batem (700ms é 700ms)
  [ ] Interruptions funcionam (fade out rápido se clica antes)

Deploy:
  [ ] Copiar para /public/animations/
  [ ] npm run dev
  [ ] Teste ponta a ponta (splash → welcome → button → loading → success)
  [ ] Validar 60fps em DevTools
```

---

## 🎬 O Resultado Final

Após criar os 33 blocos (ou 32 se usar CSS para crawl):

```
Usuário abre app:
  0:00 → 4:00    SPLASH (1 animação)
  4:00 → 9:50    WELCOME (11 animações em sequência)
  9:50 → 16:10   BUTTON INTRO (10 animações em sequência)
  16:10 → (varies) MINT (crawl text loop)
  (success)       SUCCESS PAGE (já renderizado)

Total: ~22 blocos WebP + sucesso renderizado
Tempo de criação: ~2 horas (você tem isso!)
Resultado: Experiência de 20-25s totalmente animada e elegante
```

---

**Você tem tudo que precisa. 2 horas é o tempo certo. Let's go!** 🚀✨

