'use client';

import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { useState, useCallback, useEffect } from 'react';

export function useSecureWallet() {
  const { address, isConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { signMessage, isPending: isSigning } = useSignMessage();

  const [hasValidatedWithPasskey, setHasValidatedWithPasskey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Validar conexão com passkey (força biometria real)
  const validateWithPasskey = useCallback(async () => {
    if (!address) {
      console.error('❌ Nenhuma wallet conectada para validar');
      return false;
    }

    setIsValidating(true);
    console.log('🔐 Iniciando validação biométrica obrigatória...');

    try {
      // Força assinatura de uma mensagem - isso OBRIGA a Smart Wallet a pedir biometria
      const message = `KinGallery Security Validation\nAddress: ${address}\nTimestamp: ${new Date().toISOString()}\n\nAo assinar, você confirma sua identidade com biometria obrigatória.`;

      await new Promise<void>((resolve, reject) => {
        signMessage(
          { message },
          {
            onSuccess: () => {
              console.log('✅ Validação biométrica CONFIRMADA!');
              setHasValidatedWithPasskey(true);
              resolve();
            },
            onError: (error) => {
              console.error('❌ Validação biométrica REJEITADA:', error);
              reject(error);
            },
          }
        );
      });

      return true;
    } catch (error) {
      console.error('❌ Erro durante validação:', error);
      setHasValidatedWithPasskey(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [address, signMessage]);

  // Desconexão LIMPA - de verdade mesmo
  const secureDisconnect = useCallback(async () => {
    console.log('🚪 Iniciando desconexão segura e completa...');

    try {
      // 1. Desconectar do wagmi
      wagmiDisconnect();
      console.log('✓ Desconectado do wagmi');

      // 2. Limpar localStorage de forma que não reconecte
      try {
        const keysToRemove = [
          'wagmi.connected',
          'wagmi.store',
          'coinbaseWallet',
          'coinbaseWalletConnector',
          'WALLETCONNECT_DEEPLINK_CHOICE',
          'WEB3_CONNECT_RECENTLY_USED',
        ];

        keysToRemove.forEach((key) => {
          localStorage.removeItem(key);
          console.log(`✓ Removido localStorage: ${key}`);
        });
      } catch (e) {
        console.warn('⚠️ Erro ao limpar localStorage:', e);
      }

      // 3. Limpar sessionStorage também
      try {
        sessionStorage.clear();
        console.log('✓ SessionStorage limpo');
      } catch (e) {
        console.warn('⚠️ Erro ao limpar sessionStorage:', e);
      }

      // 4. Limpar estado de validação
      setHasValidatedWithPasskey(false);
      console.log('✓ Estado de validação resetado');

      // 5. Log final
      console.log('✅ Desconexão SEGURA e COMPLETA concluída!');
      console.log('📌 Na próxima recarga, nenhuma wallet se reconectará automaticamente.');

      return true;
    } catch (error) {
      console.error('❌ Erro durante desconexão segura:', error);
      return false;
    }
  }, [wagmiDisconnect]);

  // Resetar validação quando desconectar
  useEffect(() => {
    if (!isConnected) {
      setHasValidatedWithPasskey(false);
    }
  }, [isConnected]);

  return {
    // Estado
    address,
    isConnected,
    hasValidatedWithPasskey,
    isValidating,
    isSigning,

    // Ações
    validateWithPasskey,
    secureDisconnect,
  };
}
