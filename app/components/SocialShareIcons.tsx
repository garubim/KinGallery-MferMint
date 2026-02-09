'use client';

import { useState } from 'react';

/**
 * 🔗 Social Share Icons for Gallery Page
 * 
 * Displays clickable social media icons for sharing mint + entanglement info
 * Includes special Farcaster button positioned at top
 */
export default function SocialShareIcons({ 
  tokenId, 
  ethMferId, 
  transactionHash 
}: { 
  tokenId?: number;
  ethMferId?: number;
  transactionHash?: string;
}) {
  const [copied, setCopied] = useState(false);

  // Generate share text for entanglement
  const shareText = `Just minted Token #${tokenId} entangled with Ethereum Mfer #${ethMferId} on @KinGallery! 🔮 

Each mint creates magic for the next person in an eternal circle. Revolutionary collaborative NFT system on @base 🔵

#Entanglement #CollaborativeNFT #Base`;

  const shareUrl = `https://kingallery.netlify.app/gallery?tokenId=${tokenId}`;
  
  const handleShare = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'x':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so copy to clipboard
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      case 'farcaster':
        url = `https://warpcast.com/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=550,height=420');
    }
  };

  if (!tokenId || !ethMferId) return null;

  return (
    <>
      {/* 🎭 FARCASTER BUTTON - TOP POSITION */}
      <div className="farcaster-top-share">
        <button 
          onClick={() => handleShare('farcaster')}
          className="farcaster-share-btn"
        >
          🎭 Share on Farcaster
        </button>
      </div>

      {/* 📱 OTHER SOCIAL ICONS - BOTTOM/SIDEBAR */}
      <div className="social-share-icons">
        <div className="share-label">Share your entanglement:</div>
        
        <div className="icons-row">
          <button 
            onClick={() => handleShare('x')}
            className="share-icon x-icon"
            title="Share on X (Twitter)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>

          <button 
            onClick={() => handleShare('telegram')}
            className="share-icon telegram-icon"
            title="Share on Telegram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.820 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </button>

          <button 
            onClick={() => handleShare('instagram')}
            className={`share-icon instagram-icon ${copied ? 'copied' : ''}`}
            title={copied ? 'Copied to clipboard!' : 'Copy for Instagram'}
          >
            {copied ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            )}
          </button>
        </div>
        
        {copied && (
          <div className="copy-feedback">
            ✅ Copied! Paste in Instagram Stories
          </div>
        )}
      </div>

      <style jsx>{`
        .farcaster-top-share {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .farcaster-share-btn {
          background: linear-gradient(135deg, #8B5CF6, #06B6D4);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(139,92,246,0.3);
        }
        
        .farcaster-share-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139,92,246,0.4);
        }
        
        .social-share-icons {
          margin: 20px 0;
          padding: 16px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .share-label {
          color: #B0C4DE;
          font-size: 14px;
          margin-bottom: 12px;
          text-align: center;
        }
        
        .icons-row {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        
        .share-icon {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #B0C4DE;
        }
        
        .share-icon:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        .x-icon:hover {
          background: #1DA1F2;
          color: white;
          border-color: #1DA1F2;
        }
        
        .telegram-icon:hover {
          background: #0088cc;
          color: white;
          border-color: #0088cc;
        }
        
        .instagram-icon:hover {
          background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
          color: white;
          border-color: #bc1888;
        }
        
        .instagram-icon.copied {
          background: #22c55e;
          color: white;
          border-color: #22c55e;
        }
        
        .copy-feedback {
          text-align: center;
          margin-top: 8px;
          color: #22c55e;
          font-size: 12px;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .farcaster-top-share {
            top: 10px;
            right: 10px;
          }
          
          .farcaster-share-btn {
            padding: 10px 16px;
            font-size: 13px;
          }
          
          .icons-row {
            gap: 12px;
          }
          
          .share-icon {
            width: 44px;
            height: 44px;
          }
        }
      `}</style>
    </>
  );
};