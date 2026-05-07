'use client';

import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useRef } from 'react';

/**
 * Hook that automatically requests a signature when the user connects their wallet
 * Requests signature EVERY TIME on connect (does not use localStorage)
 */
export function useAutoSignOnConnect() {
  const { address, isConnected } = useAccount();
  const { signMessage, isPending: isSigning } = useSignMessage();
  const addressRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      // Reset when disconnected
      addressRef.current = null;
      return;
    }

    // If wallet changed or a new one connected, request signature
    if (addressRef.current === address) {
      // Same address already being processed
      return;
    }

    // New address connected - request signature
    addressRef.current = address;

    // Wait a moment for the wallet to be ready (UI to update)
    const timer = setTimeout(() => {
      const message = `Sign to verify your wallet for KinGallery\n\nAddress: ${address}\nTimestamp: ${new Date().toISOString()}`;
      
      signMessage(
        { message },
        {
          onSuccess: (signature) => {
            console.log('✅ Wallet signed successfully:', address);
          },
          onError: (error) => {
            console.warn('⚠️ User rejected signature:', error.message);
            // Can retry if rejected
          },
        }
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [isConnected, address, signMessage]);

  return { isSigning };
}
