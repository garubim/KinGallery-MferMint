'use client';

import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

/**
 * Critical security hook for pre-deployment
 * Implements:
 * 1. Auto-disconnect when the user closes the tab
 * 2. RPC endpoint health check
 * 3. Token expiration monitoring (future - if migrating to CDP)
 */
export function useCDPSecurity() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [rpcHealthy, setRpcHealthy] = useState(true);
  const [lastHealthCheck, setLastHealthCheck] = useState<number>(0);

  // ✅ CRITICAL: Auto-disconnect when tab is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isConnected) {
        console.log('🔒 Tab fechada - desconectando wallet automaticamente...');
        disconnect();
        // Clear sensitive data
        localStorage.removeItem('wagmi.wallet');
        localStorage.removeItem('wagmi.chain');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isConnected, disconnect]);

  // ✅ CRITICAL: Validate RPC health before minting
  const checkRPCHealth = async () => {
    const now = Date.now();
    
    // Avoid spam - only check every 30 seconds
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
