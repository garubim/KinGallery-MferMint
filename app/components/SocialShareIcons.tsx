'use client';

import { useState } from 'react';

/**
 * 📤 Single Share Icon for Gallery Page
 * 
 * Single elegant icon that opens a modal with sharing options
 * Maintains single-button app philosophy 
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate share text for entanglement
  const shareText = tokenId && ethMferId 
    ? `Just minted Token #${tokenId} entangled with Ethereum Mfer #${ethMferId} on @KinGallery! 🔮 

Each mint creates magic for the next person in an eternal circle. Revolutionary collaborative NFT system on @base 🔵

#Entanglement #CollaborativeNFT #Base`
    : `Check out @KinGallery! 🔮 Revolutionary NFT collection with collaborative entanglement system.

Each mint creates magic for the next person in an eternal circle. Mint yours on @base 🔵

#KinGallery #Entanglement #Base`;

  const shareUrl = tokenId 
    ? `https://kingallery.netlify.app/gallery?tokenId=${tokenId}`
    : 'https://kingallery.netlify.app';

  // Handle share actions
  const handleFarcasterShare = () => {
    const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds%5B%5D=${encodeURIComponent(shareUrl)}`;
    window.open(farcasterUrl, '_blank');
    setIsModalOpen(false);
  };

  const handleXShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
    setIsModalOpen(false);
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
    setIsModalOpen(false);
  };

  const handleInstagramCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsModalOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      {/* 📤 Single Share Icon */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '20px',
        marginBottom: '10px' 
      }}>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: '12px',
            padding: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.filter = 'drop-shadow(0 6px 12px rgba(0, 230, 255, 0.4))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.filter = 'none';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          title="Share this mint"
        >
          <img 
            src="/icons/share-boxarrow.webp" 
            alt="Share" 
            style={{ 
              width: '28px', 
              height: '28px',
              filter: 'brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(20%) contrast(100%)',
              transition: 'all 0.3s ease',
            }} 
          />
        </button>
      </div>

      {/* 🔀 Share Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(5px)',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(40, 40, 60, 0.95) 100%)',
              borderRadius: '20px',
              padding: '25px',
              border: '1px solid rgba(0, 230, 255, 0.3)',
              backdropFilter: 'blur(20px)',
              maxWidth: '480px',
              width: '90%',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              color: '#00e6ff', 
              margin: '0 0 20px 0', 
              fontSize: '18px',
              fontWeight: 'bold' 
            }}>
              Share Your Mint 📤
            </h3>
            
            {/* Icons in a row */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '15px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleFarcasterShare}
                style={{
                  background: 'rgba(138, 43, 226, 0.2)',
                  border: '1px solid rgba(138, 43, 226, 0.4)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(138, 43, 226, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(138, 43, 226, 0.2)';
                }}
                title="Share on Farcaster"
              >
                <img 
                  src="/icons/farcasteroriginal-white+purpleBG2160x2160px.webp" 
                  alt="Farcaster" 
                  style={{ width: '28px', height: '28px' }} 
                />
              </button>

              <button
                onClick={handleXShare}
                style={{
                  background: 'rgba(29, 161, 242, 0.2)',
                  border: '1px solid rgba(29, 161, 242, 0.4)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(29, 161, 242, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(29, 161, 242, 0.2)';
                }}
                title="Share on X (Twitter)"
              >
                <img 
                  src="/icons/X-Blackbg.webp" 
                  alt="X" 
                  style={{ width: '28px', height: '28px' }} 
                />
              </button>

              <button
                onClick={handleTelegramShare}
                style={{
                  background: 'rgba(0, 136, 204, 0.2)',
                  border: '1px solid rgba(0, 136, 204, 0.4)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 136, 204, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 136, 204, 0.2)';
                }}
                title="Share on Telegram"
              >
                <img 
                  src="/icons/telegram.png" 
                  alt="Telegram" 
                  style={{ width: '28px', height: '28px' }} 
                />
              </button>

              <button
                onClick={handleInstagramCopy}
                style={{
                  background: copied ? 'rgba(34, 139, 34, 0.2)' : 'rgba(225, 48, 108, 0.2)',
                  border: `1px solid ${copied ? 'rgba(34, 139, 34, 0.4)' : 'rgba(225, 48, 108, 0.4)'}`,
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.currentTarget.style.background = 'rgba(225, 48, 108, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.currentTarget.style.background = 'rgba(225, 48, 108, 0.2)';
                  }
                }}
                title={copied ? "Copied!" : "Copy for Instagram"}
              >
                <img 
                  src="/icons/Instagram-blackbg-rouded-good.webp" 
                  alt="Instagram" 
                  style={{ width: '28px', height: '28px' }} 
                />
              </button>
            </div>

            {/* Copy Link Button */}
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                  console.error('Failed to copy URL:', err);
                }
              }}
              style={{
                background: copied ? 'rgba(34, 139, 34, 0.2)' : 'rgba(0, 230, 255, 0.2)',
                border: `1px solid ${copied ? 'rgba(34, 139, 34, 0.4)' : 'rgba(0, 230, 255, 0.4)'}`,
                borderRadius: '10px',
                padding: '12px 20px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                width: '100%',
                marginBottom: '15px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!copied) {
                  e.currentTarget.style.background = 'rgba(0, 230, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.currentTarget.style.background = 'rgba(0, 230, 255, 0.2)';
                }
              }}
            >
              {copied ? '✅ Copied!' : '🔗 Copy Link'}
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}