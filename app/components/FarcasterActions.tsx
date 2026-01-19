'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';

export default function FarcasterActions() {
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    const getContext = async () => {
      const ctx = await sdk.context;
      setContext(ctx);
    };
    getContext();
  }, []);

  const handleShare = async () => {
    try {
      window.open(`https://warpcast.com/compose?text=Check out my art on KinGallery!&embeds[]=https://kingallery.netlify.app`, '_blank');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleClose = () => {
    sdk.actions.close();
  };

  // ⚠️ TEMPORÁRIO: Sempre mostra botões para teste
  // TODO: Adicionar verificação isMiniKit quando disponível
  // if (!isMiniKit) return null;

  return (
    <div className="actions-container">
      <button onClick={handleShare} className="action-btn share">
        <span className="icon">✦</span> share a 9'-0'Smile
      </button>
      <div className="divider" />
      <button onClick={handleClose} className="action-btn close">
        Close
      </button>

      <style jsx>{`
        .actions-container {
          display: flex; 
          gap: 10px; 
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 35px rgba(0,0,0,0.4);
          transition: all 0.3s ease;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .actions-container:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .action-btn {
          padding: 10px 20px; 
          background: transparent; 
          color: #fff; 
          border: none; 
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .action-btn.share {
          color: #0069ff;
        }

        .action-btn.share:hover {
          color: #3385ff;
          text-shadow: 0 0 15px rgba(0, 105, 255, 0.4);
        }

        .action-btn.close {
          color: rgba(255, 255, 255, 0.4);
        }

        .action-btn.close:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .icon {
          font-size: 1.1rem;
        }

        .divider {
          width: 1px; 
          background: rgba(255,255,255,0.1); 
          height: 20px; 
          align-self: center;
        }
      `}</style>
    </div>
  );
}