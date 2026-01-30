'use client';

import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useSwitchChain, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { encodeFunctionData } from 'viem';
import { base } from 'viem/chains';
import { useCDPSecurity } from '@/app/hooks/useCDPSecurity';
import { mapTransactionError, validateTransactionInput, TransactionState } from '@/app/utils/transactionValidation';

export default function MagicMintButton({ isOnGalleryPage = false }: { isOnGalleryPage?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address, isConnected, chain } = useAccount();
  const { sendTransaction, data: hash, isPending, error: txError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Pre-deployment security hooks
  const { rpcHealthy, checkRPCHealth } = useCDPSecurity();
  
  // Debug: Atalho para pular direto pra success screen
  useEffect(() => {
    const debugMint = searchParams.get('debugMint');
    if (debugMint === 'success') {
      setShowSuccessOverlay(true);
      // Auto-redirect after 3.5s
      const timer = setTimeout(() => {
        router.push('/gallery?debug=true&tx=debug');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);
  
  const [mounted, setMounted] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showMinting, setShowMinting] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const [confetti, setConfetti] = useState<Array<{id: number, left: number, delay: number}>>([]);
  const [transactionState, setTransactionState] = useState<TransactionState>({ status: 'idle' });
  const [touchStart, setTouchStart] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [connectingWalletType, setConnectingWalletType] = useState<'smart' | 'eoa' | 'wc' | 'extension' | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Evita hydration error
  useEffect(() => {
    setMounted(true);
    // Debug: Log initial connection state
    console.log('🎯 MagicMintButton mounted', {
      isConnected,
      address,
      chainId: chain?.id,
      chainName: chain?.name,
    });
  }, []);

  // Debug: Track wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      console.log('✅ Wallet CONNECTED:', {
        address,
        chain: chain?.name,
        chainId: chain?.id,
        timestamp: new Date().toLocaleTimeString(),
      });
      console.log('🔍 Debugging passkey: If you saw this log WITHOUT typing biometrics, the passkey was skipped!');
    } else {
      console.log('❌ Wallet DISCONNECTED');
    }
  }, [isConnected, address, chain]);

  // Debug: Track connection attempts
  useEffect(() => {
    if (isConnecting) {
      console.log('⏳ Wallet connection IN PROGRESS...');
    }
  }, [isConnecting]);

  // Troca automaticamente para Base quando conecta em rede errada
  useEffect(() => {
    if (isConnected && chain && chain.id !== base.id) {
      console.log('🚨 WRONG NETWORK!', { currentChain: chain?.id, chainName: chain?.name, targetChain: base.id });
      
      // Immediate visual warning
      alert(`⚠️ WRONG NETWORK!\n\nYou are on ${chain?.name || 'an unknown network'} (chain ${chain?.id}).\n\nSwitching to Base (chain 8453)...\n\n💡 Your wallet will ask for permission to switch networks.`);
      
      // Tries to switch to Base with retry
      const attemptSwitch = async () => {
        try {
          await switchChain?.({ chainId: base.id });
          console.log('✅ Successfully switched to Base network!');
        } catch (error: any) {
          console.error('❌ Error switching network:', error);
          // Auto Retry after 1 second
          setTimeout(() => {
            console.log('🔄 Trying again...');
            switchChain?.({ chainId: base.id });
          }, 1000);
        }
      };
      
      attemptSwitch();
    }
    if (isConnected && address && chain?.id === base.id) {
      console.log('✅ Wallet connected to BASE:', { address, chain: chain?.name });
    }
  }, [isConnected, chain, address, switchChain]);


  // Reset connectingWalletType when connection ends or modal closes
  useEffect(() => {
    if (isConnected || !showWalletModal) {
      setConnectingWalletType(null);
    }
  }, [isConnected, showWalletModal]);


  const handleRightSideClick = () => {
    if (!showSuccessOverlay || !hash) return;
    
    console.log('🎬 Right click! Navigating to page 2...');
    const lastSixHash = hash.slice(-6);
    const lastSixNum = parseInt(lastSixHash, 16);
    let ethMferId = (lastSixNum % 9999) + 1;
    
    const existingMints = JSON.parse(localStorage.getItem('mferMints') || '[]');
    const hasCollision = existingMints.some((mint: any) => mint.ethMferId === ethMferId);
    
    let collisionInfo = null;
    if (hasCollision) {
      const firstSixHash = hash.slice(2, 8);
      const firstSixNum = parseInt(firstSixHash, 16);
      const collisionEthMferId = (firstSixNum % 9999) + 1;
      const originalMferNumber = (ethMferId + collisionEthMferId) % 10000;
      
      collisionInfo = {
        type: 'collision',
        lastSixEthMferId: ethMferId,
        firstSixEthMferId: collisionEthMferId,
        originalMferNumber: originalMferNumber || 1,
        message: `🌠 Hash Collision! Your mint moved up the ranking and connects to the Original Mfers #${originalMferNumber || 1} on ETH`
      };
      ethMferId = collisionEthMferId;
    }
    
    const params = new URLSearchParams({
      tx: hash,
      ethMferId: ethMferId.toString(),
      ...(collisionInfo && { collision: JSON.stringify(collisionInfo) })
    });
    
    window.location.href = `/gallery?${params.toString()}`;
  };

  const handleMint = async () => {
    // 🔄 If on page 2 (gallery), redirect to home (page 1) instead of minting
    if (isOnGalleryPage) {
      // Use full-page navigation to preserve wallet state (location replace behavior)
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return;
    }

    if (!address) return;
    
    // ✅ PRE-DEPLOYMENT: Validates RPC health BEFORE minting
    const rpcIsHealthy = await checkRPCHealth();
    if (!rpcIsHealthy) {
      const errorInfo = mapTransactionError({ message: 'RPC endpoint is not responding' });
      setErrorMessage('⚠️ RPC is having issues. Please wait a few seconds and try again.');
      setShowError(true);
      setShowMinting(false);
      console.warn('🚨 RPC is not healthy. Aborting mint.');
      return;
    }
    
    // CRITIC: Verifies if connected to Base before minting
    if (chain?.id !== base.id) {
      alert(`⚠️ WRONG NETWORK!\n\nYou are connected to ${chain?.name || 'an unknown network'}.\nPlease switch to BASE in your wallet before minting.\n\n(Ethereum gas costs ~100x more!)`);
      // Tries to switch automatically
      try {
        await switchChain?.({ chainId: base.id });
      } catch (error) {
        console.error('Error switching network:', error);
      }
      return;
    }
    
    console.log('🎯 Starting mint...', { chain: chain?.name, chainId: chain?.id, rpcHealthy });
    
    try {
      // Generates unique paymentId as string (KinGallery and MferBk0Base now use string)
      const paymentIdString = `magic-${Date.now()}`;
      
      console.log('🔑 PaymentId:', { string: paymentIdString });
      
      const data = encodeFunctionData({
        abi: [{
          type: 'function',
          name: 'payAndMint',
          inputs: [
            { name: '_artistContract', type: 'address' },
            { name: '_to', type: 'address' },
            { name: '_paymentId', type: 'string' },
          ],
          outputs: [],
          stateMutability: 'payable',
        }],
        functionName: 'payAndMint',
        args: [
          (process.env.NEXT_PUBLIC_MFER_ADDRESS || '0xaA566959e0290cB578b1F0dfFA7203E1F9DDd1D6') as `0x${string}`,
          address,
          paymentIdString,
        ],
      });

      // ✅ PRE-DEPLOYMENT: Validates critical inputs BEFORE sending
      const kingalleryAddress = (process.env.NEXT_PUBLIC_KINGALLERY_ADDRESS || '0xebc497a5c36cb1a9264fd122a586b3f461fcc568') as `0x${string}`;
      
      const validation = validateTransactionInput({
        to: kingalleryAddress,
        value: BigInt('300000000000000'),
        data,
        chainId: base.id,
      });

      if (!validation.valid) {
        setErrorMessage(`❌ Validation error: ${validation.error}`);
        setShowError(true);
        console.error('❌ Validation failed:', validation.error);
        return;
      }

      console.log('📤 Sending transaction...', {
        to: kingalleryAddress,
        value: '0.0003 ETH',
        chainId: base.id,
      });

      setShowMinting(true);
      setTransactionState({ status: 'pending', hash: 'pending...' });
      
      sendTransaction({
        to: kingalleryAddress,
        value: BigInt('300000000000000'),
        data,
        chainId: base.id,
      });
    } catch (error: any) {
      console.error('❌ Erro no mint:', error);
      const errorInfo = mapTransactionError(error);
      setErrorMessage(errorInfo.message);
      setShowError(true);
      setShowMinting(false);
      setTransactionState({
        status: 'error',
        error: error,
        errorCode: errorInfo.code,
        isRetryable: errorInfo.isRetryable,
      });
    }
  };

  // Detects and handles transaction errors with smart mapping
  useEffect(() => {
    if (txError || receiptError) {
      const error = txError || receiptError;
      
      // ✅ Uses smart error mapping function
      const errorInfo = mapTransactionError(error);
      
      console.error('🚨 TRANSACTION ERROR:', {
        type: txError ? 'sendTransaction' : 'receipt',
        error: errorInfo.message,
        code: errorInfo.code,
        isRetryable: errorInfo.isRetryable,
        details: error
      });
      
      setErrorMessage(errorInfo.message);
      setShowError(true);
      setShowMinting(false);
      setTransactionState({
        status: 'error',
        error: error,
        errorCode: errorInfo.code,
        isRetryable: errorInfo.isRetryable,
      });
    }
  }, [txError, receiptError]);

  // ✅ PRE-DEPLOYMENT: Tracks transaction state changes
  useEffect(() => {
    if (hash && isPending) {
      setTransactionState({ status: 'pending', hash });
      console.log('📡 Transaction sent:', hash);
    } else if (isSuccess && hash) {
      setTransactionState({ status: 'success', hash });
      console.log('✅ Transaction confirmed:', hash);
    }
  }, [hash, isPending, isSuccess]);

  // Waits for transaction to be confirmed, then redirects IMMEDIATELY
  // Page 2 animation starts with a 1s delay to avoid clashing with entry
  useEffect(() => {
    if (showMinting && isSuccess && hash && !hasRedirected) {
      console.log('✅ MINT Success! Redirecting IMMEDIATELY to page 2...', { hash, isSuccess });
      
      // 🚀 OPTION B: Redirect IMMEDIATELY (does not wait for animation to complete)
      const lastSixHash = hash.slice(-6);
      const lastSixNum = parseInt(lastSixHash, 16);
      const ethMferId = (lastSixNum % 9999) + 1;
      const params = new URLSearchParams({
        tx: hash,
        ethMferId: ethMferId.toString()
      });
      
      // Mark as redirected to prevent double redirect
      setHasRedirected(true);
      
      // ⏱️ WAIT FOR 10s MEDIA TO COMPLETE before redirecting (10.5s total)
      // This allows the user to see the 10s animation completely
      setTimeout(() => {
        const target = `/gallery?tx=${encodeURIComponent(hash)}&ethMferId=${encodeURIComponent(ethMferId.toString())}`;
        console.log('📡 Redirecting to gallery (client):', { target });
        try {
          // Use string form to avoid router internal type errors
          router.push(target);
        } catch (err) {
          console.error('❌ router.push failed, falling back to full navigation:', err);
          window.location.href = target;
        }
      }, 10500);
      
      // Shows success overlay while navigating (won't be seen, but gets ready)
      setShowSuccessOverlay(true);
      setCountdown(10); // Countdown of 10 seconds (animation duration)
      
      // Generates confetti (will be rendered on page 2 with a 1s delay)
      const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3
      }));
      setConfetti(confettiPieces);
    }
  }, [showMinting, isSuccess, hash, hasRedirected]);

  // Renders empty until mounted on client
  if (!mounted) {
    return (
      <div className="magic-button-container">
        <div 
          className={`glass-shell ${showSuccessOverlay ? 'success-ready' : ''}`}
          onClick={handleRightSideClick}
        >
          <img 
            src="/MagicButton-OfficialAnimatedTitles/MagicButton_Titles-Welcome-to-Connect+MBlur+Alpha-1920x1080px-AnimatedWebP-HighQ-minsize-Lossy-Inf-loop.webp"
            alt=""
            className="magic-animation"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`magic-button-container ${isSliding ? 'slide-out' : ''} ${showError ? 'error-active' : ''}`}>
      {/* Success Overlay removido - animações vão rodar na página 2 */}

      {/* Magic button - Main animation */}
      {showWalletModal && (
        <div className="wallet-modal-overlay" onClick={() => setShowWalletModal(false)}>
          <div className="wallet-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="wallet-modal-close" onClick={() => setShowWalletModal(false)}>×</button>
            <h2 style={{ color: 'white', marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>Connect Wallet</h2>
            
            {/* Friendly status message during wallet connection */}
            {isConnecting && connectingWalletType && (
              <div style={{
                backgroundColor: 'rgba(74, 158, 255, 0.15)',
                border: '1px solid #4a9eff',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px',
                fontSize: '14px',
                color: '#b0d4ff',
                textAlign: 'center'
              }}>
                {connectingWalletType === 'eoa' && (
                  <>
                    <div>🔐 Signing your identity...</div>
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#8ab4ff' }}>
                      Your wallet will request a signature to confirm you are the owner of this wallet.
                    </div>
                  </>
                )}
                {connectingWalletType === 'smart' && (
                  <>
                    <div>🔐 Opening your Passkey...</div>
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#8ab4ff' }}>
                      Use biometrics or PIN to verify your identity.
                    </div>
                  </>
                )}
                {connectingWalletType === 'extension' && (
                  <>
                    <div>🔐 Connecting extension...</div>
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#8ab4ff' }}>
                      Please check your wallet popup or extension window.
                    </div>
                  </>
                )}
                {connectingWalletType === 'wc' && (
                  <>
                    <div>🔐 Scan the QR Code...</div>
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#8ab4ff' }}>
                      Use your mobile wallet to approve the connection.
                    </div>
                  </>
                )}
              </div>
            )}
            
            {!isConnected ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 🔷 Base Smart Account - Passkey apenas */}
                <button
                  onClick={() => {
                    const smartWalletConnector = connectors.find(
                      (c, idx) => c.id === 'coinbaseWalletSDK' && idx === 1
                    );
                    if (smartWalletConnector) {
                      setConnectingWalletType('smart');
                      connect({ connector: smartWalletConnector, chainId: base.id });
                      setShowWalletModal(false);
                    }
                  }}
                  disabled={isConnecting}
                  className="wallet-connect-btn wallet-connect-btn-primary"
                >
                  🔷 Base Smart Account (Passkey)
                  {isConnecting && ' (Connecting...)'}
                </button>

                {/* 💳 Coinbase Wallet - Non-custodial EOA */}
                <button
                  onClick={() => {
                    const eaoConnector = connectors.find(
                      (c, idx) => c.id === 'coinbaseWalletSDK' && idx === 0
                    );
                    if (eaoConnector) {
                      setConnectingWalletType('eoa');
                      connect({ connector: eaoConnector, chainId: base.id });
                      setShowWalletModal(false);
                    }
                  }}
                  disabled={isConnecting}
                  className="wallet-connect-btn"
                >
                  💳 Coinbase Wallet (EOA)
                  {isConnecting && ' (Connecting...)'}
                </button>
                
                {/* 🔗 WalletConnect - For extensions and mobile */}
                <button
                  onClick={() => {
                    const wcConnector = connectors.find(c => c.id === 'walletConnect');
                    if (wcConnector) {
                      setConnectingWalletType('wc');
                      connect({ connector: wcConnector, chainId: base.id });
                      setShowWalletModal(false);
                    }
                  }}
                  disabled={isConnecting}
                  className="wallet-connect-btn"
                >
                  🔗 WalletConnect (QR Code)
                  {isConnecting && ' (Connecting...)'}
                </button>

                {/* Detect all installed extensions */}
                {connectors
                  .filter(c => 
                    c.id !== 'coinbaseWalletSDK' && 
                    c.id !== 'walletConnect' &&
                    c.id !== 'injected' // Remove generic 'injected', show specific ones
                  )
                  .map((connector, idx) => {
                    let icon = '🦊'; // Default
                    if (connector.name?.toLowerCase().includes('zerion')) {
                      icon = '🟣'; // Zerion
                    } else if (connector.name?.toLowerCase().includes('metamask')) {
                      icon = '🦊'; // MetaMask
                    } else if (connector.name?.toLowerCase().includes('brave')) {
                      icon = '🦁'; // Brave
                    } else if (connector.name?.toLowerCase().includes('coinbase')) {
                      icon = '🔷'; // Coinbase injected
                    } else if (connector.name?.toLowerCase().includes('trust')) {
                      icon = '🛡️'; // Trust Wallet
                    } else if (connector.name?.toLowerCase().includes('exodus')) {
                      icon = '📤'; // Exodus
                    }
                    
                    return (
                      <button
                        key={`${connector.id}-${idx}`}
                        onClick={() => {
                          setConnectingWalletType('extension');
                          connect({ connector, chainId: base.id });
                          setShowWalletModal(false);
                        }}
                        disabled={isConnecting}
                        className="wallet-connect-btn"
                      >
                        {icon} {connector.name}
                        {isConnecting && ' (Connecting...)'}
                      </button>
                    );
                  })}

                {/* Fallback: show generic 'injected' if no extensions detected */}
                {connectors.filter(c => c.id !== 'coinbaseWalletSDK' && c.id !== 'walletConnect').length === 1 && (
                  <button
                    onClick={() => {
                      const injectedConnector = connectors.find(c => c.id === 'injected');
                      if (injectedConnector) {
                        connect({ connector: injectedConnector, chainId: base.id });
                        setShowWalletModal(false);
                      }
                    }}
                    disabled={isConnecting}
                    className="wallet-connect-btn"
                  >
                    🦊 {connectors.find(c => c.id === 'injected')?.name || 'Browser Wallet'}
                    {isConnecting && ' (Connecting...)'}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ color: 'white', fontSize: '14px' }}>
                  <strong>Connected:</strong><br/>
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <button onClick={() => disconnect()} className="wallet-disconnect-btn">
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showError && (
        <div className="error-modal-overlay" onClick={() => setShowError(false)}>
          <div className="error-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="error-modal-close" onClick={() => setShowError(false)}>×</button>
            <h2 style={{ color: '#ff6b6b', marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>Transaction Error</h2>
            
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '24px',
              padding: '16px',
              background: 'rgba(255, 107, 107, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {errorMessage}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <button 
                onClick={() => {
                  setShowError(false);
                  handleMint();
                }}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(0, 230, 255, 0.2)',
                  border: '1px solid rgba(0, 230, 255, 0.5)',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 230, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 230, 255, 0.2)'}
              >
                🔄 Try Again
              </button>

              <button 
                onClick={() => setShowError(false)}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                Close
              </button>
            </div>

            <div style={{ 
              marginTop: '16px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.4)',
              textAlign: 'center'
            }}>
              If the problem persists, check your wallet and network connection.
            </div>
          </div>
        </div>
      )}

      {/* Glass cocoon - contains WebP animation */}
      <div className="glass-shell">
        {/* Background WebP animation */}
        <img 
          src={showMinting
            ? "/MagicButton-OfficialAnimatedTitles/MintStatus-Success+TITLES+Mfer-on-Base+OriginalMfers+Entanglement-Status+Alpha+Mblur-1280x720px-size0,700-WebP-High.webp"
            : isConnected 
            ? "/MagicButton-OfficialAnimatedTitles/MagicButton_LOGIN-to-MINT-COMPLETE+Alpha-1280x720px-30fps-AnimatedWebP-HighQ-Lossy-Letterbox-20pcent.webp"
            : "/MagicButton-OfficialAnimatedTitles/MagicButton_Titles-Welcome-to-Connect+MBlur+Alpha-1920x1080px-AnimatedWebP-HighQ-minsize-Lossy-Inf-loop.webp"
          }
          alt=""
          className="magic-animation"
        />

        {/* Glass reflex layer - all three layers now use new reflections from Pack 02 WebP */}
        <div className="glass-reflex">
          <img 
            src="/MagicButton-OfficialAnimatedTitles/Magic-Button-New-reflexes-Pack-02-1280x720pxWebP-High+Alpha-which.webp"
            alt=""
            className="reflex-layer reflex-1"
          />
          <img 
            src="/MagicButton-OfficialAnimatedTitles/Magic-Button-New-reflexes-Pack-02-1280x720pxWebP-High+Alpha-which.webp" 
            alt=""
            className="reflex-layer reflex-2"
          />
          <img 
            src="/MagicButton-OfficialAnimatedTitles/Magic-Button-New-reflexes-Pack-02-1280x720pxWebP-High+Alpha-which.webp"
            alt=""
            className="reflex-layer reflex-3"
          />
        </div>

        {/* Loading overlay - appears when wallet is connecting */}
        {isPending && (
          <div className="loading-overlay">
            <img 
              src="/MagicButton-OfficialAnimatedTitles/Legacy-Mfer-Loading-Loop+FoggyBG-Pretty+ALPHA-SEMI-TRANSP-1280X1080px-WebPAnim-HighQ.webp"
              alt="Loading..."
              className="loading-animation"
            />
          </div>
        )}

        {/* Invisible but functional button */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button 
            onClick={!isConnected 
              ? () => setShowWalletModal(true)
              : chain?.id !== base.id 
              ? () => {
                  alert(`⚠️ WRONG NETWORK!\n\nYou are on ${chain?.name || 'an unknown network'}.\n\nPlease switch to BASE in your wallet.`);
                  switchChain?.({ chainId: base.id });
                }
              : showSuccessOverlay
              ? () => {
                  // ✨ RITUAL COMPLETE - Redirects to page 2
                  const lastSixHash = hash.slice(-6);
                  const lastSixNum = parseInt(lastSixHash, 16);
                  const ethMferId = (lastSixNum % 9999) + 1;
                  const params = new URLSearchParams({
                    tx: hash,
                    ethMferId: ethMferId.toString()
                  });
                  window.location.href = `/gallery?${params.toString()}`;
                }
              : handleMint
            }
            onTouchStart={(e) => {
              if (!showSuccessOverlay) return;
              setTouchStart(e.touches[0].clientX);
            }}
            onTouchEnd={(e) => {
              if (!showSuccessOverlay || touchStart === 0) return;
              const touchEnd = e.changedTouches[0].clientX;
              const swipeDistance = touchEnd - touchStart;
              
              // Swipe direita > 50px
              if (swipeDistance > 50) {
                console.log('➡️ SWIPE DIREITA DETECTADO!');
                const lastSixHash = hash.slice(-6);
                const lastSixNum = parseInt(lastSixHash, 16);
                const ethMferId = (lastSixNum % 9999) + 1;
                const params = new URLSearchParams({
                  tx: hash,
                  ethMferId: ethMferId.toString()
                });
                window.location.href = `/gallery?${params.toString()}`;
              }
              setTouchStart(0);
            }}
            onMouseDown={() => {
              if (!showSuccessOverlay) return;
              
              // Long press detection - 0.7s
              const timer = setTimeout(() => {
                console.log('🖱️ LONG PRESS DETECTADO!');
                const lastSixHash = hash.slice(-6);
                const lastSixNum = parseInt(lastSixHash, 16);
                const ethMferId = (lastSixNum % 9999) + 1;
                const params = new URLSearchParams({
                  tx: hash,
                  ethMferId: ethMferId.toString()
                });
                window.location.href = `/gallery?${params.toString()}`;
              }, 700);
              
              setLongPressTimer(timer);
            }}
            onMouseUp={() => {
              if (longPressTimer) clearTimeout(longPressTimer);
            }}
            onMouseLeave={() => {
              if (longPressTimer) clearTimeout(longPressTimer);
            }}
            disabled={isPending || isConfirming || (isConnected && chain?.id !== base.id)}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              cursor: (isPending || isConfirming || (isConnected && chain?.id !== base.id)) 
                ? (isConnected && chain?.id !== base.id ? 'not-allowed' : 'wait') 
                : showSuccessOverlay ? 'grab'
                : 'pointer',
              fontSize: 0,
              lineHeight: 0,
              color: 'transparent',
            }}
            aria-label={!isConnected ? 'Connect Wallet' : chain?.id !== base.id ? 'Switch to Base' : showSuccessOverlay ? 'Go to Gallery' : 'Mint NFT'}
          />
        </div>
      </div>

      <style jsx>{`
        .block-height-overlay {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 24px;
          font-weight: 600;
          color: rgba(0, 230, 255, 0.9);
          background: rgba(0, 0, 0, 0.5);
          padding: 12px 24px;
          border-radius: 8px;
          animation: pulse 2s ease infinite;
          backdrop-filter: blur(10px);
        }

        .reveal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.5s ease;
        }

        .reveal-content {
          text-align: center;
          color: white;
          animation: scaleIn 0.8s ease;
        }

        .reveal-title {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 16px;
        }

        .reveal-mfer {
          font-size: 56px;
          font-weight: 700;
          background: linear-gradient(135deg, #00e6ff, #ff00e6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 24px;
        }

        .reveal-subtitle {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes crawl {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        .wallet-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wallet-modal-content {
          position: relative;
          background: rgba(20, 20, 30, 0.95);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(0, 230, 255, 0.3);
          border: 1px solid rgba(0, 230, 255, 0.2);
          min-width: 320px;
        }

        .wallet-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          color: white;
          font-size: 28px;
          cursor: pointer;
          line-height: 1;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .wallet-modal-close:hover {
          opacity: 1;
        }

        .wallet-connect-btn {
          background: linear-gradient(135deg, rgba(0, 230, 255, 0.2), rgba(0, 150, 255, 0.2));
          border: 1px solid rgba(0, 230, 255, 0.4);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .wallet-connect-btn-primary {
          background: linear-gradient(135deg, rgba(0, 82, 255, 0.4), rgba(0, 230, 255, 0.4));
          border: 2px solid rgba(0, 230, 255, 0.6);
          box-shadow: 0 4px 12px rgba(0, 230, 255, 0.3);
        }

        .wallet-connect-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(0, 230, 255, 0.3), rgba(0, 150, 255, 0.3));
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 230, 255, 0.3);
        }

        .wallet-connect-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .wallet-connect-btn:disabled {
          opacity: 0.5;
          cursor: wait;
        }

        .wallet-disconnect-btn {
          background: rgba(255, 50, 50, 0.2);
          border: 1px solid rgba(255, 50, 50, 0.4);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .wallet-disconnect-btn:hover {
          background: rgba(255, 50, 50, 0.3);
          transform: translateY(-2px);
        }

        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-100vw);
          }
        }

        .magic-button-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 17px;
          margin-bottom: 20px;
          transition: all 3s cubic-bezier(0.77, 0, 0.175, 1);
        }

        .magic-button-container.slide-out {
          animation: slideOutLeft 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
          pointer-events: none;
        }

        /* Pause all animations when error modal is active */
        .magic-button-container.error-active {
          pointer-events: none;
        }

        /* Allow interaction with error modal even with pointer-events: none on parent */
        .magic-button-container.error-active .error-modal-overlay {
          pointer-events: auto;
        }

        .magic-button-container.error-active .magic-animation {
          animation-play-state: paused !important;
        }

        .magic-button-container.error-active .glass-shell {
          filter: blur(2px) brightness(0.7);
          opacity: 0.6;
        }

        .glass-shell {
          position: relative;
          width: 480px;
          height: 190px;
          border-radius: 120px;
          background: rgba(54, 32, 3, 0.08);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .glass-shell:hover {
          transform: scale(1.02);
          box-shadow: 
            0 12px 48px rgba(0, 230, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .glass-shell:active {
          transform: scale(0.98);
          box-shadow: 
            0 4px 16px rgba(0, 230, 255, 0.15),
            inset 0 2px 4px rgba(0, 0, 0, 0.3);
          transition: all 0.1s ease;
        }

        .glass-shell.success-ready {
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(10, 140, 80, 0.3));
        }

        .glass-shell.success-ready::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 40%;
          background: linear-gradient(90deg, rgba(0, 200, 100, 0) 0%, rgba(0, 255, 150, 0.5) 100%);
          border-radius: 0 24px 24px 0;
          opacity: 1;
          animation: greenGlowPulse 2s ease-in-out infinite;
          z-index: 4;
          pointer-events: none;
        }

        @keyframes greenGlowPulse {
          0%, 100% {
            opacity: 0.3;
            filter: blur(2px);
          }
          50% {
            opacity: 0.6;
            filter: blur(4px);
          }
        }

        .glass-shell.success-ready:hover::after {
          animation: greenGlowIntense 1.5s ease-in-out infinite;
        }

        @keyframes greenGlowIntense {
          0%, 100% {
            opacity: 0.6;
            filter: blur(3px);
          }
          50% {
            opacity: 0.9;
            filter: blur(6px);
          }
        }

        .magic-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1.2);
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
          opacity: 0.98;
          z-index: 1;
          will-change: transform;
        }

        .glass-reflex {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
          mix-blend-mode: lighten;
          opacity: 0.7;
        }

        .reflex-layer {
          position: absolute;
          width: 100%;
          height: 200%;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
          transform: translate(-50%, -50%);
          left: 50%;
          top: 50%;
        }

        .reflex-1 {
          opacity: 0.7;
        }

        .reflex-2 {
          opacity: 0.9;
          filter: brightness(0.8);
        }

        /* Loading overlay - wallet connecting */
        .loading-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(1px);
          z-index: 50;
          animation: fadeIn 0.4s ease;
          border-radius: 24px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Success Overlay */
        .success-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9998;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }

        .success-content {
          position: relative;
          background: rgba(20, 200, 100, 0.95);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 255, 100, 0.3);
          border: 2px solid rgba(0, 255, 100, 0.5);
          min-width: 320px;
          max-width: 500px;
          text-align: center;
          animation: slideDown 0.4s ease;
        }

        .success-content h2 {
          font-size: 32px;
          color: white;
          margin: 0 0 16px 0;
          font-weight: bold;
        }

        .success-content p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          margin: 8px 0;
        }

        .success-content .transaction-hash {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-family: monospace;
          word-break: break-all;
          margin-top: 16px;
        }

        .success-content .loading-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 16px;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        .loading-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
          border-radius: 24px;
        }

        /* Error Modal Styles */
        .error-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .error-modal-content {
          position: relative;
          background: rgba(20, 20, 30, 0.95);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(255, 107, 107, 0.2);
          border: 1px solid rgba(255, 107, 107, 0.3);
          min-width: 320px;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 28px;
          cursor: pointer;
          line-height: 1;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .error-modal-close:hover {
          opacity: 1;
          color: white;
        }

        /* ========== NOVOS ESTILOS: SUCCESS OVERLAY EXPANDIDO ========== */

        /* Confetti Animation */
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotateZ(360deg);
            opacity: 0;
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9997;
        }

        .confetti-piece {
          position: absolute;
          font-size: 24px;
          opacity: 1;
          will-change: transform;
        }

        /* Backdrop Escuro */
        .success-overlay-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9998;
          animation: fadeIn 0.4s ease;
        }

        /* Success Badge - Reduzido e Semi-Transparente */
        .success-overlay-expanded {
          position: fixed;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
        }

        .success-content-expanded {
          position: relative;
          background: linear-gradient(135deg, rgba(10, 140, 80, 0.85), rgba(20, 180, 120, 0.85));
          border-radius: 24px;
          padding: 20px 32px;
          box-shadow: 
            0 12px 40px rgba(0, 255, 150, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 150, 0.5);
          min-width: 280px;
          max-width: 400px;
          text-align: center;
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: auto;
          backdrop-filter: blur(10px);
        }

        /* Checkmark Grande e Animado */
        .success-checkmark {
          font-size: 80px;
          margin-bottom: 24px;
          display: inline-block;
          animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Title */
        .success-content-expanded h1 {
          font-size: 48px;
          font-weight: 900;
          color: white;
          margin: 0 0 16px 0;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          animation: slideDown 0.6s ease 0.3s backwards;
        }

        /* Description */
        .success-description {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.95);
          margin: 0 0 32px 0;
          animation: slideDown 0.6s ease 0.4s backwards;
        }

        /* Hash Box */
        .success-hash-box {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin: 32px 0;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideDown 0.6s ease 0.5s backwards;
        }

        .hash-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 8px 0;
        }

        .hash-value {
          font-size: 16px;
          font-family: 'Courier New', monospace;
          color: rgba(0, 255, 150, 1);
          margin: 8px 0;
          word-break: break-all;
          font-weight: bold;
        }

        .hash-link {
          display: inline-block;
          margin-top: 12px;
          padding: 8px 16px;
          background: rgba(0, 255, 150, 0.2);
          border: 1px solid rgba(0, 255, 150, 0.5);
          border-radius: 8px;
          color: rgba(0, 255, 150, 1);
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s;
          cursor: pointer;
        }

        .hash-link:hover {
          background: rgba(0, 255, 150, 0.3);
          border-color: rgba(0, 255, 150, 0.8);
          transform: translateY(-2px);
        }

        /* Countdown Container */
        .countdown-container {
          margin: 40px 0;
          animation: slideDown 0.6s ease 0.6s backwards;
        }

        .countdown-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 3px solid rgba(0, 255, 150, 0.6);
          margin: 0 auto 16px;
          position: relative;
          box-shadow: 
            0 0 0 2px rgba(0, 255, 150, 0.2),
            inset 0 0 20px rgba(0, 255, 150, 0.1);
        }

        .countdown-inner {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .countdown-number {
          font-size: 56px;
          font-weight: 900;
          color: rgba(0, 255, 150, 1);
          line-height: 1;
        }

        .countdown-label {
          font-size: 24px;
          color: rgba(0, 255, 150, 0.8);
        }

        .countdown-text {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
          font-weight: 500;
        }

        /* Progress Bar */
        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
          overflow: hidden;
          margin: 24px 0;
          border: 1px solid rgba(0, 255, 150, 0.3);
          animation: slideDown 0.6s ease 0.7s backwards;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, rgba(0, 255, 150, 0.6), rgba(0, 200, 100, 1));
          border-radius: 3px;
          box-shadow: 0 0 10px rgba(0, 255, 150, 0.6);
        }

        /* "View NFT Now" button */
        .see-nft-button {
          background: linear-gradient(135deg, rgba(0, 255, 150, 0.3), rgba(0, 200, 100, 0.3));
          border: 2px solid rgba(0, 255, 150, 0.7);
          color: white;
          padding: 16px 40px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 16px;
          animation: slideDown 0.6s ease 0.8s backwards;
          box-shadow: 0 8px 24px rgba(0, 255, 150, 0.2);
        }

        .see-nft-button:hover {
          background: linear-gradient(135deg, rgba(0, 255, 150, 0.5), rgba(0, 200, 100, 0.5));
          border-color: rgba(0, 255, 150, 1);
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(0, 255, 150, 0.4);
        }

        .see-nft-button:active {
          transform: translateY(-2px);
        }

        /* Pulse Ring */
        @keyframes pulseRing {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 255, 150, 0.7);
          }
          70% {
            box-shadow: 0 0 0 30px rgba(0, 255, 150, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 255, 150, 0);
          }
        }

        .pulse-ring {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(0, 255, 150, 0.2);
          animation: pulseRing 2s infinite;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}