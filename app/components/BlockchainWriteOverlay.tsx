"use client";

import { ReactNode } from 'react';

export interface BlockchainWriteOverlayProps {
  show: boolean;
  title?: string;
  subtitle?: string;
  backdropSrc?: string;
  multiLayer?: boolean;
  children?: ReactNode;
  onComplete?: () => void;
  className?: string;
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
  if (!show) return null;

  const isWebm = backdropSrc?.endsWith('.webm');

  return (
    <div
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
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
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

      <div
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
          animation: 'scaleIn 0.3s ease-out 0.1s both',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              border: '3px solid rgba(0, 255, 200, 0.2)',
              borderTopColor: '#00ff88',
              borderRadius: '50%',
              animation: 'spin 2s linear infinite',
            }}
          />
        </div>

        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#00ff88',
            margin: '0 0 12px 0',
            fontFamily: 'monospace',
            letterSpacing: '1px',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        >
          {title}
        </h2>

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

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00ff88',
                animation: `bounce 0.8s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {children && (
          <div
            style={{
              marginTop: '24px',
              animation: 'fadeIn 0.6s ease-in-out 0.3s both',
            }}
          >
            {children}
          </div>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '40px',
          height: '40px',
          border: '2px solid rgba(0, 255, 150, 0.4)',
          zIndex: 1,
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '60px',
          height: '60px',
          border: '2px solid rgba(0, 255, 150, 0.4)',
          zIndex: 1,
          animation: 'pulse 2s ease-in-out infinite 0.5s',
        }}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            transform: scale(0.9);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
