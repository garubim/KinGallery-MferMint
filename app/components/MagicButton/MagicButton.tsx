"use client";

import { useCallback, useState, useRef, ReactNode } from 'react';
import BlockchainWriteOverlay, { BlockchainWriteOverlayProps } from '../BlockchainWriteOverlay';

export interface MagicButtonProps {
  /** Conteúdo do botão ou usar textAnimationMap para frases animadas */
  children?: ReactNode;

  /** Mapa de animações de texto para cada estado */
  textAnimationMap?: StateAnimationMap;

  /** Callback para click */
  onClick?: () => void | Promise<void>;

  /** Loading state */
  loading?: boolean;

  /** Success state */
  success?: boolean;

  /** Error state */
  error?: boolean;

  /** Tamanho */
  size?: 'sm' | 'md' | 'lg';

  /** Variante de cor */
  variant?: 'mint' | 'glow' | 'neon';

  /** Desabilitado */
  disabled?: boolean;

  /** Classe CSS customizada */
  className?: string;

  /** Callback quando estado muda */
  onStateChange?: (state: ButtonState) => void;

  /** Debug logging */
  debug?: boolean;

  /** Mostrar partículas */
  showParticles?: boolean;

  /** Mostrar BlockchainWriteOverlay durante loading */
  showBlockchainOverlay?: boolean;

  /** Props customizadas para BlockchainWriteOverlay */
  blockchainOverlayProps?: Partial<BlockchainWriteOverlayProps>;
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-8 py-3 text-base',
  lg: 'px-12 py-4 text-lg',
};

const variantStyles = {
  mint: 'from-teal-400 to-emerald-500 shadow-lg shadow-teal-500/50',
  glow: 'from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/50',
  neon: 'from-purple-400 to-pink-500 shadow-lg shadow-purple-500/50',
};

/**
 * MagicButton com suporte a animações de texto (frases WebP com alpha)
 * 
 * Uso básico:
 * ```tsx
 * <MagicButton onClick={handleMint}>✨ Mint NFT</MagicButton>
 * ```
 * 
 * Com animações de texto:
 * ```tsx
 * const textMap = {
 *   idle: { 
 *     src: '/animations/mint-button/welcome.webp',
 *     enterFrom: 'scale',
 *     duration: 600,
 *   },
 *   hover: {
 *     src: '/animations/mint-button/hover.webp',
 *     enterFrom: 'bottom',
 *     duration: 400,
 *   },
 *   loading: {
 *     src: '/animations/mint-button/loading.webp',
 *     loop: true,
 *     duration: 800,
 *   },
 *   success: {
 *     src: '/animations/mint-button/success.webp',
 *     enterFrom: 'center',
 *     duration: 1200,
 *   },
 * };
 * 
 * <MagicButton
 *   textAnimationMap={textMap}
 *   onClick={handleMint}
 *   onStateChange={(state) => console.log('Button state:', state)}
 * />
 * ```
 */
export default function MagicButton({
  children,
  textAnimationMap,
  onClick,
  loading = false,
  success = false,
  error = false,
  size = 'lg',
  variant = 'mint',
  disabled = false,
  className = '',
  onStateChange,
  debug = false,
  showParticles = true,
  showBlockchainOverlay = false,
  blockchainOverlayProps = {},
}: MagicButtonProps) {
  const [isClicking, setIsClicking] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalSuccess, setInternalSuccess] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Determinar estado atual
  const isLoading = loading || internalLoading;
  const isSuccess = success || internalSuccess;
  const isError = error || internalError;

  const getState = useCallback((): ButtonState => {
    if (isSuccess) return 'success';
    if (isError) return 'error';
    if (isLoading) return 'loading';
    if (isClicking) return 'press';
    // hover seria detectado por onHover
    return 'idle';
  }, [isLoading, isSuccess, isError, isClicking]);

  const currentState = getState();

  // Notificar mudança de estado
  const notifyStateChange = useCallback(
    (state: ButtonState) => {
      if (debug) console.log(`🎯 Button state: ${state}`);
      onStateChange?.(state);
    },
    [onStateChange, debug]
  );

  const handleClick = async () => {
    if (disabled || isLoading || isClicking) return;

    setIsClicking(true);
    notifyStateChange('press');

    try {
      if (onClick) {
        setInternalLoading(true);
        notifyStateChange('loading');
        await onClick();
        setInternalLoading(false);
        setInternalSuccess(true);
        notifyStateChange('success');

        // Auto-reset após 2 segundos
        setTimeout(() => {
          setInternalSuccess(false);
          setIsClicking(false);
          notifyStateChange('idle');
        }, 2000);
      } else {
        setIsClicking(false);
        notifyStateChange('idle');
      }
    } catch (err) {
      console.error('Button click error:', err);
      setInternalLoading(false);
      setInternalError(true);
      notifyStateChange('error');

      // Auto-reset após 2 segundos
      setTimeout(() => {
        setInternalError(false);
        setIsClicking(false);
        notifyStateChange('idle');
      }, 2000);
    }
  };

  const handleMouseEnter = () => {
    if (!isLoading && !isSuccess && !isError && !isClicking) {
      notifyStateChange('hover');
    }
  };

  const handleMouseLeave = () => {
    if (!isLoading && !isSuccess && !isError && !isClicking) {
      notifyStateChange('idle');
    }
  };

  return (
    <div className={`magic-button-container ${className}`}>
      {/* Blockchain Write Overlay */}
      {showBlockchainOverlay && (
        <BlockchainWriteOverlay
          show={isLoading}
          {...blockchainOverlayProps}
        />
      )}
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled || isLoading}
        className={`
          relative overflow-hidden rounded-lg font-semibold
          transition-all duration-300 ease-out
          ${sizeStyles[size]}
          ${!disabled ? `bg-gradient-to-r ${variantStyles[variant]}` : 'bg-gray-400 opacity-50'}
          text-white
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        whileHover={!disabled && !isLoading ? { scale: 1.05 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Background breathing animation para IDLE */}
        {currentState === 'idle' && (
          <motion.div
            className="absolute inset-0 -z-10"
            animate={{
              opacity: [1, 0.7, 1],
              boxShadow: [
                '0 0 20px rgba(0,255,150,0.3)',
                '0 0 40px rgba(0,255,150,0.5)',
                '0 0 20px rgba(0,255,150,0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ borderRadius: 'inherit' }}
          />
        )}

        {/* Spinner para LOADING */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-transparent border-t-white rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success checkmark */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              ✓
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error X */}
        <AnimatePresence>
          {isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              ✕
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conteúdo do botão */}
        <motion.div
          animate={{
            opacity: isLoading || isSuccess || isError ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </motion.button>

      {/* Camada de animação de texto */}
      {textAnimationMap && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <AnimatedTextComposer
            stateMap={textAnimationMap}
            currentState={currentState}
            onAnimationComplete={(state) => {
              if (debug) console.log(`✨ Text animation done: ${state}`);
            }}
            debug={debug}
          />
        </div>
      )}
    </div>
  );
}
