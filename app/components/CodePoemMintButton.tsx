"use client";

import { useCallback, useState } from 'react';
import MagicButton, { MagicButtonProps } from './MagicButton/MagicButton';
import { StateAnimationMap, ButtonState } from './MagicButton/AnimatedTextComposer';

/**
 * CodePoemMintButton
 * 
 * MagicButton com animações de texto integradas aos estados.
 * As frases aparecem como assets WebP com alpha channel
 * renderizadas por trás/sobrepondo o botão conforme seu estado.
 * 
 * Design:
 * - Estado IDLE: "Welcome to eternalloop" animação entra suavemente
 * - Estado HOVER: "Hover" indicando interatividade
 * - Estado LOADING: "Processing your eternal transaction..." com loop
 * - Estado SUCCESS: "✨ Minted! Welcome to eternity ✨" com burst
 * - Estado ERROR: "Something went wrong" com shake
 */
export interface CodePoemMintButtonProps extends Omit<MagicButtonProps, 'textAnimationMap'> {
  /** Callback após mint bem-sucedido */
  onMintSuccess?: (metadata: { poem: string; createdAt: string }) => void;

  /** Callback para erro */
  onMintError?: (error: Error) => void;

  /** Poema sendo mintado */
  poem?: string;

  /** Usar animações customizadas ou padrão */
  useCustomAnimations?: boolean;

  /** Mapa customizado de animações */
  customTextMap?: StateAnimationMap;
}

// Animações padrão dos assets já prontos
const defaultTextAnimations: StateAnimationMap = {
  idle: {
    state: 'idle',
    src: '/animations/mint-button/to geteternalloop youre early teste transicao 01 boa-WebP max + Alpha.webp',
    enterFrom: 'scale',
    duration: 800,
    loop: true, // suave breathing loop
  },
  hover: {
    state: 'hover',
    src: '/animations/mint-button/Welcom  to geteternalloop 06 boa webP-motion-Max+ Alpha-2.webp',
    enterFrom: 'bottom',
    duration: 500,
  },
  loading: {
    state: 'loading',
    src: '/animations/mint-button/welcome  to eternalloop teste transicao 03 boa-WebP max + Alpha.webp',
    loop: true,
    duration: 1200,
  },
  success: {
    state: 'success',
    src: '/animations/mint-button/to geteternalloop youre early teste transicao 01 boa-WebP max + Alpha.webp',
    enterFrom: 'center',
    duration: 1200,
  },
};

export default function CodePoemMintButton({
  onMintSuccess,
  onMintError,
  poem = `/**\n * manifestoSoul — versão rápida\n * no núcleo da noite, o código respira\n * sussurros onchain dobram-se em loops\n * mintamos o echo e chamemos de lar\n */\nfunction manifestoSoul() external pure returns (string memory) {\n  return "eternal";\n}`,
  useCustomAnimations = false,
  customTextMap,
  onStateChange,
  debug = false,
  ...buttonProps
}: CodePoemMintButtonProps) {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');

  const textAnimations: StateAnimationMap = customTextMap || defaultTextAnimations;

  const handleMint = useCallback(async () => {
    try {
      if (debug) console.log('🎬 Starting mint animation sequence...');

      // Simular delay para demo (em produção, fazer chamada real)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Salvar metadata
      const metadata = {
        name: 'CodePoem — EternalLoop',
        description: 'A codepoem from the eternal realm',
        poem,
        createdAt: new Date().toISOString(),
      };

      // Trigger localStorage save (placeholder para IPFS)
      const raw = localStorage.getItem('codepoem_mints_v1') || '[]';
      const arr = JSON.parse(raw);
      arr.unshift(metadata);
      localStorage.setItem('codepoem_mints_v1', JSON.stringify(arr));

      if (debug) console.log('✨ Mint complete!', metadata);
      onMintSuccess?.(metadata);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('❌ Mint failed:', error);
      onMintError?.(error);
    }
  }, [poem, onMintSuccess, onMintError, debug]);

  const handleStateChange = (newState: ButtonState) => {
    if (debug) console.log(`🎯 CodePoemMintButton state: ${newState}`);
    setButtonState(newState);
    onStateChange?.(newState);
  };

  return (
    <MagicButton
      onClick={handleMint}
      textAnimationMap={textAnimations}
      onStateChange={handleStateChange}
      size="lg"
      variant="glow"
      debug={debug}
      {...buttonProps}
    >
      ✨ Mint CodePoem
    </MagicButton>
  );
}
