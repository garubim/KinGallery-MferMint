'use client';

import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

/**
 * Hook crítico para segurança pré-deployment
 * Implementa:
 * 1. Auto-disconnect quando o usuário fecha a aba
 * 2. Health check do RPC endpoint
 * 3. Token expiration monitoring (futuro - se migrar para CDP)
 */
export function useCDPSecurity() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [rpcHealthy, setRpcHealthy] = useState(true);
  const [lastHealthCheck, setLastHealthCheck] = useState<number>(0);

  // ✅ CRÍTICO: Auto-disconnect quando fecha a aba
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isConnected) {
        console.log('🔒 Tab fechada - desconectando wallet automaticamente...');
        disconnect();
        // Limpa dados sensíveis
        localStorage.removeItem('wagmi.wallet');
        localStorage.removeItem('wagmi.chain');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isConnected, disconnect]);

  // ✅ CRÍTICO: Valida health do RPC antes de mintar
  const checkRPCHealth = async () => {
    const now = Date.now();
    
    // Evita spam - só check a cada 30 segundos
    if (now - lastHealthCheck < 30000) {
      return rpcHealthy;
    }

    try {
      const rpcUrl = 'https://base.llamarpc.com'; // ou process.env.NEXT_PUBLIC_RPC_URL
      
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_blockNumber',
          params: [],
        }),
      });

      const data = await response.json();
      const isHealthy = !data.error && data.result;
      
      setRpcHealthy(isHealthy);
      setLastHealthCheck(now);

      if (!isHealthy) {
        console.warn('⚠️ RPC endpoint retornou erro:', data.error?.message);
      }

      return isHealthy;
    } catch (error) {
      console.error('❌ RPC health check falhou:', error);
      setRpcHealthy(false);
      setLastHealthCheck(now);
      return false;
    }
  };

  return {
    rpcHealthy,
    checkRPCHealth,
  };
}
