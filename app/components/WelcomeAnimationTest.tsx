"use client";

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

/**
 * 🎬 WELCOME ANIMATION TEST COMPONENT
 * 
 * Compara e testa as duas versões:
 * 1. WebP Animado (3.5MB) - Simples, mas pesado
 * 2. WebM Dividido em 2 partes (566KB total) - Leve, mas precisa de sincronização
 * 
 * Vamos testar ambas e ver qual fica melhor na prática
 */

type AnimationVersion = 'webp' | 'webm-sequential' | 'webm-split';

export default function WelcomeAnimationTest() {
  const [version, setVersion] = useState<AnimationVersion>('webp');
  const [webmPart, setWebmPart] = useState<1 | 2>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fileSize, setFileSize] = useState<string>('');

  useEffect(() => {
    // Simula carregamento de metadados dos arquivos
    // WebP: 3.5MB = 3500KB
    // WebM Part 1: ~283KB
    // WebM Part 2: ~283KB

    if (version === 'webp') {
      setFileSize('3.5 MB (WebP Animated)');
    } else if (version === 'webm-sequential' || version === 'webm-split') {
      setFileSize('566 KB total (2x WebM)');
    }
  }, [version]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
        padding: '40px 20px',
        fontFamily: 'Inter, sans-serif',
        color: '#fff',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>
          🎬 Welcome Animation Test
        </h1>
        <p style={{ margin: '0', opacity: 0.7, fontSize: '14px' }}>
          Comparing WebP vs WebM for optimal performance
        </p>
      </motion.div>

      {/* Main Test Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
        }}
      >
        {/* LEFT COLUMN: WebP Version */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            background: 'rgba(0, 255, 136, 0.05)',
            border: '2px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
          }}
        >
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#00ff88' }}>
            Option 1: WebP Animated
          </h2>

          {/* Animation Display */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '12px',
              marginBottom: '20px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {version === 'webp' && (
              <motion.img
                key="webp"
                src="/content/MagicButton-OfficialAnimatedTitels/WizButtonAnimatedTitles-official-7-JAN-WebP-animMax.webp"
                alt="Welcome Animation - WebP"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>

          {/* Info */}
          <div
            style={{
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '12px',
              marginBottom: '16px',
            }}
          >
            <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
              Características:
            </p>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>✅ Single file (simples de gerenciar)</li>
              <li>✅ Auto-loop nativo</li>
              <li>❌ Tamanho: 3.5 MB (pesado)</li>
              <li>📊 Qualidade: Excelente</li>
              <li>⚡ Performance: ⭐⭐⭐ (OK)</li>
            </ul>
          </div>

          <button
            onClick={() => setVersion('webp')}
            style={{
              width: '100%',
              padding: '12px',
              background:
                version === 'webp'
                  ? 'rgba(0, 255, 136, 0.3)'
                  : 'rgba(0, 255, 136, 0.1)',
              border: '2px solid rgba(0, 255, 136, 0.5)',
              color: '#00ff88',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 136, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                version === 'webp'
                  ? 'rgba(0, 255, 136, 0.3)'
                  : 'rgba(0, 255, 136, 0.1)';
            }}
          >
            Test WebP Version
          </button>
        </motion.div>

        {/* RIGHT COLUMN: WebM Sequential */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            background: 'rgba(100, 200, 255, 0.05)',
            border: '2px solid rgba(100, 200, 255, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
          }}
        >
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#64c8ff' }}>
            Option 2: WebM Sequential (2 parts)
          </h2>

          {/* Animation Display */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '12px',
              marginBottom: '20px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {version === 'webm-split' && (
              <WebMSequentialPlayer />
            )}
          </div>

          {/* Info */}
          <div
            style={{
              background: 'rgba(100, 200, 255, 0.1)',
              border: '1px solid rgba(100, 200, 255, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '12px',
              marginBottom: '16px',
            }}
          >
            <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
              Características:
            </p>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>✅ Muito leve: 566 KB (vs 3.5 MB)</li>
              <li>✅ Melhor performance</li>
              <li>⚠️ 2 arquivos (precisa de sincronização)</li>
              <li>⚠️ Emenda visível entre partes?</li>
              <li>📊 Qualidade: Excelente (ProRes 4444)</li>
              <li>⚡ Performance: ⭐⭐⭐⭐⭐ (Ótimo)</li>
            </ul>
          </div>

          <button
            onClick={() => setVersion('webm-split')}
            style={{
              width: '100%',
              padding: '12px',
              background:
                version === 'webm-split'
                  ? 'rgba(100, 200, 255, 0.3)'
                  : 'rgba(100, 200, 255, 0.1)',
              border: '2px solid rgba(100, 200, 255, 0.5)',
              color: '#64c8ff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(100, 200, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                version === 'webm-split'
                  ? 'rgba(100, 200, 255, 0.3)'
                  : 'rgba(100, 200, 255, 0.1)';
            }}
          >
            Test WebM Sequential
          </button>
        </motion.div>
      </motion.div>

      {/* File Size Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          padding: '24px',
          background: 'rgba(255, 200, 100, 0.05)',
          border: '2px solid rgba(255, 200, 100, 0.3)',
          borderRadius: '16px',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', color: '#ffc864' }}>
          📊 File Size Comparison
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', opacity: 0.8 }}>
              WebP Animated
            </p>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#ff6b6b',
              }}
            >
              3.5 MB
            </div>
          </div>

          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', opacity: 0.8 }}>
              WebM Sequential (2x)
            </p>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#51cf66',
              }}
            >
              566 KB (~84% savings!)
            </div>
          </div>
        </div>

        <p
          style={{
            margin: '16px 0 0 0',
            fontSize: '12px',
            opacity: 0.7,
            fontStyle: 'italic',
          }}
        >
          💡 WebM sequential economiza 6x no tamanho. Se a emenda é imperceptível,
          é a escolha óbvia para mobile.
        </p>
      </motion.div>

      {/* Test Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          padding: '24px',
          background: 'rgba(0, 255, 136, 0.05)',
          border: '2px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '16px',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', color: '#00ff88' }}>
          🎮 Test Controls
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '12px',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.4)',
              color: '#00ff88',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.4)',
              color: '#00ff88',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            🔄 Reset
          </button>

          <div
            style={{
              padding: '12px',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.4)',
              borderRadius: '8px',
              fontSize: '12px',
              textAlign: 'center',
              color: '#00ff88',
            }}
          >
            Current: {fileSize}
          </div>
        </div>
      </motion.div>

      {/* Analysis & Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          padding: '24px',
          background: 'rgba(200, 150, 255, 0.05)',
          border: '2px solid rgba(200, 150, 255, 0.3)',
          borderRadius: '16px',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', color: '#d0a0ff' }}>
          💡 Analysis & Recommendations
        </h3>

        <div style={{ fontSize: '13px', lineHeight: '1.8', opacity: 0.9 }}>
          <p>
            <strong>WebP Animado (3.5MB):</strong><br />
            ✅ Simples, nenhuma sincronização<br />
            ✅ Auto-loop nativo<br />
            ❌ Muito pesado para mobile<br />
            ❌ Pode causar delay em conexões lentas<br />
            📊 Use se: Apenas desktop, ou se a beleza justificar
          </p>

          <p style={{ marginTop: '16px' }}>
            <strong>WebM Sequential (566KB total):</strong><br />
            ✅ 84% mais leve (6x menor)<br />
            ✅ Ideal para mobile/low-bandwidth<br />
            ✅ ProRes 4444 = qualidade máxima<br />
            ⚠️ Precisa testar: emenda entre partes é visível?<br />
            📊 Use se: Emenda imperceptível (recomendado)
          </p>

          <p style={{ marginTop: '16px' }}>
            <strong>🏆 Minha recomendação:</strong><br />
            Teste o WebM sequential. Se a emenda entre parte 1 e 2 for
            imperceptível (o que é provável se você exportou cuidadosamente),
            é a escolha perfeita: leve, rápido, belle qualidade.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Component que toca os dois WebMs sequencialmente
 */
function WebMSequentialPlayer() {
  const [currentPart, setCurrentPart] = useState<1 | 2>(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    if (currentPart === 1) {
      setCurrentPart(2);
    } else {
      // Reinicia do início
      setCurrentPart(1);
    }
  };

  return (
    <video
      key={`webm-${currentPart}`}
      ref={videoRef}
      onEnded={handleVideoEnd}
      autoPlay
      muted
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    >
      <source
        src={
          currentPart === 1
            ? '/content/MagicButton-OfficialAnimatedTitels/MAGIC-BUTTON-TITLES-1ST-PART-01of02-WELCOME-PRORES-4444-HQ.webm'
            : '/content/MagicButton-OfficialAnimatedTitels/MAGIC-BUTTON-TITLES-1ST-PART-02of02-WELCOME-PRORES-4444-HQ.webm'
        }
        type="video/webm"
      />
      Your browser does not support the video tag.
    </video>
  );
}
