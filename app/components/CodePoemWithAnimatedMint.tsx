"use client";

import { useEffect, useRef, useState } from 'react';
import CodePoemMintButton from './CodePoemMintButton';

/**
 * CodePoemWithAnimatedMint
 * 
 * Integração do CodePoem com o novo sistema de animação de texto.
 * O botão de mint agora responde com frases animadas (WebP + alpha)
 * em cada estado da transação.
 */

export default function CodePoemWithAnimatedMint({ 
  src, 
  poem 
}: { 
  src?: string; 
  poem?: string 
}) {
  const [open, setOpen] = useState(false);
  const defaultMatrix = '/code_poem-Matrix/Matrix Codepoem 2 Layers Blue&Green Curto half ProRes 4444+Alpha .webm';
  const videoSrc = src || process.env.NEXT_PUBLIC_CODEPOEM_WEBM || defaultMatrix || '/codepoem.webm';
  const text = poem || `/**\n * manifestoSoul — versão rápida\n * no núcleo da noite, o código respira\n * sussurros onchain dobram-se em loops\n * mintamos o echo e chamemos de lar\n */\nfunction manifestoSoul() external pure returns (string memory) {\n  return "eternal";\n}`;

  const chars = Array.from(text);
  const closeRef = useRef<HTMLDivElement | null>(null);
  const [mintMsg, setMintMsg] = useState<string | null>(null);
  const [buttonState, setButtonState] = useState<string>('idle');
  const isWebm = /\.webm($|\?)/i.test(videoSrc);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const handleMintSuccess = (metadata: any) => {
    setMintMsg('✨ Metadata downloaded to your device.');
    setTimeout(() => setMintMsg(null), 3000);
  };

  const handleMintError = (error: Error) => {
    setMintMsg(`❌ Error: ${error.message}`);
    setTimeout(() => setMintMsg(null), 3000);
  };

  return (
    <div>
      {open && (
        <div role="dialog" onClick={() => setOpen(false)} style={{
          position: 'fixed', 
          inset: 0, 
          display: 'grid', 
          placeItems: 'center', 
          background: 'rgba(0,0,0,0.55)', 
          zIndex: 5999
        }}>
          <div ref={closeRef} onClick={(e) => e.stopPropagation()} className="cp-stage" style={{
            width: 720, 
            maxWidth: '94vw', 
            height: '76vh', 
            maxHeight: '86vh', 
            padding: 0, 
            borderRadius: 14, 
            transform: 'translateZ(40px) rotateX(6deg)',
            background: 'linear-gradient(180deg, rgba(8,10,18,0.92), rgba(4,6,12,0.78))',
            boxShadow: '0 40px 120px rgba(0,0,0,0.7)', 
            color: '#fff', 
            overflow: 'hidden', 
            position: 'relative'
          }}>
            {/* Close button */}
            <button 
              onClick={() => setOpen(false)} 
              aria-label="close" 
              className="cp-close" 
              style={{ 
                position: 'absolute', 
                right: 12, 
                top: 12, 
                zIndex: 6, 
                background: 'transparent', 
                border: '1px solid rgba(255,255,255,0.06)', 
                color: '#fff', 
                padding: '6px 8px', 
                borderRadius: 8 
              }}
            >
              ✕
            </button>

            {/* Background media */}
            {isWebm ? (
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  pointerEvents: 'none' 
                }}
              />
            ) : (
              <img
                src={videoSrc}
                alt="CodePoem background"
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  pointerEvents: 'none' 
                }}
              />
            )}

            {/* Depth layer */}
            <div 
              className="cp-layer cp-layer-depth" 
              data-layer="depth" 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                zIndex: 1, 
                pointerEvents: 'none' 
              }} 
            />

            {/* Code layer */}
            <pre 
              className="cp-layer cp-layer-code" 
              aria-hidden 
              style={{ 
                position: 'absolute', 
                zIndex: 2, 
                inset: '6% 6% auto 6%', 
                margin: 0, 
                padding: '22px', 
                overflow: 'auto', 
                maxHeight: '62%', 
                background: 'rgba(0,0,0,0.12)', 
                borderRadius: 8 
              }}
            >
              {chars.map((ch, i) => (
                <span
                  key={`cp-${i}-${ch}`}
                  className="cp-char"
                  data-index={i}
                  style={{ 
                    display: 'inline-block', 
                    whiteSpace: 'pre', 
                    willChange: 'transform,opacity', 
                    animationDelay: `${i * 26}ms`, 
                    opacity: 0, 
                    transform: 'translateY(8px) scale(0.98)' 
                  }}
                >
                  {ch}
                </span>
              ))}
            </pre>

            {/* UI / Mint Area with Animated Button */}
            <div 
              className="cp-layer cp-layer-ui" 
              style={{ 
                position: 'absolute', 
                zIndex: 3, 
                left: 20, 
                right: 20, 
                bottom: 18, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-end', 
                pointerEvents: 'auto',
                gap: 16,
              }}
            >
              <div style={{ color: '#e6fff6', fontFamily: 'Inter, monospace', fontSize: 13 }}>
                <div style={{ fontWeight: 700 }}>manifestoSoul()</div>
                <div style={{ opacity: 0.85, marginTop: 6 }}>
                  Status: <span style={{ color: buttonState === 'success' ? '#00ff88' : '#fff' }}>
                    {buttonState}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <small>esc to close</small>
                </div>
                
                {/* The NEW Animated Mint Button */}
                <div style={{ width: 180 }}>
                  <CodePoemMintButton
                    poem={text}
                    onMintSuccess={handleMintSuccess}
                    onMintError={handleMintError}
                    onStateChange={(state) => {
                      setButtonState(state);
                      console.log(`🎯 Mint button state: ${state}`);
                    }}
                    size="md"
                    variant="glow"
                    debug={false}
                  />
                </div>
              </div>
            </div>

            {/* Status message */}
            {mintMsg && (
              <div 
                style={{ 
                  position: 'absolute', 
                  left: 20, 
                  top: 16, 
                  zIndex: 7, 
                  background: 'rgba(0,0,0,0.6)', 
                  padding: '8px 12px', 
                  borderRadius: 8, 
                  color: mintMsg.includes('✨') ? '#0ff' : '#f00',
                  fontFamily: 'monospace',
                  fontSize: 12,
                }}
              >
                {mintMsg}
              </div>
            )}

            <style>{`
              .cp-stage { --cp-accent: #00c6fb; }
              .cp-layer-code { color: #dff; font-family: Inter, monospace; font-size: 13px; line-height: 1.35; }
              .cp-char { transition: transform 360ms ease, opacity 300ms ease; }
              @keyframes cpCharIn { to { opacity: 1; transform: none; } }
              @media (prefers-reduced-motion: no-preference) {
                .cp-char { animation: cpCharIn 320ms cubic-bezier(.2,.9,.35,1) forwards; }
              }
              @media (prefers-reduced-motion: reduce) { 
                .cp-char { transition: none !important } 
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '12px 20px',
          borderRadius: 8,
          background: 'linear-gradient(90deg, #00c6fb, #005bea)',
          color: '#fff',
          border: 'none',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        Open CodePoem
      </button>
    </div>
  );
}
