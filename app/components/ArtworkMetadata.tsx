'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface ArtworkMetadataProps {
  showPricing?: boolean;
  isCompact?: boolean;
  onDisconnect?: () => void;
  tokenId?: number;
  entangledMferId?: number;
  ethMferImageUrl?: string;
  transactionHash?: string;
  mintDate?: string;
  blockNumber?: number;
  collisionInfo?: any;
}

export default function ArtworkMetadata({ 
  showPricing = true, 
  isCompact = false, 
  onDisconnect = () => {},
  tokenId,
  entangledMferId,
  ethMferImageUrl,
  transactionHash,
  mintDate,
  blockNumber,
  collisionInfo
}: ArtworkMetadataProps) {
  const [usdcPrice, setUsdcPrice] = useState('0.75');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ethPrice = 0.0003;
    const estimatedUsdcPrice = (ethPrice * 2500).toFixed(2);
    setUsdcPrice(estimatedUsdcPrice);
  }, []);

  // Wagmi hook to show connected address
  const { address, isConnected } = useAccount();

  if (!mounted) return null;

  const containerClass = isCompact ? 'artwork-metadata compact' : 'artwork-metadata';

  return (
    <div className={containerClass}>
      {/* 3 linhas de metadata básica */}
      <div className="metadata-basic-info">
        <div className="metadata-row">
          <div className="metadata-label">Collection</div>
          <div className="metadata-value">Mfer-0'-base</div>
        </div>

        <div className="metadata-row">
          <div className="metadata-label">Artist</div>
          <div className="metadata-value">Kinwiz.base.eth</div>
        </div>


        <div className="metadata-row">
          <div className="metadata-label">Title</div>
          <div className="metadata-value">
            <div className="title-line">{tokenId ? `Mfer-0-#${tokenId}/1000` : 'Mfer-0-#.../1000'}</div>
            {transactionHash && (
              <div className="title-tx">
                <a
                  href={`https://basescan.org/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View transaction on BaseScan"
                >
                  View transaction
                </a>
              </div>
            )}



          </div>
        </div>

        {isConnected && address && (
          <div className="metadata-row">
            <div className="metadata-label">Connected</div>
            <div className="metadata-value connected-value">{`${address.slice(0,6)}…${address.slice(-4)}`}</div>
          </div>
        )}

      </div>

      {/* Linha "chão" - Entangled with (sem borda) */}
      {entangledMferId && (
        <div className="entangled-floor">
          <div className="metadata-label">Entangled with</div>
          <div className="metadata-value entangled-mfer">
            Ethereum Mfer #{entangledMferId}
          </div>
        </div>
      )}

      {showPricing && (
        <div className="metadata-section price-info">
          <div className="metadata-label">Price</div>
          <div className="price-values">
            <div className="price-eth">
              <span className="currency">ETH</span>
              <span className="amount">0.0003</span>
            </div>
            <div className="price-separator">≈</div>
            <div className="price-usdc">
              <span className="currency">USDC</span>
              <span className="amount">${usdcPrice}</span>
            </div>
          </div>
        </div>
      )}


      {/* 🌠 COLISÃO DE HASH - Rare Event */}
      {collisionInfo && (
        <div className="metadata-section collision-event">
          <h3 className="collision-title">🌠 Hash Collision Event!</h3>
          <div className="collision-content">
            <p className="collision-message">{collisionInfo.message}</p>
            <div className="collision-details">
              <div className="collision-item">
                <span className="collision-label">Last 6 Digits</span>
                <span className="collision-value">#{collisionInfo.lastSixEthMferId}</span>
              </div>
              <span className="collision-plus">+</span>
              <div className="collision-item">
                <span className="collision-label">First 6 Digits</span>
                <span className="collision-value">#{collisionInfo.firstSixEthMferId}</span>
              </div>
              <span className="collision-arrow">→</span>
              <div className="collision-item origin">
                <span className="collision-label">Mfers Origin</span>
                <span className="collision-value">#{collisionInfo.originalMferNumber}</span>
              </div>
            </div>
            <p className="collision-note">Your mint climbed the ranking and connected to the original Mfers lineage on Ethereum Mainnet</p>
          </div>
        </div>
      )}

      {/* 📜 CERTIDÃO - Informações da transação COM IMAGEM NO LADO ESQUERDO */}
      {transactionHash && (
        <div className="metadata-section certification">
          <h3 className="certification-title">📜 Attestation</h3>
          
          {/* Layout: Imagem esquerda + Texto direita */}
          <div className="certification-content">
            {/* Imagem no lado esquerdo com espaço */}
            {entangledMferId && ethMferImageUrl && (
              <div className="attestation-image">
                <img src={ethMferImageUrl} alt={`Ethereum Mfer #${entangledMferId}`} />
              </div>
            )}
            
            {/* Grid de informações no lado direito */}
            <div className="certification-grid">
            {mintDate && (
              <div className="cert-item">
                <div className="cert-label">Birth</div>
                <div className="cert-value">{mintDate}</div>
              </div>
            )}
            
            {blockNumber && (
              <div className="cert-item">
                <div className="cert-label">Block</div>
                <div className="cert-value">#{blockNumber}</div>
              </div>
            )}
            
            <div className="cert-item">
              <div className="cert-label">Transaction Hash</div>
              <div className="cert-value cert-hash">
                <a 
                  href={`https://basescan.org/tx/${transactionHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Ver no BlockScout"
                >
                  {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                </a>
              </div>
            </div>

            {entangledMferId && (
              <div className="cert-item">
                <div className="cert-label">Legacy Twin</div>
                <div className="cert-value">
                  Ethereum Mfer #{entangledMferId} (Mainnet)
                </div>
              </div>
            )}
          </div>
          {/* Fim certification-grid */}
          </div>
          {/* Fim certification-content */}
        </div>
      )}

      <div className="metadata-section value-proposition">
        <p className="value-text">
          Not imitation. Etch your mark as progress. Bend the line. Prove evolution is recorded. Register yourself in the Mfer lineage. <button onClick={onDisconnect} className="disconnect-inline">Disconnect</button>
        </p>
      </div>

      <style jsx>{`
        .artwork-metadata {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 32px 28px;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          margin-bottom: 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .artwork-metadata.compact {
          padding: 16px 20px;
          gap: 12px;
          margin-bottom: 16px;
        }

        /* Info básica - 3 linhas em coluna */
        .metadata-basic-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        /* Connected wallet value styling */
        .connected-value {
          color: rgba(0, 230, 255, 0.9);
          font-family: 'Courier New', monospace;
          font-size: 13px;
          letter-spacing: 0.01em;
        }

        /* Wallet connected block spacing */
        .wallet-connected {
          margin-top: 8px;
        }

        .eth-mfer-photo {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .eth-mfer-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Layout attestation: imagem esquerda, texto direita - COMPACTO */
        .certification-content {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          width: 100%;
          margin-top: 4px;
        }

        .attestation-image {
          width: 110px;
          height: 110px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .attestation-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .metadata-items {
          display: flex;
          flex-direction: column;
          gap: 0;
          width: 100%;
        }

        .metadata-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        /* Linha "chão" - Entangled with */
        .entangled-floor {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
        }

        .metadata-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .metadata-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          min-width: 80px;
        }

        .metadata-value {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.95);
          text-align: right;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
        }

        .title-line {
          font-weight: 700;
          color: rgba(255, 255, 255, 0.98);
        }

        .title-tx {
          margin-top: 6px;
          font-size: 11px;
        }

        .title-tx a {
          color: rgba(0, 150, 255, 1);
          text-decoration: none;
          background: rgba(0, 150, 255, 0.06);
          padding: 4px 6px;
          border-radius: 6px;
          border: 1px solid rgba(0, 150, 255, 0.12);
          font-family: 'Monaco', 'Courier New', monospace;
        }

        .title-tx a:hover {
          background: rgba(0, 150, 255, 0.12);
        }

        .entangled-mfer {
          color: rgba(255, 200, 100, 0.95);
          font-weight: 600;
        }

        .price-values {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          justify-content: flex-end;
        }

        .price-eth,
        .price-usdc {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.06);
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .price-eth {
          border-color: rgba(0, 105, 255, 0.3);
          background: rgba(0, 105, 255, 0.08);
        }

        .price-usdc {
          border-color: rgba(39, 161, 123, 0.3);
          background: rgba(39, 161, 123, 0.08);
        }

        .currency {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          min-width: 28px;
        }

        .amount {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          min-width: 50px;
        }

        .price-eth .amount {
          color: rgba(0, 150, 255, 1);
        }

        .price-usdc .amount {
          color: rgba(39, 200, 139, 1);
        }

        .price-separator {
          color: rgba(255, 255, 255, 0.3);
          font-size: 12px;
          font-weight: 500;
        }

        /* 🌠 COLLISION EVENT - Rare Prestige */
        .collision-event {
          border: 2px solid rgba(255, 0, 200, 0.4) !important;
          background: linear-gradient(135deg, rgba(255, 0, 200, 0.08) 0%, rgba(255, 100, 255, 0.04) 100%) !important;
          padding: 16px !important;
          gap: 12px !important;
          margin-bottom: 12px !important;
          box-shadow: 0 0 20px rgba(255, 0, 200, 0.2);
          animation: collisionPulse 2s ease-in-out infinite;
        }

        @keyframes collisionPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 200, 0.2); }
          50% { box-shadow: 0 0 30px rgba(255, 0, 200, 0.4); }
        }

        .collision-title {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255, 0, 200, 0.95);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .collision-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .collision-message {
          margin: 0;
          font-size: 12px;
          color: rgba(255, 200, 255, 0.9);
          font-weight: 500;
          line-height: 1.5;
        }

        .collision-details {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          border: 1px solid rgba(255, 0, 200, 0.2);
          flex-wrap: wrap;
          justify-content: center;
        }

        .collision-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .collision-item.origin {
          background: rgba(255, 0, 200, 0.1);
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid rgba(255, 0, 200, 0.3);
        }

        .collision-label {
          font-size: 9px;
          font-weight: 700;
          color: rgba(255, 200, 255, 0.7);
          letter-spacing: 0.2px;
          text-transform: uppercase;
        }

        .collision-value {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255, 0, 200, 1);
          font-family: 'Monaco', 'Courier New', monospace;
        }

        .collision-plus,
        .collision-arrow {
          color: rgba(255, 0, 200, 0.6);
          font-weight: 700;
          font-size: 14px;
        }

        .collision-note {
          margin: 0;
          font-size: 11px;
          color: rgba(255, 200, 255, 0.7);
          font-style: italic;
          text-align: center;
        }

        /* 📜 CERTIDÃO (Attestation) */
        .certification {
          border: 2px solid rgba(255, 215, 0, 0.2) !important;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.04) 0%, rgba(255, 215, 0, 0.02) 100%) !important;
          padding: 16px !important;
          gap: 12px !important;
          margin-top: 12px !important;
          flex-direction: column !important;
          align-items: flex-start !important;
        }

        .certification-title {
          margin: 0 0 2px 0;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255, 215, 0, 0.9);
          letter-spacing: 0.3px;
          text-transform: uppercase;
          width: 100%;
        }

        .certification-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          width: 100%;
          margin-top: 2px;
        }

        .cert-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .cert-label {
          font-size: 9px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .cert-value {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          word-break: break-all;
          line-height: 1.3;
        }

        .cert-hash a {
          color: rgba(0, 150, 255, 1);
          text-decoration: none;
          transition: all 0.3s ease;
          padding: 4px 6px;
          border-radius: 4px;
          background: rgba(0, 150, 255, 0.1);
          border: 1px solid rgba(0, 150, 255, 0.2);
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 11px;
        }

        .cert-hash a:hover {
          color: rgba(0, 200, 255, 1);
          background: rgba(0, 150, 255, 0.15);
          border-color: rgba(0, 150, 255, 0.4);
        }

        .value-proposition {
          margin-top: 8px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .value-text {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.75);
          margin: 0;
          font-style: italic;
          font-weight: 300;
        }

        @media (max-width: 640px) {
          .certification-grid {
            grid-template-columns: 1fr;
          }

          .metadata-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .metadata-label {
            width: 100%;
          }

          .metadata-value,
          .price-values {
            width: 100%;
            justify-content: flex-start;
          }

          .artwork-metadata {
            padding: 16px;
            gap: 12px;
          }
        }

        .disconnect-inline {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: inherit;
          font-style: inherit;
          letter-spacing: inherit;
          cursor: pointer;
          padding: 0;
          margin: 0 0 0 0.5em;
          font-family: inherit;
          transition: color 0.3s ease;
          text-decoration: none;
        }

        .disconnect-inline:hover {
          color: rgba(255, 255, 255, 0.7);
        }

        .disconnect-inline:active {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
}
