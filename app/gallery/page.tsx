'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getIPFSUrl, KNOWN_CIDs } from '@/lib/ipfs-helper';
import MagicMintButton from '@/app/components/MagicMintButton';

interface MintCard {
  tokenId: number;
  ethMferId: number;
  txHash: string;
}

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [ethMferId, setEthMferId] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false); // Começa FALSE, ativa com delay de 1s
  const [revealEntangled, setRevealEntangled] = useState(false);
  const [allMints, setAllMints] = useState<MintCard[]>([]);
  const [loadingMints, setLoadingMints] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tx = searchParams.get('tx');
    const ethMfer = searchParams.get('ethMferId');
    const collision = searchParams.get('collision');
    
    console.log('📍 Gallery Page Mounted:', { tx, ethMfer, collision });
    
    if (ethMfer) {
      setEthMferId(parseInt(ethMfer));
    }

    // Usa token ID do mint (sempre começa em 0, incrementa com cada mint)
    // Busca do localStorage quantos mints já foram feitos
    try {
      const existingMints = JSON.parse(localStorage.getItem('mferMints') || '[]');
      const currentTokenId = existingMints.length - 1; // Último mint é o atual
      setTokenId(currentTokenId >= 0 ? currentTokenId : 0);
    } catch {
      setTokenId(0); // Fallback
    }

    // 🚀 OPÇÃO B TIMING: Delay confetti by 1s for smooth page entry
    // Timeline de revelação:
    // 0-1s: Página entra sem animação (confetti desligado)
    // 1-4s: Confeti animado por 3s
    // 4-10.5s: Reveal + countdown completo
    setTimeout(() => setShowConfetti(true), 1000); // Confete COMEÇA após 1s (não imediatamente)
    setTimeout(() => setShowConfetti(false), 4000); // Confete para após 3s de animação
    setTimeout(() => setRevealEntangled(true), 5000); // Reveal após 5s total
  }, [searchParams]);

  // Carrega mints do localStorage (simulando rede)
  useEffect(() => {
    if (!mounted || !revealEntangled) return;
    
    setLoadingMints(true);
    setTimeout(() => {
      try {
        const mints = JSON.parse(localStorage.getItem('mferMints') || '[]');
        const mintCards: MintCard[] = mints.map((mint: any) => ({
          tokenId: mint.tokenId || 1,
          ethMferId: mint.ethMferId || 1,
          txHash: mint.hash || ''
        }));
        setAllMints(mintCards);
      } catch (error) {
        console.error('Erro ao carregar mints:', error);
      }
      setLoadingMints(false);
    }, 500); // Simula latência de rede
  }, [mounted, revealEntangled]);

  if (!mounted) return null;

  return (
    <div className="gallery-page">
      {/* Botão voltar para home */}
      <a href="/" className="back-to-home">
        ← Back to Home
      </a>

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

      {/* Metadata Info */}
      {revealEntangled && (
        <section className="metadata-section">
          <div className="metadata-info">
            <p className="metadata-label">Transaction</p>
            <p className="metadata-value tx-hash">{searchParams.get('tx')?.slice(0, 10)}...{searchParams.get('tx')?.slice(-8)}</p>
            <a 
              href={`https://basescan.org/tx/${searchParams.get('tx')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="view-link"
            >
              view on basescan
            </a>
          </div>
        </section>
      )}

      {/* Mosaico de Mints - Carregado após Reveal */}
      {revealEntangled && (
        <section className="mosaic-section">
          <h3 className="mosaic-title">All Your Mints</h3>
          
          {loadingMints ? (
            <div className="mosaic-loading">
              <div className="spinner-small"></div>
              <p>Loading mints...</p>
            </div>
          ) : allMints.length > 0 ? (
            <div className="mosaic-grid">
              {allMints.map((mint, idx) => (
                <div key={idx} className="mint-card">
                  <div className="mint-card-image">
                    <img 
                      src={getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK)}
                      alt={`Mfer #${mint.ethMferId}`}
                    />
                    <div className="mint-card-overlay">
                      <p className="mint-card-number">#{mint.ethMferId}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mosaic-empty">
              <p>No mints yet</p>
            </div>
          )}
        </section>
      )}

      {/* Magic Button - Mint Another */}
      {mounted && revealEntangled && (
        <section className="mint-another-section">
          <MagicMintButton />
        </section>
      )}

      <style jsx>{`
        .gallery-page {
          min-height: 100vh;
          background: linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%), url('/walls/disc-wall-brightgold.webp');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: white;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
          animation: slideInFromLeft 0.8s ease-in-out forwards;
        }

        .back-to-home {
          position: absolute;
          top: 20px;
          left: 20px;
          color: #00e6ff;
          text-decoration: none;
          font-size: 14px;
          padding: 8px 12px;
          border: 1px solid rgba(0, 230, 255, 0.3);
          border-radius: 4px;
          transition: all 0.3s ease;
          z-index: 100;
        }

        .back-to-home:hover {
          color: #fff;
          background: rgba(0, 230, 255, 0.1);
          border-color: rgba(0, 230, 255, 0.6);
        }

        @keyframes slideInFromLeft {
          from { 
            transform: translateX(100vw);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
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

        /* Metadata */
        .metadata-section {
          max-width: 600px;
          margin: 60px auto 0;
          padding: 40px 20px;
          text-align: center;
          border-top: 1px solid rgba(0, 230, 255, 0.2);
        }

        .metadata-info {
          padding: 20px;
        }

        .metadata-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .metadata-value {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          word-break: break-all;
          margin-bottom: 12px;
        }

        .view-link {
          color: #00e6ff;
          text-decoration: none;
          font-size: 13px;
          transition: opacity 0.3s;
          cursor: pointer;
        }

        .view-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        /* Mosaic Section */
        .mosaic-section {
          max-width: 800px;
          margin: 80px auto 0;
          padding: 60px 20px 40px;
          border-top: 1px solid rgba(0, 230, 255, 0.2);
        }

        .mosaic-title {
          font-size: 24px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 32px;
          text-align: center;
        }

        .mosaic-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
          animation: fadeInUp 0.8s ease;
        }

        .mint-card {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mint-card:hover {
          transform: scale(1.05);
        }

        .mint-card-image {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: rgba(0, 230, 255, 0.1);
          border: 1px solid rgba(0, 230, 255, 0.3);
          border-radius: 12px;
        }

        .mint-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .mint-card:hover .mint-card-image img {
          transform: scale(1.1);
        }

        .mint-card-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          padding: 12px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .mint-card:hover .mint-card-overlay {
          opacity: 1;
        }

        .mint-card-number {
          font-size: 16px;
          font-weight: 700;
          color: #00e6ff;
          margin: 0;
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }

        .mosaic-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 60px 20px;
          text-align: center;
        }

        .spinner-small {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(0, 230, 255, 0.2);
          border-top-color: #00e6ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .mosaic-loading p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .mosaic-empty {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 16px;
        }

        /* Magic Button Section */
        .mint-another-section {
          margin-top: 80px;
          padding-top: 40px;
          border-top: 1px solid rgba(0, 230, 255, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 600px;
        }
      `}</style>
    </div>
  );
}
