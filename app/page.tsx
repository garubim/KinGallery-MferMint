'use client';

import MagicMintButton from './components/MagicMintButton';
import ArtworkMetadata from './components/ArtworkMetadata';
import Chassis from './components/Chassis';
import { useEffect, useState } from 'react';
import { useDisconnect } from 'wagmi';
import sdk from '@farcaster/miniapp-sdk';
import { getIPFSUrl, KNOWN_CIDs } from '@/lib/ipfs-helper';

export default function Page() {
  const { disconnect } = useDisconnect();
  const [showSplash, setShowSplash] = useState(false); // TODO: true para deploy
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoSlow, setVideoSlow] = useState(false);

  const handleDismissSplash = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    // Avisa se o vídeo está demorando muito
    const slowTimer = setTimeout(() => {
      if (!videoLoaded && !videoError) {
        setVideoSlow(true);
      }
    }, 4000); // 4 segundos

    return () => clearTimeout(slowTimer);
  }, [videoLoaded, videoError]);

  useEffect(() => {
    // SDK carrega em background sem bloquear render
    if (typeof window !== 'undefined') {
      sdk.actions.ready()
        .then(() => console.log('✅ Farcaster SDK ready'))
        .catch(() => console.warn('⚠️ SDK não disponível (app funciona normalmente)'));
    }

    // Timeout único - fecha splash após 4s
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <Chassis>
        <div className="splash-container">
          <button 
            onClick={handleDismissSplash} 
            className="splash-close-btn"
            aria-label="Close splash"
          >
            ✕
          </button>

          <div className="splash-logo">
            <img src="/icon.png" alt="KinGallery" style={{ width: '90px', height: '90px', borderRadius: '20px' }} />
          </div>
          
          <div className="loading-spinner"></div>
          
          <div className="splash-actions">
            <button 
              onClick={handleDismissSplash} 
              className="action-btn primary"
            >
              Save the Ritual
            </button>
          </div>
        </div>
        <style jsx>{`
          .splash-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            height: 100vh;
            gap: 30px;
            padding: 20px;
            padding-bottom: 140px;
            background-color: #05080a;
            background-image: url('/splash.png');
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            background-attachment: fixed;
            z-index: 9999;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }

          .splash-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            z-index: 10;
          }

          .splash-close-btn:hover {
            color: white;
          }

          .splash-actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            width: 100%;
            justify-content: center;
          }

          .action-btn {
            padding: 15px 48px;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s ease;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }

          .primary { 
            background: #1a3a52;
            color: white;
          }

          .primary:hover {
            background: #224455;
            transform: scale(1.02);
          }

          .primary:active {
            transform: scale(0.98);
          }

          .loading-spinner {
            width: 30px;
            height: 30px;
            border: 2px solid rgba(255,255,255,0.1);
            border-top-color: #0069ff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .splash-logo {
            animation: pulse 2s infinite ease-in-out;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
          }
        `}</style>
      </Chassis>
    );
  }

  return (
    <Chassis>
      <div className="page-container">
        <header className="header">
          <h1 className="title">KinGallery</h1>
          <p className="concept">
            The art isn't in the spin;<br />
            it's in that precise <span className="bold-moment">moment of recognition</span>
          </p>
        </header>

        <main className="main-content">
          <div className="artwork-section">
            <div className="artwork-display">
              {/* IPFS file is animated WebP (not MP4) - using img tag */}
              <img
                src={getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK)}
                alt="Mfer artwork - animated loop"
                className="main-video"
                onLoad={() => {
                  console.log('✅ Artwork carregou!');
                  setVideoLoaded(true);
                }}
                onError={(e) => {
                  console.error('❌ Error loading artwork:', e);
                  // Try fallback gateway
                  const img = e.target as HTMLImageElement;
                  if (!img.src.includes('ipfs.io')) {
                    img.src = 'https://ipfs.io/ipfs/' + KNOWN_CIDs.MFER_ARTWORK;
                  } else {
                    setVideoError(true);
                  }
                }}
              />
              
              {/* Ícone Fullscreen */}
              <button 
                className="fullscreen-btn-home"
                onClick={() => window.open(getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK), '_blank')}
                title="View full size"
              >
                ⛶
              </button>
              
              {!videoLoaded && !videoError && (
                <div className="video-loading">
                  <p>Loading artwork...</p>
                  <div className="loading-spinner"></div>
                  {videoSlow && (
                    <p className="loading-slow">
                      <small>(slow connection - please wait)</small>
                    </p>
                  )}
                </div>
              )}
              {videoError && (
                <div className="video-loading">
                  <p>Error loading video</p>
                </div>
              )}
              <div className="artwork-glow"></div>
            </div>
          </div>

          <div className="button-section">
            <MagicMintButton />
          </div>

          <ArtworkMetadata 
            showPricing={true} 
            isCompact={false}
            onDisconnect={() => {
              console.log('🔌 Disconnecting from ArtworkMetadata...');
              disconnect();
            }}
          />
        </main>
      </div>

      <style jsx>{`
        .page-container {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 8px 16px 24px 16px;
          max-width: 500px;
          margin: 0 auto;
          justify-content: space-between;
          overflow-y: auto;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .page-container::before {
          content: '';
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(640px, 98vw);
          height: min(98vh, 1100px);
          /* Petrogreen: */
          background: url('/walls/disc-wall-gold.webp') center/cover no-repeat;
          /* Opções: brightgold | blue | dark-blue | blue-grey | gold | black */
          opacity: 0.6;
          z-index: -1;
          border-radius: 20px;
        }

        .header {
          text-align: center;
          padding-top: 20px;
          padding-bottom: 8px;
          position: relative;
          z-index: 10;
        }

        .title {
          font-size: 1.3rem;
          margin: 0;
          margin-bottom: 8px;
          color: rgba(255, 224, 192, 0.85);
          font-weight: 700;
          letter-spacing: 0.05em;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          text-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.8),
            0 2px 4px rgba(0, 0, 0, 0.6),
            0 4px 8px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(255, 255, 255, 0.1);
        }

        .concept {
          color:  hsla(40, 100%, 92%, 0.50);
          font-size: 0.95rem;
          margin: 0;
          letter-spacing: 0.02em;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 500;
          line-height: 1.5;
          font-style: italic;
        }

        .bold-moment {
          font-weight: 700;
          color: hsla(40, 100%, 92%, 0.50);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          width: 100%;
          padding: 0;
          margin-top: -10mm;
        }

        .artwork-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .button-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          flex-direction: column;
        }

        .artwork-display {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          max-width: 450px;
          margin-top: 50px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 20px 50px rgba(0,0,0,0.8);
          border: 8px solid #554b1b;
          background: #000;
        }

        .main-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
          position: relative;
          z-index: 1;
        }

        /* Botão Fullscreen Home */
        .fullscreen-btn-home {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 32px;
          height: 30px;
          background: transparent;
          backdrop-filter: blur(06px);
          border: 1px solid rgba(243, 232, 171, 0.3);
          border-radius: 8px;
          color: rgba(242, 226, 167, 0.7);
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }

        .fullscreen-btn-home:hover {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }

        .video-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: rgba(255, 229, 200, 0.5);
          font-size: 0.9rem;
          z-index: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }

        .video-loading p {
          margin: 0;
          font-size: 0.85rem;
        }

        .loading-slow {
          color: rgba(251, 228, 209, 0.4);
          font-size: 0.75rem;
          margin-top: 8px;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-top-color: rgba(255, 204, 0, 0.6);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .artwork-glow {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 60px rgba(0,0,0,0.6);
          pointer-events: none;
        }
      `}</style>
    </Chassis>
  );
}
