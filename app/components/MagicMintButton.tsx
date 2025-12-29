'use client';

import { TransactionButton } from '@coinbase/onchainkit/transaction';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import CustomAnimatedText from './CustomAnimatedText';
import CodePoem from './CodePoem';

const magicPhrases = [
  "Awaken the KinGallery – Mint with a magical smile!",
  "you just ordered a perpetual motion mood ring for the entire cryptosphere",
  "completing an eternal transactional soul",
  "in the core of the night, the code breathes",
  "onchain whispers fold into loops",
  "we mint the echo and call it home",
  "The soul spins at This base is where that smile comes home.",
  "function getEternalLoop()",
];

export default function MagicMintButton() {
  const { address } = useAccount();
  const [currentPhrase, setCurrentPhrase] = useState(magicPhrases[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPhrase(magicPhrases[Math.floor(Math.random() * magicPhrases.length)]);
        setIsAnimating(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <CodePoem />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <TransactionButton
          calls={[{
            to: process.env.NEXT_PUBLIC_KINGALLERY_ADDRESS || '',
            abi: [{
              type: 'function',
              name: 'payAndMint',
              inputs: [
                { name: '_artistContract', type: 'address' },
                { name: '_to', type: 'address' },
                { name: '_paymentId', type: 'string' },
              ],
              outputs: [],
              stateMutability: 'payable',
            }],
            functionName: 'payAndMint',
            args: [
              process.env.NEXT_PUBLIC_MFER_ADDRESS || '',
              address || '0x0000000000000000000000000000000000000000',
              `magic-${Date.now()}`,
            ],
            value: '300000000000000', // 0.0003 ETH
          }]}
          onSuccess={(response) => console.log('Mint successful!', response)}
          onError={(error) => console.error('Mint failed', error)}
          render={({ onClick, status }) => (
            <button
              onClick={onClick}
              disabled={status === 'pending'}
              style={{
                padding: '20px 40px',
                fontSize: '24px',
                background: 'linear-gradient(45deg, #0069ff, #00e6ff)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,102,255,0.5)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <CustomAnimatedText
                text={currentPhrase}
                className="magic-text"
                keyBase="magic"
                onEnd={() => setIsAnimating(false)}
              />
            </button>
          )}
        />
      </div>
    </div>
  );
}