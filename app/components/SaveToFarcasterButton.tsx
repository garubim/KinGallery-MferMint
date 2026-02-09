'use client';

import { useState, useEffect } from 'react';

/**
 * 🚀 Save to Farcaster Button - Splash Screen Enhancement
 * 
 * Encourages users to save the app to their Farcaster for quick access
 * Improves retention and user engagement
 */
export default function SaveToFarcasterButton() {
  const [mounted, setMounted] = useState(false);
  const [isFarcaster, setIsFarcaster] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Detect if running inside Farcaster
    const checkFarcaster = () => {
      try {
        // Check for Farcaster-specific properties
        const isFarcasterFrame = 
          window.location !== window.parent.location || // In iframe
          document.referrer.includes('farcaster') ||
          document.referrer.includes('warpcast') ||
          navigator.userAgent.includes('FarcasterEmbed') ||
          window.location.search.includes('utm_source=farcaster');
        
        setIsFarcaster(isFarcasterFrame);
      } catch (e) {
        // Fallback - not in Farcaster
        setIsFarcaster(false);
      }
    };
    
    checkFarcaster();
  }, []);

  const handleSaveToFarcaster = () => {
    try {
      // Method 1: Try native Farcaster save (if available)
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'farcaster_save_app',
          appUrl: window.location.origin,
          appName: 'KinGallery',
          description: 'Collaborative NFT Minting with Entanglement Magic'
        }, '*');
      }
      
      // Method 2: Request user to save manually
      if (navigator.share) {
        navigator.share({
          title: 'KinGallery - Save this app!',
          text: 'Revolutionary collaborative NFT system. Each mint creates magic for the next person! 🔮',
          url: window.location.origin
        });
      } else {
        // Fallback: Copy URL + instructions
        navigator.clipboard.writeText(window.location.origin);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
      
    } catch (error) {
      console.warn('Save to Farcaster failed:', error);
      // Fallback: Copy URL
      navigator.clipboard.writeText(window.location.origin);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (!mounted || !isFarcaster) return null;

  return (
    <div className="save-to-farcaster-wrapper">
      <button 
        onClick={handleSaveToFarcaster}
        className={`save-btn ${saved ? 'saved' : ''}`}
        disabled={saved}
      >
        {saved ? (
          <>
            ✅ Saved!
          </>
        ) : (
          <>
            📎 Save to your Farcaster
          </>
        )}
      </button>
      
      <p className="save-subtitle">
        Quick access to collaborative minting magic ✨
      </p>

      <style jsx>{`
        .save-to-farcaster-wrapper {
          margin: 20px 0;
          text-align: center;
        }
        
        .save-btn {
          background: linear-gradient(135deg, #8B5CF6, #06B6D4, #10B981);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            0 4px 15px rgba(139,92,246,0.3),
            inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative;
          overflow: hidden;
          min-width: 240px;
        }
        
        .save-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255,255,255,0.2), 
            transparent);
          transition: left 0.5s;
        }
        
        .save-btn:hover::before {
          left: 100%;
        }
        
        .save-btn:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 8px 25px rgba(139,92,246,0.4),
            inset 0 1px 0 rgba(255,255,255,0.3);
        }
        
        .save-btn:active {
          transform: translateY(-1px);
        }
        
        .save-btn.saved {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          cursor: default;
        }
        
        .save-btn.saved:hover {
          transform: none;
          box-shadow: 0 4px 15px rgba(34,197,94,0.3);
        }
        
        .save-subtitle {
          margin-top: 8px;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .save-btn {
            padding: 14px 20px;
            font-size: 15px;
            min-width: 220px;
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .save-btn:not(.saved):hover {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};