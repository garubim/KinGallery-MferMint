'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Chassis from '../components/Chassis';
import { getIPFSUrl, KNOWN_CIDs } from '@/lib/ipfs-helper';

export default function GalleryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = searchParams.get('tokenId');
    if (id) {
      setTokenId(id);
    }
  }, [searchParams]);

  const handleBack = () => {
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <Chassis>
      <div className="gallery-container">
        {/* Navigation - Back Button */}
        <button onClick={handleBack} className="back-button" aria-label="Voltar para página 1">
          <span className="back-arrow">←</span>
          <span className="back-label">voltar</span>
        </button>

        {/* Construction Notice */}
        <div className="construction-banner">
          <div className="banner-icon">🔨</div>
          <div className="banner-text">
            <h2>Galeria em Construção</h2>
            <p>Seus mints apareçam aqui em breve</p>
          </div>
        </div>

        {/* Recent Mint Display */}
        <section className="recent-mint-section">
          <h3 className="section-title">Seu Mint Recente</h3>
          <div className="artwork-display">
            {/* IPFS file is animated WebP */}
            <img 
              src={getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK)}
              alt="Mfer artwork"
              className="featured-video"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="artwork-glow"></div>
            <div className="mint-info">
              <p className="mint-hash">Mfer-{tokenId ? String(tokenId).padStart(3, '0') : '—'}-'base</p>
              <p className="mint-status">{tokenId ? 'Mintado agora' : 'Carregando...'}</p>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="gallery-section">
          <h3 className="section-title">Seus Mints</h3>
          <div className="gallery-grid">
            <div className="gallery-placeholder">
              <div className="placeholder-icon">🎨</div>
              <p>Nenhum mint ainda</p>
            </div>
          </div>
        </section>

        {/* Navigation to Page 1 */}
        <div className="page-nav">
          <span className="current-page">pag 2</span>
        </div>
      </div>

      <style jsx>{`
        .gallery-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 60px 20px 100px 20px;
          max-width: 500px;
          margin: 0 auto;
          overflow-y: auto;
          gap: 30px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Back Button */
        .back-button {
          position: fixed;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.3s ease;
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .back-arrow {
          font-size: 1.2rem;
        }

        .back-label {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Construction Banner */
        .construction-banner {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(0, 105, 255, 0.1) 0%, rgba(39, 161, 123, 0.1) 100%);
          border: 1px solid rgba(0, 105, 255, 0.2);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .banner-icon {
          font-size: 2rem;
        }

        .banner-text h2 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: #0069ff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .banner-text p {
          margin: 4px 0 0 0;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Section Title */
        .section-title {
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Recent Mint Section */
        .recent-mint-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .artwork-display {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          max-width: 320px;
          margin: 0 auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 20px 50px rgba(0,0,0,0.8);
          border: 8px solid #0a0f1a;
          background: #000;
        }

        .featured-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }

        .artwork-glow {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 60px rgba(0,0,0,0.6);
          pointer-events: none;
        }

        .mint-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        .mint-hash {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #0069ff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .mint-status {
          margin: 0;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Gallery Section */
        .gallery-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
        }

        .gallery-placeholder {
          aspect-ratio: 3/4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 2px dashed rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          gap: 8px;
          padding: 16px;
          text-align: center;
          grid-column: 1 / -1;
          min-height: 200px;
        }

        .placeholder-icon {
          font-size: 2rem;
          opacity: 0.4;
        }

        .gallery-placeholder p {
          margin: 0;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Page Navigation */
        .page-nav {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .current-page {
          padding: 4px 12px;
          background: rgba(0, 105, 255, 0.1);
          border: 1px solid rgba(0, 105, 255, 0.2);
          border-radius: 12px;
          color: #0069ff;
        }
      `}</style>
    </Chassis>
  );
}
