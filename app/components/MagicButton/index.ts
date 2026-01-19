/**
 * MagicButton Component Exports
 * 
 * Este arquivo centraliza as exportações para facilitar imports
 */

export { default as MagicButton } from './MagicButton';
export { default as MagicButtonNew } from './MagicButtonNew';
export { default as AnimatedTextLayer } from './AnimatedTextLayer';
export { default as AnimatedTextComposer } from './AnimatedTextComposer';

export type { MagicButtonProps } from './MagicButton';
export type { AnimatedTextConfig } from './AnimatedTextLayer';
export type { StateAnimationMap, ButtonState, AnimatedTextComposerProps } from './AnimatedTextComposer';

/**
 * Quick Import Guide
 * 
 * // Apenas o botão
 * import { MagicButton } from '@/components/MagicButton';
 * 
 * // Com tipos
 * import { MagicButton, StateAnimationMap, ButtonState } from '@/components/MagicButton';
 * 
 * // Componentes individuais (se necessário)
 * import { AnimatedTextLayer } from '@/components/MagicButton';
 * import { AnimatedTextComposer } from '@/components/MagicButton';
 * 
 * // Para CodePoem
 * import CodePoemMintButton from '@/components/CodePoemMintButton';
 */
