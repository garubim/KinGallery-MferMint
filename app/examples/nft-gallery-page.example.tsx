"use client";

import { useState } from 'react';
import MintNFTButton from '@/components/MintNFTButton';

/**
 * Example: NFT Gallery Page
 * 
 * Página de exemplo mostrando:
 * - Peça NFT
 * - Informações
 * - Mint button com Blockchain Write Overlay
 * - UX fluida e elegante
 */

interface NFTPiece {
  id: string;
  title: string;
  artist: string;
  image: string;
  description: string;
  stats: {
    edition: number;
    totalEditions: number;
    createdAt: string;
  };
}

const mockPieces: NFTPiece[] = [
  {
    id: 'eternal-loop-001',
    title: 'Eternal Loop - #1',
    artist: 'Gabriel Rubim',
    image: '/gallery/eternal-loop-001.jpg',
    description:
      'A digital artwork exploring the boundaries between code and consciousness. Written on the eternal loop, secured on Base blockchain.',
    stats: {
      edition: 1,
      totalEditions: 1,
      createdAt: '2026-01-07',
    },
  },
];

export default function NFTGalleryExample() {
  const piece = mockPieces[0];
  const [isMinted, setIsMinted] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [mintedAt, setMintedAt] = useState<string | null>(null);

  const handleMintSuccess = (hash: string) => {
    setTxHash(hash);
    setIsMinted(true);
    setMintedAt(new Date().toLocaleString());
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(0, 255, 150, 0.1)',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: '0', fontSize: '24px' }}>KinGallery</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.6, fontSize: '12px' }}>
          Minting NFTs on Base Blockchain
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '60px 40px',
        }}
      >
        {/* Left: Artwork Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Image Frame */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid rgba(0, 255, 150, 0.2)',
              background: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #1a3a3a, #0a2a2a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: 'rgba(0, 255, 150, 0.5)',
              }}
            >
              [Image Placeholder: {piece.title}]
            </div>

            {/* Badge */}
            {isMinted && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#00ff88',
                  color: '#000',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                ✓ MINTED
              </div>
            )}
          </div>

          {/* Edition Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(0, 255, 150, 0.05)',
                border: '1px solid rgba(0, 255, 150, 0.2)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', opacity: 0.7 }}>
                EDITION
              </p>
              <p style={{ margin: '0', fontSize: '20px', fontWeight: 600 }}>
                #{piece.stats.edition}/{piece.stats.totalEditions}
              </p>
            </div>

            <div
              style={{
                background: 'rgba(0, 255, 150, 0.05)',
                border: '1px solid rgba(0, 255, 150, 0.2)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', opacity: 0.7 }}>
                CREATED
              </p>
              <p style={{ margin: '0', fontSize: '14px' }}>
                {piece.stats.createdAt}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Info + Mint */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Artwork Info */}
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '36px' }}>
              {piece.title}
            </h2>
            <p
              style={{
                margin: '0 0 16px 0',
                color: 'rgba(0, 255, 150, 0.8)',
                fontSize: '14px',
              }}
            >
              by {piece.artist}
            </p>

            <p style={{ margin: '0', lineHeight: '1.6', opacity: 0.8 }}>
              {piece.description}
            </p>
          </div>

          {/* Contract Info */}
          <div
            style={{
              background: 'rgba(0, 255, 150, 0.05)',
              border: '1px solid rgba(0, 255, 150, 0.2)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                opacity: 0.7,
              }}
            >
              Contract Details
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '13px',
                fontFamily: 'monospace',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  gap: '16px',
                }}
              >
                <span style={{ opacity: 0.6 }}>Network:</span>
                <span style={{ color: '#00ff88' }}>Base Mainnet</span>

                <span style={{ opacity: 0.6 }}>Chain ID:</span>
                <span style={{ color: '#00ff88' }}>8453</span>

                <span style={{ opacity: 0.6 }}>Contract:</span>
                <span
                  style={{
                    color: '#00ff88',
                    wordBreak: 'break-all',
                  }}
                >
                  0x7cad62748dd...
                </span>

                <span style={{ opacity: 0.6 }}>Gas:</span>
                <span style={{ color: '#00ff88' }}>~0.002 ETH</span>
              </div>
            </div>
          </div>

          {/* Mint Button */}
          <div>
            <MintNFTButton onMintSuccess={handleMintSuccess} debug={true} />
          </div>

          {/* Success Message */}
          {isMinted && (
            <div
              style={{
                background: 'rgba(0, 255, 150, 0.1)',
                border: '2px solid #00ff88',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
                ✨ NFT Successfully Minted!
              </p>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  color: '#00ff88',
                }}
              >
                {txHash}
              </div>

              <p style={{ margin: '0', fontSize: '12px', opacity: 0.7 }}>
                Minted at {mintedAt}
              </p>

              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '16px',
                  padding: '8px 16px',
                  background: '#00ff88',
                  color: '#000',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                View on BaseScan →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid rgba(0, 255, 150, 0.1)',
          padding: '40px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '12px',
        }}
      >
        <p style={{ margin: '0' }}>
          KinGallery © 2026 | Powered by Base Blockchain
        </p>
      </div>
    </div>
  );
}
