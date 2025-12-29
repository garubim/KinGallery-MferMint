'use client';

import { useMiniKit, useAddFrame, useOpenUrl } from '@coinbase/onchainkit/minikit';
import { useEffect } from 'react';

export default function FarcasterActions() {
  const { isMiniKit } = useMiniKit();
  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (isMiniKit) {
      // Enable notifications
      // Assuming MiniKit has notification setup
    }
  }, [isMiniKit]);

  const handleSaveApp = () => {
    if (addFrame) {
      addFrame({
        url: 'https://kingallery.netlify.app',
        name: 'KinGallery',
      });
    }
  };

  const handleShare = () => {
    if (openUrl) {
      openUrl({
        url: `https://warpcast.com/compose?text=Check out KinGallery for minting art on Base!&embeds[]=https://kingallery.netlify.app`,
      });
    }
  };

  if (!isMiniKit) return null;

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', gap: 10 }}>
      <button onClick={handleSaveApp} style={{ padding: '10px', background: '#0069ff', color: '#fff', border: 'none', borderRadius: 8 }}>
        Save App
      </button>
      <button onClick={handleShare} style={{ padding: '10px', background: '#00e6ff', color: '#fff', border: 'none', borderRadius: 8 }}>
        Share
      </button>
    </div>
  );
}