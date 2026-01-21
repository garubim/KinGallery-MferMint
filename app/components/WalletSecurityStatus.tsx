'use client';

import React, { useState } from 'react';
import { useSecureWallet } from '@/app/hooks/useSecureWallet';

export function WalletSecurityStatus() {
  const {
    address,
    isConnected,
    hasValidatedWithPasskey,
    isValidating,
    validateWithPasskey,
    secureDisconnect,
  } = useSecureWallet();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  if (!isConnected || !address) {
    return null; // Não mostra nada se desconectado
  }

  const handleValidateClick = async () => {
    const success = await validateWithPasskey();
    if (success) {
      setShowDropdown(false);
    }
  };

  const handleDisconnectClick = async () => {
    setIsDisconnecting(true);
    const success = await secureDisconnect();
    if (success) {
      setShowDropdown(false);
      // Reload para limpar qualquer cache
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
    setIsDisconnecting(false);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 1000,
      }}
    >
      {/* Badge Principal */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: hasValidatedWithPasskey
            ? 'rgba(0, 255, 136, 0.15)' // Verde quando validado
            : 'rgba(255, 153, 0, 0.15)', // Laranja quando conectado mas não validado
          border: `1px solid ${hasValidatedWithPasskey ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255, 153, 0, 0.4)'}`,
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
          color: hasValidatedWithPasskey ? '#00ff88' : '#ff9900',
          fontFamily: 'monospace',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: '500',
        }}
        title={
          hasValidatedWithPasskey
            ? 'Wallet validada com segurança biométrica'
            : 'Wallet conectada mas não validada - clique para validar'
        }
      >
        {hasValidatedWithPasskey ? (
          <>
            <span>🔒</span> {/* Cadeado quando validado */}
            <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
          </>
        ) : (
          <>
            <span>⚠️</span> {/* Aviso quando não validado */}
            <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'rgba(10, 10, 20, 0.95)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: '8px',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            minWidth: '280px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
          }}
        >
          {/* Header - Endereço */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
              background: 'rgba(0, 255, 136, 0.05)',
            }}
          >
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
              ENDEREÇO DA CARTEIRA
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#00ff88',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}
            >
              {address}
            </div>
          </div>

          {/* Status de Validação */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
            }}
          >
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
              STATUS DE SEGURANÇA
            </div>
            {hasValidatedWithPasskey ? (
              <div style={{ fontSize: '12px', color: '#00ff88', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔒</span>
                <span>Validada com biometria</span>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: '#ff9900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚠️</span>
                <span>Conectada mas não validada</span>
              </div>
            )}
          </div>

          {/* Ação: Validar com Biometria */}
          {!hasValidatedWithPasskey && (
            <button
              onClick={handleValidateClick}
              disabled={isValidating}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'rgba(255, 153, 0, 0.15)',
                color: '#ff9900',
                fontSize: '12px',
                fontWeight: '500',
                cursor: isValidating ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
                opacity: isValidating ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (!isValidating) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 153, 0, 0.25)';
                }
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 153, 0, 0.15)';
              }}
            >
              {isValidating ? '🔐 Validando com biometria...' : '🔐 Validar com Biometria'}
            </button>
          )}

          {/* Ação: Desconectar */}
          <button
            onClick={handleDisconnectClick}
            disabled={isDisconnecting}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              background: 'rgba(255, 50, 50, 0.15)',
              color: '#ff3232',
              fontSize: '12px',
              fontWeight: '500',
              cursor: isDisconnecting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isDisconnecting ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!isDisconnecting) {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 50, 50, 0.25)';
              }
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 50, 50, 0.15)';
            }}
          >
            {isDisconnecting ? '🚪 Desconectando...' : '🚪 Desconectar de Verdade'}
          </button>

          {/* Footer - Info */}
          <div
            style={{
              padding: '8px 16px',
              fontSize: '10px',
              color: '#666',
              background: 'rgba(0, 0, 0, 0.3)',
              lineHeight: '1.4',
            }}
          >
            ℹ️ <strong>Desconectar de Verdade</strong> remove todos os dados de sessão. Você precisará reconectar na próxima visita.
          </div>
        </div>
      )}

      {/* Fechar dropdown ao clicar fora */}
      {showDropdown && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
