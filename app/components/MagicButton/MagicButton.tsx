"use client";

import { useCallback, useState, useRef, ReactNode } from 'react';
import BlockchainWriteOverlay, { BlockchainWriteOverlayProps } from '../BlockchainWriteOverlay';

export interface MagicButtonProps {
  /** Conteúdo do botão ou usar textAnimationMap para frases animadas */
  children?: ReactNode;

  /** Mapa de animações de texto para cada estado (DEPRECATED - use MagicMintButton.tsx) */
  textAnimationMap?: Record<string, any>;

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
  onStateChange?: (state: string) => void;

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

  const getState = useCallback((): string => {
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
    (state: string) => {
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
      <button
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
          hover:scale-105 active:scale-98
          ${className}
        `}
        style={{
          position: 'relative',
          zIndex: 1,
          animation: currentState === 'idle' ? 'breathing 3s infinite' : 'none',
        }}
      >
        <style jsx>{`
          @keyframes breathing {
            0%, 100% {
              opacity: 1;
              box-shadow: 0 0 20px rgba(0, 255, 150, 0.3);
            }
            50% {
              opacity: 0.7;
              box-shadow: 0 0 40px rgba(0, 255, 150, 0.5);
            }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Spinner para LOADING */}
        {isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: 1,
              animation: 'spin 2s linear infinite',
            }}
          >
            <div
              className="w-5 h-5 border-2 border-transparent border-t-white rounded-full"
              style={{
                animation: 'spin 2s linear infinite',
              }}
            />
          </div>
        )}

        {/* Success checkmark */}
        {isSuccess && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: 1,
              animation: 'scaleIn 0.3s ease-out',
            }}
          >
            ✓
          </div>
        )}

        {/* Error X */}
        {isError && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: 1,
              animation: 'scaleIn 0.3s ease-out',
            }}
          >
            ✕
          </div>
        )}

        {/* Conteúdo do botão */}
        <div
          style={{
            opacity: isLoading || isSuccess || isError ? 0 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {children}
        </div>
      </button>
    </div>
  );
}
