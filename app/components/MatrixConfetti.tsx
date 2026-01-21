"use client";

import { useEffect, useState } from 'react';

/**
 * Matrix Confetti Effect
 * 
 * Animação de celebração durante o sucesso do mint
 * - Caracteres Matrix caindo como confete (CSS animations)
 * - Efeito de "celebração" visual
 * - Desaparece após 3-4 segundos
 */

interface MatrixParticle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  char: string;
}

const MATRIX_CHARS = ['0', '1', 'Ⓜ️', 'Ⓣ️', 'Ⓡ️', 'Ⓘ️', 'Ⓧ️'];

export default function MatrixConfetti() {
  const [particles, setParticles] = useState<MatrixParticle[]>([]);

  useEffect(() => {
    // Gera partículas de confete Matrix
    const generatedParticles: MatrixParticle[] = Array.from(
      { length: 40 },
      (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 2 + Math.random() * 1.5,
        char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
      })
    );

    setParticles(generatedParticles);

    // Remove confete após 4 segundos
    const timer = setTimeout(() => {
      setParticles([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <style jsx>{`
        @keyframes matrixFall {
          0% {
            opacity: 1;
            transform: translateY(-20px) translateX(0px) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(${typeof window !== 'undefined' ? window.innerHeight + 100 : 1000}px) translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg);
          }
        }
        @keyframes glowPulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes backdropBlur {
          0% {
            opacity: 0;
            background: rgba(0, 255, 136, 0);
          }
          100% {
            opacity: 1;
            background: rgba(0, 255, 136, 0.05);
          }
        }
      `}</style>

      {/* Backdrop blur effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          animation: 'backdropBlur 0.4s ease-out forwards',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Matrix particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'fixed',
            left: `${particle.left}%`,
            top: '0',
            fontSize: '24px',
            fontWeight: 700,
            color: '#00ff88',
            textShadow: '0 0 10px #00ff88',
            fontFamily: 'monospace',
            lineHeight: 1,
            animation: `matrixFall ${particle.duration}s ease-in forwards`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.char}
        </div>
      ))}

      {/* Glow effect center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(0,255,136,0.2) 0%, rgba(0,255,136,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'glowPulse 0.6s ease-out forwards',
        }}
      />
    </div>
  );
}
