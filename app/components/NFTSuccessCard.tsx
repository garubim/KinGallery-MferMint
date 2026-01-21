"use client";
import { getIPFSUrl, KNOWN_CIDs } from '@/lib/ipfs-helper';

interface NFTSuccessCardProps {
  nftName: string;
  nftNumber: number;
  totalEditions: number;
  imageUrl?: string;
  txHash: string;
  contractAddress: string;
  createdAt?: string;
  showAnimation?: boolean;
  isVideo?: boolean;
}

export default function NFTSuccessCard({
  nftName,
  nftNumber,
  totalEditions,
  imageUrl,
  txHash,
  contractAddress,
  createdAt = new Date().toLocaleString(),
  showAnimation = true,
  isVideo = true,
}: NFTSuccessCardProps) {
  const finalImageUrl = imageUrl || getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK);
  const baseScanUrl = `https://basescan.org/tx/${txHash}`;
  const shortTxHash = `${txHash.slice(0, 6)}...${txHash.slice(-6)}`;
  const shortAddress = `${contractAddress.slice(0, 6)}...${contractAddress.slice(-6)}`;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <p
          style={{
            fontSize: '16px',
            fontStyle: 'italic',
            color: '#00ff88',
            textAlign: 'center',
            lineHeight: '1.6',
            letterSpacing: '0.5px',
          }}
        >
          The soul spins at a base -<br />
          where the smile comes home.
        </p>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(0,255,136,0.02) 100%)',
          border: '2px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
        }}
      >
        <div
          style={{
            aspectRatio: '1',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0a2a2a 0%, #1a3a3a 100%)',
            position: 'relative',
          }}
        >
          {isVideo ? (
            <video
              src={finalImageUrl}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <img
              src={finalImageUrl}
              alt={nftName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}

          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: '#00ff88',
              color: '#000',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            #{nftNumber}/{totalEditions}
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '20px',
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            {nftName} #{nftNumber}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            <div
              style={{
                background: 'rgba(0, 255, 136, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 255, 136, 0.2)',
              }}
            >
              <p style={{ margin: '0 0 4px 0', opacity: 0.6, fontSize: '10px' }}>
                NETWORK
              </p>
              <p style={{ margin: '0', color: '#00ff88' }}>Base Mainnet</p>
            </div>

            <div
              style={{
                background: 'rgba(0, 255, 136, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 255, 136, 0.2)',
              }}
            >
              <p style={{ margin: '0 0 4px 0', opacity: 0.6, fontSize: '10px' }}>
                CHAIN ID
              </p>
              <p style={{ margin: '0', color: '#00ff88' }}>8453</p>
            </div>

            <div
              style={{
                background: 'rgba(0, 255, 136, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 255, 136, 0.2)',
              }}
            >
              <p style={{ margin: '0 0 4px 0', opacity: 0.6, fontSize: '10px' }}>
                TX
              </p>
              <a
                href={baseScanUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  margin: '0',
                  color: '#00ff88',
                  textDecoration: 'none',
                  fontSize: '11px',
                }}
              >
                {shortTxHash} ↗
              </a>
            </div>

            <div
              style={{
                background: 'rgba(0, 255, 136, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 255, 136, 0.2)',
              }}
            >
              <p style={{ margin: '0 0 4px 0', opacity: 0.6, fontSize: '10px' }}>
                CONTRACT
              </p>
              <p style={{ margin: '0', color: '#00ff88', fontSize: '11px' }}>
                {shortAddress}
              </p>
            </div>
          </div>

          <p
            style={{
              margin: '0',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              fontFamily: 'monospace',
            }}
          >
            Minted: {createdAt}
          </p>
        </div>
      </div>
    </div>
  );
}
