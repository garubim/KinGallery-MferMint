'use client';

import { useState, useEffect } from 'react';
import { EIP1193Provider } from 'viem';

/**
 * 🔗 Farcaster Wallet Provider Hook
 * 
 * Provides EIP-1193 compatible Ethereum provider from Farcaster SDK
 * Seamlessly integrates with existing wagmi/viem wallet infrastructure
 */
export const useFarcasterWallet = () => {
  const [provider, setProvider] = useState<EIP1193Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initFarcasterProvider = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Import Farcaster SDK dynamically
        const { sdk } = await import('@farcaster/miniapp-sdk');
        
        // Wait for SDK to be ready
        await sdk.actions.ready();
        
        // Get Ethereum provider from Farcaster
        const ethProvider = sdk.wallet.getEthereumProvider();
        
        if (!ethProvider) {
          throw new Error('Farcaster Ethereum provider not available');
        }
        
        console.log('🔗 Farcaster Ethereum provider initialized');
        setProvider(ethProvider);
        
        // Listen for provider events
        ethProvider.on?.('accountsChanged', (accounts: string[]) => {
          console.log('🔄 Farcaster accounts changed:', accounts);
        });
        
        ethProvider.on?.('chainChanged', (chainId: string) => {
          console.log('🔄 Farcaster chain changed:', chainId);
        });
        
        return ethProvider;
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Failed to initialize Farcaster provider:', errorMsg);
        setError(errorMsg);
        setProvider(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    initFarcasterProvider();
  }, []);
  
  return {
    provider,
    isLoading,
    error,
  };
};

/**
 * 🎯 Farcaster Transaction Hook
 * 
 * Handles transactions specifically for Farcaster environment
 * Provides gas sponsorship and transaction management
 */
export const useFarcasterTransaction = () => {
  const { provider } = useFarcasterWallet();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const sendTransaction = async (txParams: {
    to: string;
    data: string;
    value?: string;
  }) => {
    if (!provider) {
      throw new Error('Farcaster provider not available');
    }
    
    try {
      setIsPending(true);
      setError(null);
      
      console.log('📤 Sending Farcaster transaction...', txParams);
      
      // Send transaction via Farcaster provider
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      }) as string;
      
      console.log('✅ Farcaster transaction sent:', txHash);
      setHash(txHash);
      
      return txHash;
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transaction failed');
      console.error('❌ Farcaster transaction failed:', error);
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };
  
  return {
    sendTransaction,
    isPending,
    hash,
    error,
  };
};