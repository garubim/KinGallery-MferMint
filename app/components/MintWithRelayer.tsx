'use client';

/**
 * MintWithRelayer (DEPRECATED)
 * 
 * Componente legado - NÃO USE
 * Use MagicMintButton.tsx em produção.
 */

import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function MintWithRelayer() {
  const { isConnected } = useAccount();
  const [loading, setLoading] = useState(false);

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  const handleMint = async () => {
    setLoading(true);
    try {
      // Use MagicMintButton.tsx instead
      console.log('Use MagicMintButton.tsx instead of this component');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMint}
      disabled={loading || !isConnected}
      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {loading ? '⏳ Minting...' : '🚀 Mint with Relayer (Deprecated)'}
    </button>
  );
}
