'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getIPFSUrl, KNOWN_CIDs } from '@/lib/ipfs-helper';

export default function GalleryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [ethMferId, setEthMferId] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [revealEntangled, setRevealEntangled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tx = searchParams.get('tx');
    const ethMfer = searchParams.get('ethMferId');
    
    if (ethMfer) {
      setEthMferId(parseInt(ethMfer));
    }

    // Busca tokenId da transação
    if (tx) {
      // TODO: fetch tokenId from transaction logs
      setTokenId(1); // Placeholder
    }

    // Timeline de revelação
    setTimeout(() => setShowConfetti(false), 3000); // Confete por 3s
    setTimeout(() => setRevealEntangled(true), 4000); // Reveal após 4s
  }, [searchParams]);

  if (!mounted) return null;

  return (
    <div className="gallery-page">
      {/* Confete Matrix */}
      {showConfetti && (
        <div className="confetti-overlay">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['0', '1', '█', '▓', '▒', '░'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      {/* Hero Section - NFT Mintado */}
      <section className="hero-section">
        <div className="hero-title">
          <h1>Your Mark is Recorded</h1>
          <p className="hero-subtitle">Mfer-0-Base #{tokenId || '...'} / 1000</p>
        </div>

        <div className="nft-display">
          <div className="nft-frame">
            <img 
              src={getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK)}
              alt="Your Mfer"
              className="nft-artwork"
            />
            <div className="frame-glow"></div>
          </div>
        </div>
      </section>

      {/* Entanglement Reveal */}
      <section className={`entanglement-section ${revealEntangled ? 'revealed' : ''}`}>
        {!revealEntangled ? (
          <div className="mystery-state">
            <div className="mystery-icon">🌀</div>
            <p className="mystery-text">Discovering your entangled Mfer...</p>
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="reveal-state">
            <div className="reveal-header">
              <h2>Entangled with</h2>
            </div>
            
            <div className="entangled-card">
              <div className="entangled-glow"></div>
              <div className="entangled-content">
                <div className="entangled-icon">⚡</div>
                <h3 className="entangled-title">Ethereum Mfer #{ethMferId || '???'}</h3>
                <p className="entangled-subtitle">From the original lineage (2021)</p>
              </div>
            </div>

            <div className="destiny-message">
              <p>The soul spins at a base —</p>
              <p>where the smile comes home.</p>
            </div>
          </div>
        )}
      </section>

      {/* Actions */}
      {revealEntangled && (
        <section className="actions-section">
          <button onClick={() => router.push('/')} className="action-btn primary">
            Mint Another
          </button>
          <button 
            onClick={() => window.open(`https://basescan.org/tx/${searchParams.get('tx')}`, '_blank')}
            className="action-btn secondary"
          >
            View on BaseScan
          </button>
        </section>
      )}

      <style jsx>{`
        .gallery-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
          color: white;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }

        /* Confete */
        .confetti-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1000;
        }

        .confetti-particle {
          position: absolute;
          top: -20px;
          font-size: 24px;
          color: rgba(0, 230, 255, 0.8);
          animation: fall linear forwards;
        }

        @keyframes fall {
          to { 
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Hero Section */
        .hero-section {
          max-width: 600px;
          margin: 0 auto 60px;
          text-align: center;
        }

        .hero-title h1 {
          font-size: 42px;
          font-weight: 700;
          background: linear-gradient(135deg, #00e6ff, #0052ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
        }

        .hero-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
        }

        .nft-display {
          margin-top: 40px;
        }

        .nft-frame {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
          border: 2px solid rgba(0, 230, 255, 0.3);
        }

        .nft-artwork {
          width: 100%;
          height: auto;
          display: block;
        }

        .frame-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(0, 230, 255, 0.3), transparent);
          animation: pulse-glow 3s ease infinite;
          pointer-events: none;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        /* Entanglement Section */
        .entanglement-section {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
          transition: all 0.8s ease;
        }

        .mystery-state {
          text-align: center;
          padding: 60px 20px;
        }

        .mystery-icon {
          font-size: 64px;
          animation: spin 2s linear infinite;
          margin-bottom: 24px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .mystery-text {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 32px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(0, 230, 255, 0.2);
          border-top-color: #00e6ff;
          border-radius: 50%;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        }

        /* Reveal State */
        .reveal-state {
          animation: fadeInUp 0.8s ease;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reveal-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .reveal-header h2 {
          font-size: 28px;
          color: rgba(255, 255, 255, 0.8);
        }

        .entangled-card {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(0, 230, 255, 0.4);
          border-radius: 24px;
          padding: 48px 32px;
          text-align: center;
          overflow: hidden;
        }

        .entangled-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(0, 230, 255, 0.2), transparent);
          animation: glow-pulse 2s ease infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .entangled-content {
          position: relative;
          z-index: 1;
        }

        .entangled-icon {
          font-size: 56px;
          margin-bottom: 16px;
        }

        .entangled-title {
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #00e6ff, #ff00e6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .entangled-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
        }

        .destiny-message {
          margin-top: 40px;
          text-align: center;
          font-size: 20px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
        }

        /* Actions */
        .actions-section {
          max-width: 600px;
          margin: 60px auto 0;
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #00e6ff, #0052ff);
          color: white;
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 230, 255, 0.4);
        }

        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        .action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
}
