# 🎬 Frases Rituals - Sequence for DaVinci Resolve

## FULL TIMELINE (4.3 seconds)

### Phrase 1: "The eyes see the flatline"
- **Duration**: 800ms (0.8s)
- **Timing**: 0:00 → 0:800
- **In**: 0:000
- **Out**: 0:800

### Phrase 2: "at 9 o'clock"
- **Duration**: 800ms (0.8s)
- **Timing**: 0:800 → 1:600
- **In**: 0:800
- **Out**: 1:600

### Phrase 3: "The mouse bends it"
- **Duration**: 800ms (0.8s)
- **Timing**: 1:600 → 2:400
- **In**: 1:600
- **Out**: 2:400

### Phrase 4: "into a smile"
- **Duration**: 900ms (0.9s)
- **Timing**: 2:400 → 3:300
- **In**: 2:400
- **Out**: 3:300

### Phrase 5: "and spins the loop onchain"
- **Duration**: 1000ms (1.0s)
- **Timing**: 3:300 → 4:300
- **In**: 3:300
- **Out**: 4:300

---

## COMPLETE TEXT (Linear)

```
The eyes see the flatline at 9 o'clock. The mouse bends it into a smile. Now you. Etch your mark. Click and base it onchain.
```

---

## SEQUENCE FOR DAVINCI (Format: Fusion Title)

```
CLIP 1: "The eyes see the flatline"
Frame Rate: 24fps or 30fps
Duration: 20 frames (@24fps) or 24 frames (@30fps)
Fade In: 2 frames
Fade Out: 2 frames

CLIP 2: "at 9 o'clock"
Frame Rate: 24fps or 30fps
Duration: 20 frames (@24fps) or 24 frames (@30fps)
Fade In: 2 frames
Fade Out: 2 frames

CLIP 3: "The mouse bends it"
Frame Rate: 24fps or 30fps
Duration: 20 frames (@24fps) or 24 frames (@30fps)
Fade In: 2 frames
Fade Out: 2 frames

CLIP 4: "into a smile"
Frame Rate: 24fps or 30fps
Duration: 22 frames (@24fps) or 27 frames (@30fps)
Fade In: 2 frames
Fade Out: 2 frames

CLIP 5: "and spins the loop onchain"
Frame Rate: 24fps or 30fps
Duration: 24 frames (@24fps) or 30 frames (@30fps)
Fade In: 2 frames
Fade Out: 3 frames
```

---

## FRAMES (@24fps)

| Frase | In Frame | Out Frame | Duração |
|-------|----------|-----------|---------|
| 1     | 0        | 19        | 20f     |
| 2     | 19       | 38        | 19f     |
| 3     | 38       | 57        | 19f     |
| 4     | 57       | 79        | 22f     |
| 5     | 79       | 103       | 24f     |

**Total**: 103 frames = 4.29 segundos @24fps

---

## FRAMES (@30fps)

| Frase | In Frame | Out Frame | Duração |
|-------|----------|-----------|---------|
| 1     | 0        | 24        | 24f     |
| 2     | 24       | 48        | 24f     |
| 3     | 48       | 72        | 24f     |
| 4     | 72       | 99        | 27f     |
| 5     | 99       | 129       | 30f     |

**Total**: 129 frames = 4.30 segundos @30fps

---

## ESTILO SUGERIDO

### Typography
- **Font**: Inter Bold ou Montserrat Bold
- **Size**: 48-64px
- **Color**: #FFFFFF (branco puro)
- **Text Shadow**: 0px 2px 8px rgba(0,0,0,0.8)
- **Letter Spacing**: 0.05em
- **Alignment**: Center

### Animation
- **Type**: Fade In/Out com leve scaling
- **In**: Opacity 0→1 + Scale 0.95→1.0 (2 frames)
- **Out**: Opacity 1→0 + Scale 1.0→0.95 (2-3 frames)
- **Easing**: Ease In/Out (suave)

### Background
- **Type**: Transparent ou semi-transparent overlay
- **Color**: rgba(5, 8, 10, 0.6) [opcional]
- **Position**: Center, sobre o Magic Button

---

## OPÇÕES ALTERNATIVAS (5ª Frase)

Se quiser variar:

```
"and writes it in history"
"and engraves its soul"
"and spins the loop onchain"
"and clicks to take it"
```

Mesma duração: 1000ms (24 frames @24fps, 30 frames @30fps)

---

## EXPORT SETTINGS

### Para Web (React/Next.js)
- **Format**: WebM ou MP4
- **Resolution**: 1080x1920 (mobile) ou 1920x1080 (desktop)
- **Bitrate**: 2-4 Mbps
- **Alpha Channel**: Yes (transparent background)

### Para Overlay
- **Format**: PNG Sequence ou ProRes 4444 (com alpha)
- **Frame Rate**: Match project (24fps ou 30fps)
- **Color Space**: sRGB

---

**Workflow DaVinci**:
1. Create New Timeline (4.3s @ 24fps ou 30fps)
2. Add 5 Fusion Title clips
3. Type cada frase no Text+ node
4. Ajustar timing conforme tabela acima
5. Add fade in/out keyframes
6. Export como WebM com alpha channel

**Ready para animar!** 🎬
