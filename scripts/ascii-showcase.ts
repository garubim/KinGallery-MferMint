#!/usr/bin/env node

/**
 * 🎬 ANIMATED TEXT LAYER SYSTEM - ASCII ART SHOWCASE
 * 
 * Este arquivo é uma celebração visual (e funcional!) do sistema
 * de animação de texto para o Mighty Magic Button
 * 
 * Run: npx ts-node scripts/ascii-showcase.ts
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgBlue: '\x1b[44m',
};

const c = colors;

// Title
console.log(`
${c.cyan}╔══════════════════════════════════════════════════════════════════════╗${c.reset}
${c.cyan}║${c.reset}                                                                  ${c.cyan}║${c.reset}
${c.cyan}║${c.reset}  ${c.bright}${c.magenta}🎬 THE ANIMATED TEXT LAYER SYSTEM 🎬${c.reset}                           ${c.cyan}║${c.reset}
${c.cyan}║${c.reset}                                                                  ${c.cyan}║${c.reset}
${c.cyan}║${c.reset}     ${c.cyan}Frases Animadas + Orquestração de Código${c.reset}              ${c.cyan}║${c.reset}
${c.cyan}║${c.reset}                                                                  ${c.cyan}║${c.reset}
${c.cyan}╚══════════════════════════════════════════════════════════════════════╝${c.reset}
`);

// The Button States Visualization
console.log(`${c.bright}${c.blue}📊 BUTTON STATES FLOW${c.reset}\n`);

console.log(`
${c.dim}                                   ┌─────────┐${c.reset}
${c.dim}                                   │  IDLE   │${c.reset}
${c.dim}                                   └────┬────┘${c.reset}
${c.bright}${c.green}Frase: "Welcome to eternalloop" ◀${c.reset}${c.dim}─────┼────────────┐${c.reset}
${c.bright}${c.cyan}Tipo: Breathing loop (suave)${c.reset}${c.dim}         │                  │${c.reset}
${c.dim}                                   │                  │${c.reset}
${c.dim}                    ┌──────────────┘                  │${c.reset}
${c.dim}                    │                                 │${c.reset}
${c.dim}                    ▼                                 │${c.reset}
${c.dim}              ┌──────────┐                            │${c.reset}
${c.bright}${c.yellow}Frase: "Ready?" ◀${c.reset}${c.dim}│  HOVER   │                            │${c.reset}
${c.bright}${c.cyan}Entra de baixo      │${c.reset}${c.dim}──────────┤                            │${c.reset}
${c.dim}                    │                              │${c.reset}
${c.dim}                 click                            │${c.reset}
${c.dim}                    │                              │${c.reset}
${c.dim}                    ▼                              │${c.reset}
${c.dim}              ┌──────────┐                        │${c.reset}
${c.bright}${c.magenta}(Press visual) ◀${c.reset}${c.dim}│  PRESS   │                        │${c.reset}
${c.bright}${c.cyan}Scale: 1.0→0.98  │──────────┤                        │${c.reset}
${c.dim}                    │                        │timeout${c.reset}
${c.dim}                    │                        │${c.reset}
${c.dim}         ┌──────────┴────────┐              │${c.reset}
${c.dim}         │                   │              │${c.reset}
${c.dim}         ▼                   ▼              │${c.reset}
${c.dim}    ┌─────────┐         ┌────────┐         │${c.reset}
${c.bright}${c.cyan}Frase: ◀${c.reset}${c.dim}│ LOADING │    │ SUCCESS│         │${c.reset}
${c.bright}${c.cyan}"Processing"${c.reset}${c.dim} │───────────    └────┬───┘         │${c.reset}
${c.bright}${c.cyan}Loop infinito  │         ┌─────────┘          │${c.reset}
${c.dim}                   ▼         ▼                    │${c.reset}
${c.bright}${c.green}Frase: "✨ Minted! ✨" (burst anim)     │${c.reset}
${c.dim}                                                │${c.reset}
${c.dim}                   timeout (2s)                 │${c.reset}
${c.dim}                        │                       │${c.reset}
${c.dim}                        ▼                       │${c.reset}
${c.dim}                   Back to IDLE ◄───────────────┘${c.reset}
`);

// Architecture Layers
console.log(`\n${c.bright}${c.blue}🏗️  ARQUITETURA EM CAMADAS${c.reset}\n`);

console.log(`
${c.cyan}┌─────────────────────────────────────────────┐${c.reset}
${c.cyan}│  User Interaction Layer${c.reset}                 ${c.cyan}│${c.reset}
${c.cyan}│  (hover, click, keyboard)${c.reset}              ${c.cyan}│${c.reset}
${c.cyan}└──────────────┬──────────────────────────────┘${c.reset}
               ${c.dim}│${c.reset}
               ${c.dim}▼${c.reset}
${c.cyan}┌─────────────────────────────────────────────┐${c.reset}
${c.cyan}│ AnimatedTextComposer${c.reset}                    ${c.cyan}│${c.reset}
${c.cyan}│ (Orchestrator - watches state)${c.reset}        ${c.cyan}│${c.reset}
${c.cyan}└──────┬───────────────────┬──────────────────┘${c.reset}
       ${c.dim}│${c.reset}                   ${c.dim}│${c.reset}
       ${c.dim}├─ on state change: IDLE → HOVER${c.reset}
       ${c.dim}├─ trigger exit anim (old)${c.reset}
       ${c.dim}├─ trigger enter anim (new)${c.reset}
       ${c.dim}└─ call onAnimationComplete${c.reset}

${c.cyan}┌──────────────────────────────────────────────────────────┐${c.reset}
${c.cyan}│ Camadas do Botão (z-index)${c.reset}                        ${c.cyan}│${c.reset}
${c.cyan}├──────────────────────────────────────────────────────────┤${c.reset}
${c.bright}${c.cyan}│ Z-10: Animated Text Layer (WebP + alpha)${c.reset}        ${c.cyan}│${c.reset}
${c.dim}│        ↑ Renderizado por AnimatedTextLayer               │${c.reset}
${c.cyan}├──────────────────────────────────────────────────────────┤${c.reset}
${c.cyan}│ Z-5:  Particle Effects (confetti, sparkles)${c.reset}      ${c.cyan}│${c.reset}
${c.cyan}├──────────────────────────────────────────────────────────┤${c.reset}
${c.cyan}│ Z-1:  Button Background (gradient)${c.reset}              ${c.cyan}│${c.reset}
${c.cyan}│                                                          │${c.reset}
${c.cyan}│ Z-0:  Button Content (icon, text de fallback)${c.reset}    ${c.cyan}│${c.reset}
${c.cyan}└──────────────────────────────────────────────────────────┘${c.reset}
`);

// Animation Timeline
console.log(`\n${c.bright}${c.blue}⏱️  ANIMATION TIMELINES${c.reset}\n`);

const drawTimeline = (label, frames, color) => {
  console.log(`${color}${label}${c.reset}`);
  console.log('0ms' + ' '.repeat(10) + 'Timeline' + ' '.repeat(10) + 'End');
  console.log('│' + '─'.repeat(30) + '│');
  for (const frame of frames) {
    console.log(`${frame}`);
  }
  console.log('');
};

drawTimeline(
  '🟦 IDLE (Breathing Loop)',
  [
    `${c.dim}├─ Scale: 0.6 ────────► 1.0 ────────► 0.6 (repeat)${c.reset}`,
    `${c.dim}├─ Opacity: 0% ────────► 100% ────────► 0%${c.reset}`,
    `${c.cyan}└─ Duration: 800ms | Loop: ∞${c.reset}`,
  ],
  c.cyan
);

drawTimeline(
  '🟨 HOVER (Enter Bottom)',
  [
    `${c.dim}├─ Y: -40px ────────► 0px${c.reset}`,
    `${c.dim}├─ Opacity: 0% ────────► 100%${c.reset}`,
    `${c.cyan}└─ Duration: 500ms | Easing: easeOut${c.reset}`,
  ],
  c.yellow
);

drawTimeline(
  '🔵 LOADING (Infinite Loop)',
  [
    `${c.dim}├─ Spinner: ↻ ↻ ↻ ↻ (continuous)${c.reset}`,
    `${c.dim}├─ Opacity: Breathing${c.reset}`,
    `${c.cyan}└─ Duration: 1200ms per cycle | Loop: ∞${c.reset}`,
  ],
  c.blue
);

drawTimeline(
  '🟩 SUCCESS (Burst Center)',
  [
    `${c.dim}├─ Scale: 0.5 ────► 1.1 ────► 1.0 (settle)${c.reset}`,
    `${c.dim}├─ Rotation: 0° ────► 360° ────► 360°${c.reset}`,
    `${c.dim}├─ Opacity: 0% ────► 100% ────► 0%${c.reset}`,
    `${c.cyan}└─ Duration: 1200ms | Then auto-reset after 800ms${c.reset}`,
  ],
  c.green
);

// Component Tree
console.log(`${c.bright}${c.blue}🌳 COMPONENT TREE${c.reset}\n`);

console.log(`
MagicButton (Principal)
${c.dim}├─ props: onClick, textAnimationMap, size, variant${c.reset}
${c.dim}├─ state: isClicking, internalLoading, internalSuccess, internalError${c.reset}
│
${c.bright}${c.cyan}├─► AnimatedTextComposer (Orchestrator)${c.reset}
${c.dim}│   ├─ props: stateMap, currentState, onAnimationComplete${c.reset}
${c.dim}│   ├─ watches: currentState changes${c.reset}
${c.dim}│   │
${c.bright}${c.cyan}│   └─► AnimatedTextLayer (Renderer)${c.reset}
${c.dim}│       ├─ props: config (src, duration, enterFrom, etc)${c.reset}
${c.dim}│       ├─ renders: <img> with Framer Motion animation${c.reset}
${c.dim}│       └─ emits: onAnimationComplete${c.reset}
│
${c.dim}└─ Button visual (gradient, spinner, checkmark, X)${c.reset}
`);

// Usage Example
console.log(`\n${c.bright}${c.blue}💻 USAGE EXAMPLE${c.reset}\n`);

console.log(`${c.bright}${c.cyan}const textAnimations = {${c.reset}
${c.cyan}  idle: {${c.reset}
    src: ${c.green}'/animations/welcome.webp'${c.reset},
    enterFrom: ${c.green}'scale'${c.reset},
    duration: 800,
    loop: true,
  },
${c.cyan}  hover: {${c.reset}
    src: ${c.green}'/animations/hover.webp'${c.reset},
    enterFrom: ${c.green}'bottom'${c.reset},
    duration: 500,
  },
${c.cyan}  loading: {${c.reset}
    src: ${c.green}'/animations/loading.webp'${c.reset},
    loop: true,
    duration: 1200,
  },
${c.cyan}  success: {${c.reset}
    src: ${c.green}'/animations/success.webp'${c.reset},
    enterFrom: ${c.green}'center'${c.reset},
    duration: 1200,
  },
${c.cyan}}${c.reset}

${c.bright}${c.cyan}<${c.bright}MagicButton${c.reset}
  onClick={${c.yellow}handleMint${c.reset}}
  textAnimationMap={${c.yellow}textAnimations${c.reset}}
  size=${c.green}"lg"${c.reset}
  variant=${c.green}"glow"${c.reset}
  onStateChange={(state) => console.log(state)}
>
  ✨ Mint Your NFT
</${c.bright}MagicButton${c.reset}>
`);

// The Magic
console.log(`\n${c.bright}${c.magenta}✨ O DIFERENCIAL ✨${c.reset}\n`);

console.log(`${c.bright}${c.yellow}Abordagem Tradicional:${c.reset}
${c.dim}❌ CSS keyframes para texto (limitado, jerky)${c.reset}
${c.dim}❌ Gradientes e shadows (entediante)${c.reset}
${c.dim}❌ Difícil polir transições${c.reset}

${c.bright}${c.green}Novo Approach:${c.reset}
${c.bright}✅ Frases como assets profissionais (WebP + alpha)${c.reset}
${c.bright}✅ Animações feitas em After Effects/Blender${c.reset}
${c.bright}✅ Código apenas orquestra QUANDO cada coisa aparece${c.reset}
${c.bright}✅ Resultado: Pixel-perfect visual excellence${c.reset}

${c.bright}${c.cyan}═══════════════════════════════════════════════════════════════${c.reset}
${c.bright}${c.cyan}The magic is not in the code—it's in the coordination${c.reset}
${c.bright}${c.cyan}between beautiful art and elegant orchestration.${c.reset}
${c.bright}${c.cyan}═══════════════════════════════════════════════════════════════${c.reset}
`);

// Files Created
console.log(`\n${c.bright}${c.blue}📁 ARQUIVOS CRIADOS${c.reset}\n`);

const files = [
  {
    name: 'AnimatedTextLayer.tsx',
    loc: 'app/components/MagicButton/',
    desc: 'Renderiza uma imagem WebP com animação',
  },
  {
    name: 'AnimatedTextComposer.tsx',
    loc: 'app/components/MagicButton/',
    desc: 'Orquestra qual animação aparece em cada estado',
  },
  {
    name: 'MagicButton.tsx',
    loc: 'app/components/MagicButton/',
    desc: 'Componente principal do botão integrado',
  },
  {
    name: 'CodePoemMintButton.tsx',
    loc: 'app/components/',
    desc: 'Versão especializada para mintagem de CodePoem',
  },
  {
    name: 'CodePoemWithAnimatedMint.tsx',
    loc: 'app/components/',
    desc: 'CodePoem com botão animado integrado',
  },
  {
    name: 'ANIMATED_TEXT_LAYER_GUIDE.md',
    loc: 'root',
    desc: 'Guia técnico detalhado com exemplos',
  },
  {
    name: 'ANIMATED_TEXT_ASCII_FLOW.md',
    loc: 'root',
    desc: 'Visualização ASCII com diagramas',
  },
  {
    name: 'ANIMATED_TEXT_IMPLEMENTATION.md',
    loc: 'root',
    desc: 'Resumo de implementação e próximos passos',
  },
];

files.forEach((file, i) => {
  console.log(`${c.bright}${i + 1}.${c.reset} ${c.cyan}${file.name}${c.reset}`);
  console.log(`   ${c.dim}Localização: ${file.loc}${c.reset}`);
  console.log(`   ${c.bright}${file.desc}${c.reset}\n`);
});

// Checklist
console.log(`${c.bright}${c.blue}✓ CHECKLIST${c.reset}\n`);

const checklist = [
  ['AnimatedTextLayer.tsx', true],
  ['AnimatedTextComposer.tsx', true],
  ['MagicButton.tsx', true],
  ['CodePoemMintButton.tsx', true],
  ['CodePoemWithAnimatedMint.tsx', true],
  ['Documentação', true],
  ['Testar em página React', false],
  ['Mapear SUCCESS/ERROR assets', false],
  ['Conectar com smart contract real', false],
  ['Testes em mobile', false],
  ['Deploy', false],
];

checklist.forEach(([item, done]) => {
  const symbol = done ? `${c.green}✓${c.reset}` : `${c.dim}○${c.reset}`;
  const style = done ? c.dim : c.bright;
  console.log(`${symbol} ${style}${item}${c.reset}`);
});

// Final Message
console.log(`\n${c.cyan}╔═══════════════════════════════════════════════════════════════╗${c.reset}`);
console.log(`${c.cyan}║${c.reset}                                                               ${c.cyan}║${c.reset}`);
console.log(`${c.cyan}║${c.reset}  ${c.bright}${c.green}🎬 SISTEMA PRONTO PARA INTEGRAÇÃO 🎬${c.reset}            ${c.cyan}║${c.reset}`);
console.log(`${c.cyan}║${c.reset}                                                               ${c.cyan}║${c.reset}`);
console.log(`${c.cyan}║${c.reset}  Próximo: Testar no navegador + conectar smart contract    ${c.cyan}║${c.reset}`);
console.log(`${c.cyan}║${c.reset}                                                               ${c.cyan}║${c.reset}`);
console.log(`${c.cyan}╚═══════════════════════════════════════════════════════════════╝${c.reset}\n`);
