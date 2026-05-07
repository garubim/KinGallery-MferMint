"use client";

import { useCallback } from 'react';
import MagicButton, { MagicButtonProps } from './MagicButton/MagicButton';

/**
 * CodePoemMintButton (DEPRECATED)
 *
 * This component is an experimental version of MagicButton
 * with text animations integrated into states.
 *
 * Use MagicMintButton.tsx in production instead.
 */
export interface CodePoemMintButtonProps extends Omit<MagicButtonProps, 'textAnimationMap'> {
  /** Callback after successful mint */
  onMintSuccess?: (metadata: { poem: string; createdAt: string }) => void;

  /** Error callback */
  onMintError?: (error: Error) => void;

  /** Poem being minted */
  poem?: string;
}

// Default animations from ready assets (PLACEHOLDER)
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
  poem = `/**\n * manifestoSoul - versão rápida\n * no núcleo da noite, o código respira\n * sussurros onchain dobram-se em loops\n * mintamos o echo e chamemos de lar\n */\nfunction manifestoSoul() external pure returns (string memory) {\n  return "eternal";\n}`,
  ...buttonProps
}: CodePoemMintButtonProps) {
  const textAnimations = defaultTextAnimations;

  const handleMint = useCallback(async () => {
    try {
      // Simulate delay for demo (in production, use MagicMintButton.tsx)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save metadata
      const metadata = {
        name: 'CodePoem - EternalLoop',
        description: 'A codepoem from the eternal realm',
        poem,
        createdAt: new Date().toISOString(),
      };

      // Trigger localStorage save (placeholder for IPFS)
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
    // No-op: for compatibility with MagicButton only
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
