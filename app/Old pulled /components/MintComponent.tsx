'use client';

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain, useDisconnect, useConnect, useReconnect } from 'wagmi';
import { parseEther } from 'viem';
import { base, sepolia } from 'viem/chains';
import { useEffect, useState } from 'react';
import NFTImageDisplay from './NFTImageDisplay';
import BasePayButton from './BasePayButton';
import AddAdminButton from './AddAdminButton';
import DebugPanel from './DebugPanel';
import TxTracker from './TxTracker';
import CustomAnimatedText from './CustomAnimatedText';
import mintText from '../content/mintText';
import CodePoem from './CodePoem';
import { APP_SCALE, CONTRACT_ADDRESS } from '../config/baseConfig';

// ConnectButtonArea removed: manager-only flow uses OnchainKit modal + coinbaseWallet/walletConnect fallbacks

const MINT_PRICE = '0.00001';

const CONTRACT_ABI = [
  {
    type: 'function',
    name: 'mint',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'payAndMint',
    inputs: [
      { name: '_artistContract', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_paymentId', type: 'string' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
];

export default function MintComponent() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { reconnect } = useReconnect();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uiPhase, setUiPhase] = useState<'welcome'|'preconnect'|'connected'|'firing'|'success'|'examine'>('welcome');
  const [crawlText, setCrawlText] = useState<string | null>(null);
  const [eternalId, setEternalId] = useState<number | null>(null);

  const { data: hash, writeContract, isPending: isMinting, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (writeError) {
      setError(writeError.message || 'Minting failed. Please try again.');
      setSuccessMessage(null);
    }
    if (isConfirmed) {
      // success UI
      setUiPhase('success');
      const id = Math.floor(Date.now() % 100000);
      setEternalId(id);
      setSuccessMessage(`Success! You Ëngraved the chain! Transaction: ${hash?.substring(0, 6)}...${hash?.slice(-4)}`);
      setError(null);
    }
  }, [writeError, isConfirmed, hash]);

  // persist tx to tracker when writeContract produces a hash
  useEffect(() => {
    if (!hash) return;
    try {
      const raw = localStorage.getItem('whaaaaa_txs_v1');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift({ id: hash, type: 'tx', createdAt: Date.now(), status: 'pending', rpc: process.env.NEXT_PUBLIC_BASE_RPC || process.env.NEXT_PUBLIC_BASE_MAIN_RPC || '' });
      localStorage.setItem('whaaaaa_txs_v1', JSON.stringify(arr));
    } catch (e) {
      // ignore
    }
  }, [hash]);

  // UI phase transitions: welcome -> preconnect
  useEffect(() => {
    const t = setTimeout(() => setUiPhase('preconnect'), 1400);
    return () => clearTimeout(t);
  }, []);

  // when connected, update UI
  useEffect(() => {
    if (isConnected) setUiPhase('connected');
    else setUiPhase((p) => (p === 'success' || p === 'examine') ? p : 'preconnect');
  }, [isConnected]);

  // crawl messages while firing
  useEffect(() => {
    let iv: any;
    const crawl = [
      'you just ordered a perpetual motion mood ring for the entire cryptosphere',
      'completing an eternal transactional soul',
      'completing an eternal transactional soul — almost there',
    ];
    if (uiPhase === 'firing') {
      let i = 0;
      setCrawlText(crawl[0]);
      iv = setInterval(() => {
        i = (i + 1) % crawl.length;
        setCrawlText(crawl[i]);
      }, 2200);
    } else {
      setCrawlText(null);
    }
    return () => { if (iv) clearInterval(iv); };
  }, [uiPhase]);

  const handleMint = () => {
    if (!isConnected) {
      setError('Please connect your wallet first.');
      return;
    }
    // Allow Base mainnet by default. If NEXT_PUBLIC_ALLOW_SEPOLIA is "true",
    // permit testing on Sepolia as well (minimal, opt-in for local/dev testing).
    const allowSepolia = process.env.NEXT_PUBLIC_ALLOW_SEPOLIA === 'true';
    const allowed = chainId === base.id || (allowSepolia && chainId === sepolia.id);
    if (!allowed) {
      const targetChain = allowSepolia ? sepolia.id : base.id;
      const human = allowSepolia ? 'Sepolia (testnet)' : 'Base mainnet (chain 8453)';
      if (switchChain) {
        switchChain({ chainId: targetChain });
        setError(`Por favor, mude sua carteira para ${human}.`);
      } else {
        setError(`Por favor, mude sua carteira para ${human}.`);
      }
      return;
    }
    setError(null);
    setSuccessMessage(null);
    // Prefer Gallery.payAndMint flow when gallery + mfer addresses are configured
    const galleryAddr = process.env.NEXT_PUBLIC_GALLERY_ADDRESS || '';
    const mferAddr = process.env.NEXT_PUBLIC_MFER_ADDRESS || process.env.NEXT_PUBLIC_MFER || '';
    const toAddr = process.env.NEXT_PUBLIC_ARTIST_ADDRESS || process.env.NEXT_PUBLIC_ARTIST || process.env.NEXT_PUBLIC_TO_ADDRESS || '';
    const paymentId = `frontend-${Date.now()}`;

    if (galleryAddr && mferAddr && toAddr) {
      writeContract({
        address: galleryAddr as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'payAndMint',
        args: [mferAddr, toAddr, paymentId],
        value: parseEther(MINT_PRICE),
      });
      return;
    }

    // Fallback: call mint directly on configured contract
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'mint',
      value: parseEther(MINT_PRICE),
    });
  };

  const nftMetadata = {
    name: 'Mfer',
    description: 'This is not animation; it\'s a <strong>ritual</strong>',
    attributes: [
      { trait_type: 'Collection', value: 'Mfer-0-base' },
      { trait_type: 'Chain', value: 'Base' },
      { trait_type: 'The soul spins at ', value: 'This base is where that smile comes home.' },
    ],
  };

  const [method, setMethod] = useState<'wallet' | 'basepay'>('wallet');
  const [receiptInfo, setReceiptInfo] = useState<any>(null);
  const [useOnchainKit, setUseOnchainKit] = useState(false);
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);
  const [lastPaymentSdkId, setLastPaymentSdkId] = useState<string | null>(null);
  const [isDelayingConnect, setIsDelayingConnect] = useState(false);
  const [showConnectorMenu, setShowConnectorMenu] = useState(false);
  
  const checkReceipt = async (txHash?: string) => {
    if (!txHash) return;
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC || process.env.NEXT_PUBLIC_BASE_MAIN_RPC || 'https://base-mainnet.public.rpc';
      const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getTransactionReceipt', params: [txHash] }),
      });
      const json = await res.json();
      setReceiptInfo(json.result || json);
    } catch (e) {
      setReceiptInfo({ error: String(e) });
    }
  };

  return (
    <div style={styles.container}>
      <CodePoem />
      <AddAdminButton />
      <DebugPanel />
      <div style={{ ...styles.verticalContent }}>

        {/* Método de pagamento e UI de conexão unificados */}


        <div style={styles.imageSection}>
          <NFTImageDisplay metadata={nftMetadata} />
        </div>

        {/* Unified connect / pay UI: single button opens wallet connectors; Base Pay can be chosen below */}
        <div style={{ width: '100%', margin: '0.6rem 0 0.6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
          <div style={{ width: '95%' }}>
            {!isConnected ? (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <button
                  onClick={async () => {
                    if (isDelayingConnect) return; // debounce
                    setError(null);
                    setIsDelayingConnect(true);
                    // keep the animated text visible for a short moment as an attraction
                    setUiPhase('welcome');
                    try {
                      await new Promise((res) => setTimeout(res, 1600));
                      // Neutral connect flow: do not programmatically open a manager modal.
                      // Attempt to connect using the available wagmi connector as a fallback.
                      try {
                        const coinbaseConn = connectors?.find((c: any) => /coinbase/i.test(String(c?.name || ''))) || connectors?.[0];
                        if (coinbaseConn) await connect({ connector: coinbaseConn });
                      } catch (e) { console.error(e); }
                    } catch (e: any) {
                      setError(String(e?.message || e));
                    } finally {
                      setIsDelayingConnect(false);
                    }
                  }}
                  style={{ ...styles.button, padding: '0.7rem 0.9rem', width: '100%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}
                >
                  {/* Button text machine for welcome / preconnect */}
                  {uiPhase === 'welcome' && <CustomAnimatedText text={mintText.welcome} />}
                  {uiPhase === 'preconnect' && <CustomAnimatedText text={mintText.preconnect} />}
                  {uiPhase === 'connected' && <>
                    <CustomAnimatedText text={mintText.connected} />
                    <small style={{ color: '#e9ffd8' }}>IN — you're IN to get</small>
                  </>}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                  <button
                    onClick={() => disconnect()}
                    style={{
                      ...styles.button,
                      fontSize: '1.0rem',
                      borderRadius: '10px',
                      padding: '0.5rem 0.8rem',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      width: 'auto',
                    }}
                  >
                    Disconnect
                  </button>
                  <div style={{ alignSelf: 'center', color: '#fff' }}>{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}</div>
                </div>
                <button
                  onClick={() => {
                    setUiPhase('firing');
                    handleMint();
                  }}
                  disabled={!isConnected || isMinting || isConfirming}
                  style={{
                    ...styles.button,
                    fontSize: '1.0rem',
                    padding: '0.9rem 0',
                    borderRadius: '10px',
                    width: '100%',
                    background: 'linear-gradient(90deg, #00c6fb 0%, #005bea 100%)',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    alignItems: 'center'
                  }}
                >
                  {/* Primary centered label */}
                  <span style={{ fontWeight: 800 }}>function getEternalLoop()</span>
                  {/* Secondary state text */}
                  {isMinting && <small>Transaction sent — awaiting wallet confirm...</small>}
                  {isConfirming && <small>On-chain: minting...</small>}
                  {!isMinting && !isConfirming && <small>{useOnchainKit ? 'Mint (OnchainKit)' : "You're IN — click to get"}</small>}
                </button>
              </div>
            )}

            {/* Farcaster connection is handled by the Farcaster app UI; no host shortcut here. */}

            <div style={{ marginTop: 10 }}>
              <button onClick={() => setMethod('basepay')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#9fdcee', padding: '6px 8px', borderRadius: 8 }}>Pay with Base Pay</button>
              {method === 'basepay' && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <label style={{ color: '#fff', alignSelf: 'center' }}>
                      <input type="checkbox" checked={useOnchainKit} onChange={(e) => setUseOnchainKit(e.target.checked)} /> Use OnchainKit (Base Pay)
                    </label>
                  </div>
                  <BasePayButton
                    amountEth={MINT_PRICE}
                    to={process.env.NEXT_PUBLIC_GALLERY_ADDRESS || CONTRACT_ADDRESS}
                    onSuccess={(paymentId, sdkId) => {
                      setLastPaymentId(paymentId || null);
                      setLastPaymentSdkId(sdkId || null);
                      setSuccessMessage(`Submitted via Base Pay: ${paymentId}${sdkId ? ` (sdk:${sdkId})` : ''}`);
                      try {
                        const raw = localStorage.getItem('whaaaaa_payments_v1');
                        const arr = raw ? JSON.parse(raw) : [];
                        arr.unshift({ paymentId, sdkId: sdkId || null, to: process.env.NEXT_PUBLIC_GALLERY_ADDRESS || CONTRACT_ADDRESS, amountEth: MINT_PRICE, createdAt: Date.now(), status: 'pending' });
                        localStorage.setItem('whaaaaa_payments_v1', JSON.stringify(arr));
                      } catch (e) {}
                      try {
                        const raw2 = localStorage.getItem('whaaaaa_txs_v1');
                        const arr2 = raw2 ? JSON.parse(raw2) : [];
                        arr2.unshift({ id: paymentId, type: 'payment', createdAt: Date.now(), status: 'pending', sdkId: sdkId || null });
                        localStorage.setItem('whaaaaa_txs_v1', JSON.stringify(arr2));
                      } catch (e) {}
                    }}
                    onError={(e) => setError(e?.message || String(e))}
                  />
                </div>
              )}
            </div>

            {/* Connector chooser popup */}
            {showConnectorMenu && (
              <div style={{ position: 'absolute', left: 20, top: 20, zIndex: 8, background: 'rgba(0,0,0,0.7)', padding: 12, borderRadius: 8 }}>
                <div style={{ color: '#fff', marginBottom: 8, fontWeight: 700 }}>Choose wallet</div>
                {(connectors || []).map((c: any, idx: number) => (
                  <div key={`conn-${idx}`} style={{ marginBottom: 6 }}>
                    <button onClick={async () => {
                      try {
                        await connect({ connector: c });
                        setShowConnectorMenu(false);
                      } catch (err) {
                        console.error(err);
                        setError(String(err));
                      }
                    }} style={{ padding: '6px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: '#fff', border: 'none' }}>{c?.name || `Connector ${idx+1}`}</button>
                  </div>
                ))}
                <div style={{ textAlign: 'right', marginTop: 6 }}><button onClick={() => setShowConnectorMenu(false)} style={{ padding: '6px 8px', borderRadius: 8 }}>Close</button></div>
              </div>
            )}
          </div>

          {/* Tx tracking */}
          <div style={{ marginTop: 10, width: '95%' }}>
            {hash && (
              <div style={{ color: '#fff' }}>
                <div>Tx: <a href={(process.env.NEXT_PUBLIC_EXPLORER_TX || 'https://basescan.org/tx/') + hash} target="_blank" rel="noreferrer" style={{ color: '#9fdcee' }}>{hash}</a></div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <button onClick={() => checkReceipt(hash)} style={{ padding: '6px 8px', borderRadius: 6 }}>Check receipt</button>
                  <a href={(process.env.NEXT_PUBLIC_EXPLORER_TX || 'https://basescan.org/tx/') + hash} target="_blank" rel="noreferrer"><button style={{ padding: '6px 8px', borderRadius: 6 }}>Open explorer</button></a>
                </div>
                {receiptInfo && <pre style={{ color: '#ddd', whiteSpace: 'pre-wrap', marginTop: 8 }}>{JSON.stringify(receiptInfo, null, 2)}</pre>}
              </div>
            )}

            {lastPaymentId && (
              <div style={{ marginTop: 8, color: '#fff' }}>
                <div>Payment id: <span style={{ color: '#9fdcee' }}>{lastPaymentId}</span></div>
                {lastPaymentSdkId && <div style={{ marginTop: 6 }}>Provider id: <span style={{ color: '#9fdcee' }}>{lastPaymentSdkId}</span></div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <button onClick={() => { navigator.clipboard?.writeText(lastPaymentId || ''); }} style={{ padding: '6px 8px', borderRadius: 6 }}>Copy id</button>
                  <button onClick={() => { try { const raw = localStorage.getItem('whaaaaa_payments_v1'); const arr = raw?JSON.parse(raw):[]; alert(JSON.stringify(arr.slice(0,5),null,2)); } catch(e){ alert('no data') } }} style={{ padding: '6px 8px', borderRadius: 6 }}>Show recent payments</button>
                </div>
              </div>
            )}
            <TxTracker />
          </div>
        </div>

        {/* Mensagens de erro/sucesso */}
        {error && <p style={styles.warning}>⚠️ {error}</p>}
        {successMessage && <p style={styles.success}>✅ {successMessage}</p>}

        {/* Detalhes integrados: Collection, Chain, Address, Price, Wallet, The soul spins at */}
        <div style={{ ...styles.contractInfo, marginTop: '0.0rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>Collection</span>
            <span style={{ color: '#00e6ff', fontWeight: 600 }}>Mfer-bk-0-base</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>Chain</span>
            <span style={{ color: '#00e6ff', fontWeight: 600 }}>Base</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>Address</span>
            <code style={{ ...styles.addressCode, background: 'none', padding: 0, color: '#fff' }}>{CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-6)}</code>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>Price</span>
            <span style={{ ...styles.price, color: '#fff' }}>{MINT_PRICE} ETH</span>
          </div>
          {isConnected && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>Wallet</span>
              <code style={{ ...styles.addressCode, background: 'none', padding: 0, color: '#fff' }}>{address?.slice(0, 10)}...</code>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0 }}>
            <span style={{ fontWeight: 600 }}>The soul spins at</span>
            <span style={{ color: '#00e6ff', fontWeight: 600 }}>This base is where that smile comes home.</span>
          </div>
        </div>


      </div>

      <style jsx>{`'main'
        code {
          font-family: 'Inter';
          font-size: 0.85rem;
          word-break: break-all;
        }

        small {
          color: #aaa;
          font-size: 0.75rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '640px',
    padding: '0.0rem',
  },
  verticalContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: '0rem',
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
  },
  imageSection: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  controlsSection: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  contractInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    color: 'white',
  },
  addressCode: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '0.5rem',
    borderRadius: '4px',
    display: 'block',
    marginTop: '0.1rem',
    wordBreak: 'break-all' as const,
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 'bold' as const,
    color: '#00ffff',
  },
  buttonGroup: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  button: {
    padding: '0.55rem 0.9rem',
    fontSize: '0.95rem',
    fontWeight: '600' as const,
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#00ffff',
    color: '#333',
    cursor: 'pointer' as const,
    transition: 'all 0.3s ease',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#888',
    color: '#ddd',
    cursor: 'not-allowed' as const,
    opacity: 0.6,
  },
  warning: {
    color: '#ffaa00',
    textAlign: 'center' as const,
    padding: '1rem',
    backgroundColor: 'rgba(255, 170, 0, 0.1)',
    borderRadius: '8px',
    fontSize: '0.95rem',
  },
  success: {
    color: '#6bff6b',
    textAlign: 'center' as const,
    padding: '1rem',
    backgroundColor: 'rgba(107, 255, 107, 0.1)',
    border: '1px solid rgba(107, 255, 107, 0.2)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    wordBreak: 'break-word' as const,
  },
  spinnerSmall: {
    width: '18px',
    height: '18px',
    border: '3px solid rgba(255,255,255,0.2)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
};
