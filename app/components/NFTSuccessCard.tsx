"use client";

import { motion } from 'framer-motion';
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

/**
 * NFT Success Card
 * 
 * Exibido após mint bem-sucedido
 * Mostra a peça mintada com número e informações on-chain
 * 
 * Frase: "The soul spins at a base - where the smile comes home."
 */
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
  // Use default IPFS Mfer artwork if no imageUrl provided
  const finalImageUrl = imageUrl || getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK);
  const baseScanUrl = `https://basescan.org/tx/${txHash}`;
  const shortTxHash = `${txHash.slice(0, 6)}...${txHash.slice(-6)}`;
  const shortAddress = `${contractAddress.slice(0, 6)}...${contractAddress.slice(-6)}`;

  return (
    <motion.div
      initial={showAnimation ? { opacity: 0, scale: 0.9 } : { opacity: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Poetic Phrase */}
      <motion.div
        initial={showAnimation ? { opacity: 0, y: -20 } : { opacity: 1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="mb-8 text-center"
      >
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
      </motion.div>

      {/* NFT Card Container */}
      <motion.div
        initial={showAnimation ? { opacity: 0, y: 20 } : { opacity: 1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(0,255,136,0.02) 100%)',
          border: '2px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)',
        }}
      >
        {/* Media Frame */}
        <motion.div
          style={{
            aspectRatio: '1',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0a2a2a 0%, #1a3a3a 100%)',
            position: 'relative',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
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

          {/* Edition Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
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
          </motion.div>
        </motion.div>

        {/* Info Section */}
        <div style={{ padding: '24px' }}>
          {/* NFT Name */}
          <motion.h2
            initial={showAnimation ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              margin: '0 0 16px 0',
              fontSize: '20px',
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            {nftName} #{nftNumber}
          </motion.h2>

          {/* Blockchain Info Grid */}
          <motion.div
            initial={showAnimation ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
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
                MINTED
              </p>
              <p style={{ margin: '0', color: '#00ff88' }}>
                {new Date(createdAt).toLocaleDateString()}
              </p>
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
                EDITION
              </p>
              <p style={{ margin: '0', color: '#00ff88' }}>
                {nftNumber}/{totalEditions}
              </p>
            </div>
          </motion.div>

          {/* Transaction Hash */}
          <motion.div
            initial={showAnimation ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '12px',
              fontSize: '11px',
              fontFamily: 'monospace',
            }}
          >
            <p style={{ margin: '0 0 4px 0', opacity: 0.6, fontSize: '9px' }}>
              TRANSACTION
            </p>
            <code
              style={{
                color: '#00ff88',
                wordBreak: 'break-all',
                fontSize: '10px',
              }}
            >
              {shortTxHash}
            </code>
          </motion.div>

          {/* Contract Address */}
          <motion.div
            initial={showAnimation ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '11px',
              fontFamily: 'monospace',
            }}
          >
            <p style={{ margin: '0 0 4px 0', opacity: 0.6, fontSize: '9px' }}>
              CONTRACT
            </p>
            <code
              style={{
                color: '#00ff88',
                wordBreak: 'break-all',
                fontSize: '10px',
              }}
            >
              {shortAddress}
            </code>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={showAnimation ? { opacity: 0, y: 20 } : { opacity: 1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginTop: '20px',
        }}
      >
        <a
          href={baseScanUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 16px',
            background: 'rgba(0, 255, 136, 0.1)',
            border: '2px solid rgba(0, 255, 136, 0.4)',
            borderRadius: '8px',
            color: '#00ff88',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 255, 136, 0.2)';
            e.currentTarget.style.borderColor = '#00ff88';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.4)';
          }}
        >
          View on BaseScan →
        </a>

        <button
          onClick={() => {
            navigator.clipboard.writeText(txHash);
            alert('Transaction hash copied!');
          }}
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
            e.currentTarget.style.borderColor = '#00ff88';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.4)';
          }}
        >
          Copy TX Hash
        </button>
      </motion.div>
    </motion.div>
  );
}
