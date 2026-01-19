"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * BlockchainWriteOverlay
 * 
 * Mostra animação mistério (Matrix code) enquanto escreve NFT na blockchain.
 * Cria sensação de "escrita on-chain" em tempo real.
 * 
 * Uso:
 * ```tsx
 * <BlockchainWriteOverlay
 *   show={isLoading}
 *   title="Writing to blockchain..."
 *   subtitle="Securing your artwork on Base"
 * />
 * ```
 */

export interface BlockchainWriteOverlayProps {
  /** Mostrar ou não o overlay */
  show: boolean;
  
  /** Título principal */
  title?: string;
  
  /** Subtítulo */
  subtitle?: string;
  
  /** Animação de fundo (WebP ou WebM) */
  backdropSrc?: string;
  
  /** Usar multi-layer (Blue + Green) para mais efeito */
  multiLayer?: boolean;
  
  /** Renderização customizada do conteúdo */
  children?: ReactNode;
  
  /** Callback quando fechar/desaparecer */
  onComplete?: () => void;
  
  /** CSS customizado */
  className?: string;
  
  /** Z-index */
  zIndex?: number;
}

export default function BlockchainWriteOverlay({
  show,
  title = '✨ Writing to blockchain...',
  subtitle = 'Your NFT is being secured on Base',
  backdropSrc = '/code_poem-Matrix/Matrix Codepoem 2 Layers Blue&Green Curto half ProRes 4444+Alpha .webp',
  multiLayer = true,
  children,
  onComplete,
  className = '',
  zIndex = 5000,
}: BlockchainWriteOverlayProps) {
  const isWebm = backdropSrc?.endsWith('.webm');

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={className}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {/* Backdrop animation */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              overflow: 'hidden',
            }}
          >
            {isWebm ? (
              <video
                src={backdropSrc}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.4,
                }}
              />
            ) : (
              <img
                src={backdropSrc}
                alt="Blockchain write animation"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.4,
                }}
              />
            )}
          </div>

          {/* Content card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            style={{
              position: 'relative',
              zIndex: 2,
              background: 'linear-gradient(135deg, rgba(20, 30, 50, 0.9), rgba(10, 20, 40, 0.95))',
              border: '1px solid rgba(0, 255, 200, 0.3)',
              borderRadius: 16,
              padding: '40px',
              maxWidth: '500px',
              textAlign: 'center',
              boxShadow:
                '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 255, 150, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Spinner animation */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '24px',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: '60px',
                  height: '60px',
                  border: '3px solid rgba(0, 255, 200, 0.2)',
                  borderTopColor: '#00ff88',
                  borderRadius: '50%',
                }}
              />
            </div>

            {/* Title */}
            <motion.h2
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#00ff88',
                margin: '0 0 12px 0',
                fontFamily: 'monospace',
                letterSpacing: '1px',
              }}
            >
              {title}
            </motion.h2>

            {/* Subtitle */}
            {subtitle && (
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(200, 255, 230, 0.7)',
                  margin: '0 0 24px 0',
                  fontFamily: 'monospace',
                }}
              >
                {subtitle}
              </p>
            )}

            {/* Animated dots */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#00ff88',
                  }}
                />
              ))}
            </div>

            {/* Custom content */}
            {children && (
              <motion.div
                initial={{ opacity: 0, marginTop: 0 }}
                animate={{ opacity: 1, marginTop: '24px' }}
                transition={{ delay: 0.3 }}
              >
                {children}
              </motion.div>
            )}
          </motion.div>

          {/* Corner accents */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: '40px',
              height: '40px',
              border: '2px solid rgba(0, 255, 150, 0.4)',
              zIndex: 1,
            }}
          />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '20%',
              right: '10%',
              width: '60px',
              height: '60px',
              border: '2px solid rgba(0, 255, 150, 0.4)',
              zIndex: 1,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
