'use client';

import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useRef } from 'react';

/**
 * Hook que automaticamente pede assinatura quando o user conecta a wallet
 * Pede assinatura SEMPRE ao conectar (não usa localStorage)
 */
export function useAutoSignOnConnect() {
  const { address, isConnected } = useAccount();
  const { signMessage, isPending: isSigning } = useSignMessage();
  const addressRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      // Reset quando desconecta
      addressRef.current = null;
      return;
    }

    // Se mudou de carteira ou conectou uma nova, pede assinatura
    if (addressRef.current === address) {
      // Mesmo endereço já está sendo processado
      return;
    }

    // Novo endereço conectado - pedir assinatura
    addressRef.current = address;

    // Esperar um pouquinho pra wallet estar pronta (UI atualizar)
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
            // Pode tentar de novo se rejeitar
          },
        }
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [isConnected, address, signMessage]);

  return { isSigning };
}
