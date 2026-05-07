"use client";

import { useState } from 'react';
// import MagicButton from '@/components/MagicButton/MagicButton';

/**
 * MintNFTButton Example
 * 
 * Specialized button for NFT minting with:
 * - Elegant animation during mint
 * - Matrix effect overlay during blockchain write
 * - Visual feedback at each step
 */

export interface MintNFTButtonProps {
  onMintSuccess?: (txHash: string) => void;
  onMintError?: (error: Error) => void;
  disabled?: boolean;
  debug?: boolean;
}

export default function MintNFTButton({
  onMintSuccess,
  onMintError,
  disabled = false,
  debug = false,
}: MintNFTButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMint = async () => {
    try {
      setIsProcessing(true);
      if (debug) console.log('🎬 Starting NFT mint...');

      // Simulate smart contract call
      // In production: call wallet provider (wagmi, ethers, etc)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockTxHash = '0x' + Math.random().toString(16).slice(2);
      if (debug) console.log('✨ Mint successful!', mockTxHash);

      onMintSuccess?.(mockTxHash);
      setIsProcessing(false);

      // Auto-reset after 2 seconds
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('❌ Mint failed:', error);
      onMintError?.(error);
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleMint}
      disabled={disabled || isProcessing}
      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {isProcessing ? '⏳ Processing...' : '🎨 Mint Your NFT'}
    </button>
  );
}
