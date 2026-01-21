"use client";

import { useState } from 'react';
// import MagicButton from '@/components/MagicButton/MagicButton';

/**
 * MintNFTButton Example
 * 
 * Botão especializado para minting de NFTs com:
 * - Animação elegante durante mint
 * - Overlay com efeito Matrix durante blockchain write
 * - Feedback visual em cada etapa
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

      // Simular chamada de smart contract
      // Em produção: chamar wallet provider (wagmi, ethers, etc)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockTxHash = '0x' + Math.random().toString(16).slice(2);
      if (debug) console.log('✨ Mint successful!', mockTxHash);

      onMintSuccess?.(mockTxHash);
      setIsProcessing(false);

      // Auto-reset após 2 segundos
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
