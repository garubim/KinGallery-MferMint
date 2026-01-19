"use client";

import { ReactNode, useEffect, useState } from 'react';
import AnimatedTextLayer, { AnimatedTextConfig } from './AnimatedTextLayer';

export type ButtonState = 'idle' | 'hover' | 'press' | 'loading' | 'success' | 'error';

export interface StateAnimationMap {
  [key in ButtonState]?: AnimatedTextConfig;
}

interface AnimatedTextComposerProps {
  /** Mapa de estados para configurações de animação */
  stateMap: StateAnimationMap;
  
  /** Estado atual do botão */
  currentState: ButtonState;
  
  /** Callback quando animação termina */
  onAnimationComplete?: (state: ButtonState) => void;
  
  /** Renderização customizada do container */
  render?: (children: ReactNode) => ReactNode;
  
  /** Classe CSS do container */
  className?: string;
  
  /** Estilo do container */
  style?: React.CSSProperties;
  
  /** Mostrar animação apenas quando estado muda */
  animateOnStateChange?: boolean;
  
  /** Debug: log state changes */
  debug?: boolean;
}

/**
 * AnimatedTextComposer
 * 
 * Orquestra as animações de texto (frases WebP com alpha channel)
 * baseado no estado do botão.
 * 
 * Uso:
 * ```tsx
 * const textMap = {
 *   idle: { src: '/animations/welcome.webp', enterFrom: 'scale' },
 *   hover: { src: '/animations/hover.webp', enterFrom: 'bottom' },
 *   loading: { src: '/animations/loading.webp', loop: true },
 *   success: { src: '/animations/success.webp', enterFrom: 'center' },
 * };
 * 
 * <AnimatedTextComposer
 *   stateMap={textMap}
 *   currentState={buttonState}
 *   onAnimationComplete={handleComplete}
 * />
 * ```
 */
export default function AnimatedTextComposer({
  stateMap,
  currentState,
  onAnimationComplete,
  render,
  className = '',
  style = {},
  animateOnStateChange = true,
  debug = false,
}: AnimatedTextComposerProps) {
  const [activeState, setActiveState] = useState<ButtonState>(currentState);
  const [displayState, setDisplayState] = useState<ButtonState>(currentState);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Detectar mudança de estado
  useEffect(() => {
    if (currentState !== activeState) {
      if (debug) console.log(`🎬 State change: ${activeState} → ${currentState}`);
      setIsTransitioning(true);
      setActiveState(currentState);
    }
  }, [currentState, activeState, debug]);

  const handleAnimationComplete = () => {
    if (debug) console.log(`✨ Animation complete for state: ${activeState}`);
    setDisplayState(activeState);
    setIsTransitioning(false);
    
    if (onAnimationComplete) {
      onAnimationComplete(activeState);
    }
  };

  // Obter configuração do estado atual
  const config = stateMap[activeState];

  const container = (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {config && (
        <AnimatedTextLayer
          config={{
            state: activeState,
            ...config,
          }}
          show={animateOnStateChange ? isTransitioning : true}
          onAnimationComplete={handleAnimationComplete}
          style={{
            zIndex: 10,
          }}
        />
      )}
    </div>
  );

  return render ? render(container) : container;
}
