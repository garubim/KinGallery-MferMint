"use client";

import { useCallback } from 'react';
import MagicButton, { MagicButtonProps } from './MagicButton/MagicButton';

/**
 * CodePoemMintButton (DEPRECATED)
 * 
 * Este componente é uma versão experimental do MagicButton
 * com animações de texto integradas aos estados.
 * 
 * Usar MagicMintButton.tsx em produção em vez disso.
 */
export interface CodePoemMintButtonProps extends Omit<MagicButtonProps, 'textAnimationMap'> {
  /** Callback após mint bem-sucedido */
  onMintSuccess?: (metadata: { poem: string; createdAt: string }) => void;

  /** Callback para erro */
  onMintError?: (error: Error) => void;

  /** Poema sendo mintado */
  poem?: string;
}

// Animações padrão dos assets já prontos (PLACEHOLDER)
const defaultTextAnimations = {
  idle: {
    state: 'idle',
    src: '/animations/mint-button/to geteternalloop youre early teste transicao 01 boa-WebP max + Alpha.webp',
    enterFrom: 'scale',
    duration: 800,
    loop: true,
  },
};

export default function CodePoemMintButton({
  onMintSuccess,
  onMintError,
  poem = `/**\n * manifestoSoul — versão rápida\n * no núcleo da noite, o código respira\n * sussurros onchain dobram-se em loops\n * mintamos o echo e chamemos de lar\n */\nfunction manifestoSoul() external pure returns (string memory) {\n  return "eternal";\n}`,
  ...buttonProps
}: CodePoemMintButtonProps) {
  const textAnimations = defaultTextAnimations;

  const handleMint = useCallback(async () => {
    try {
      // Simular delay para demo (em produção, usar MagicMintButton.tsx)
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

      onMintSuccess?.(metadata);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('❌ Mint failed:', error);
      onMintError?.(error);
    }
  }, [poem, onMintSuccess, onMintError]);

  const handleStateChange = (newState: string) => {
    // No-op: apenas para compatibilidade com MagicButton
  };

  return (
    <MagicButton
      onClick={handleMint}
      textAnimationMap={textAnimations}
      onStateChange={handleStateChange}
      size="lg"
      variant="glow"
      {...buttonProps}
    >
      ✨ Mint CodePoem
    </MagicButton>
  );
}
