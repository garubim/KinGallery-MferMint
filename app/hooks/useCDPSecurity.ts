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
      // Call server-side proxy to avoid CORS issues in browser dev
      const res = await fetch('/api/rpc-health');

      if (!res.ok) {
        console.error('⚠️ rpc-health endpoint returned:', res.status);
        setRpcHealthy(false);
        setLastHealthCheck(now);
        return false;
      }

      const json = await res.json();
      const isHealthy = !!json.healthy;

      setRpcHealthy(isHealthy);
      setLastHealthCheck(now);

      if (!isHealthy) {
        console.warn('⚠️ RPC health proxy reported unhealthy:', json.error || json);
      }

      return isHealthy;
    } catch (error) {
      console.error('❌ RPC health check failed (proxy):', error);
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
