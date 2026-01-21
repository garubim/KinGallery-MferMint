"use client";

import NFTSuccessCard from './NFTSuccessCard';
import MatrixConfetti from './MatrixConfetti';

interface NFTMintedPageProps {
  nftName: string;
  nftNumber: number;
  totalEditions: number;
  imageUrl?: string;
  txHash: string;
  contractAddress: string;
  createdAt?: string;
  onMintAnother?: () => void;
  showConfetti?: boolean;
}

/**
 * NFT Minted Success Page
 * 
 * Exibido após mint bem-sucedido
 * - Matrix confetti celebration effect
 * - Frase poética: "The soul spins at a base - where the smile comes home."
 * - NFT Success Card com informações
 * - Botões de ação (share, view, mint again)
 */
export default function NFTMintedPage({
  nftName,
  nftNumber,
  totalEditions,
  imageUrl,
  txHash,
  contractAddress,
  createdAt,
  onMintAnother,
  showConfetti = true,
}: NFTMintedPageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 0.6s ease-in',
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>

      {/* Matrix Confetti Celebration */}
      {showConfetti && <MatrixConfetti />}

      {/* Content Container */}
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          position: 'relative',
          zIndex: 10,
          animation: 'slideUp 0.8s ease-out 0.2s both',
        }}
      >
        {/* Success Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            animation: 'slideUp 0.8s ease-out 0.4s both',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              animation: 'pulse 0.8s infinite 2s',
            }}
          >
            ✨
          </div>

          <h1
            style={{
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: 700,
            }}
          >
            Minting Complete!
          </h1>

          <p
            style={{
              margin: '0',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            Your NFT has been secured on Base blockchain
          </p>
        </div>

        {/* NFT Success Card */}
        <NFTSuccessCard
          nftName={nftName}
          nftNumber={nftNumber}
          totalEditions={totalEditions}
          imageUrl={imageUrl}
          txHash={txHash}
          contractAddress={contractAddress}
          createdAt={createdAt}
          showAnimation={true}
        />

        {/* Secondary Actions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: '24px',
            animation: 'slideUp 0.8s ease-out 1.6s both',
          }}
        >
          <button
            onClick={() => {
              // Share on Twitter
              const text = `Just minted ${nftName} #${nftNumber} on @base! The soul spins at a base - where the smile comes home. ✨ #NFT #KinGallery`;
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
              window.open(url, '_blank');
            }}
            style={{
              padding: '12px 16px',
              background: 'rgba(100, 200, 255, 0.1)',
              border: '1px solid rgba(100, 200, 255, 0.4)',
              borderRadius: '8px',
              color: '#64c8ff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(100, 200, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(100, 200, 255, 0.1)';
            }}
          >
            Share on Twitter
          </button>

          {onMintAnother && (
            <button
              onClick={onMintAnother}
              style={{
                padding: '12px 16px',
                background: 'rgba(0, 255, 136, 0.1)',
                border: '2px solid rgba(0, 255, 136, 0.4)',
                borderRadius: '8px',
                color: '#00ff88',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 136, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)';
              }}
            >
              Mint Another ✨
            </button>
          )}
        </div>

        {/* Footer Message */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '32px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontStyle: 'italic',
            animation: 'slideUp 0.8s ease-out 2.0s both',
          }}
        >
          Your NFT is now part of KinGallery. Welcome to the ritual. 🎭
        </p>
      </div>
    </div>
  );
}
