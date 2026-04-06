'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getIPFSUrl, KNOWN_CIDs } from '@/lib/ipfs-helper';
// 🛡️ VAULT SYSTEM: Protected Magic Button (Feb 9, 2026)
import { SafeMagicButton } from '../vault';
import ArtworkMetadata from '../components/ArtworkMetadata';
import SocialShareIcons from '../components/SocialShareIcons';

export default function GalleryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [mounted, setMounted] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);
  const [loadingMints, setLoadingMints] = useState(false);
  const [rpcSource, setRpcSource] = useState<string>('none');
  const [rpcLogsCount, setRpcLogsCount] = useState<number>(0);
  const [rpcReturnedNoLogs, setRpcReturnedNoLogs] = useState<boolean>(false);
  const [rpcError, setRpcError] = useState<string | null>(null);
  const [lastQueriedContract, setLastQueriedContract] = useState<string>('');
  const [fetchAttemptCount, setFetchAttemptCount] = useState(0);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [revealEntangled, setRevealEntangled] = useState(true);
  
  // State for original Mfer metadata and image
  const [ethMferImageUrl, setEthMferImageUrl] = useState<string | null>(null);
  const [originalSmoke, setOriginalSmoke] = useState<boolean | undefined>(undefined);
  const [originalTransactionHash, setOriginalTransactionHash] = useState<string | null>(null);
  
  // Extract URL params for current mint
  const txHash = searchParams.get('tx');
  const ethMferIdString = searchParams.get('ethMferId');
  const ethMferId = ethMferIdString ? parseInt(ethMferIdString) : undefined; // Convert to number like 5d40bd5
  const urlTokenId = searchParams.get('tokenId');
  const tokenId = urlTokenId ? parseInt(urlTokenId) : undefined;
  const blockNumber = searchParams.get('blockNumber');
  const mintDate = searchParams.get('mintDate');
  
  // Parse collision info from URL
  let collisionInfo = null;
  try {
    const collisionParam = searchParams.get('collision');
    if (collisionParam) {
      collisionInfo = JSON.parse(decodeURIComponent(collisionParam));
    }
  } catch (e) {
    console.warn('Failed to parse collision info:', e);
  }

  // 🚀 ROBUST GALLERY FETCHING IMPLEMENTATION
  const fetchMintedNFTs = async () => {
    console.log('🔥 Starting robust 3-tier gallery fetch...');
    setLoadingMints(true);
    setRpcError(null);
    
    try {
      // Use configured Mfer contract or fallback to NEW entanglement contract 🔮
      const mferContractAddress = process.env.NEXT_PUBLIC_MFERBKOBASE_CONTRACT || process.env.NEXT_PUBLIC_MFER_ADDRESS || '0x887a664cb4f617e5a761ad9768bb59dccdd0f87b';
      console.log('🎯 Using contract address:', mferContractAddress);
      setLastQueriedContract(mferContractAddress);
      
      // 🚀 METHOD 1: Blockscout Base NFT API (Working!)
      try {
        console.log('📡 Attempting Blockscout Base API...');
        const blockscoutResponse = await fetch(`https://base.blockscout.com/api/v2/tokens/${mferContractAddress}/instances`);
        
        if (blockscoutResponse.ok) {
          const blockscoutData = await blockscoutResponse.json();
          console.log('✅ Blockscout API success:', blockscoutData?.items?.length || 0, 'tokens found');
          
          if (blockscoutData?.items?.length > 0) {
            const formattedNFTs = blockscoutData.items.map((item: any) => ({
              tokenId: parseInt(item.id),
              owner: item.owner?.hash || 'Unknown',
              blockNumber: 'Unknown', // Blockscout doesn't provide block number here
              txHash: 'Unknown', // Blockscout doesn't provide tx hash here
              mintDate: 'Recent', // Blockscout doesn't provide timestamp here
              title: `Mfer-0-#${item.id}/1000`
            }));
            
            // Sort by tokenId descending (highest first)
            const sortedNFTs = formattedNFTs.sort((a, b) => b.tokenId - a.tokenId);
            
            setMintedNFTs(sortedNFTs);
            setRpcSource('blockscout-api');
            setRpcLogsCount(sortedNFTs.length);
            setRpcReturnedNoLogs(false);
            console.log('🎉 METHOD 1 SUCCESS: Blockscout API delivered', sortedNFTs.length, 'tokens!');
            return;
          }
        }
        console.log('⚠️ Blockscout API returned empty or failed');
      } catch (apiError) {
        console.warn('❌ Blockscout API failed:', apiError);
      }

      // 🔄 METHOD 2: Smart Event Chunking 
      console.log('🔥 Attempting Smart Event Chunking...');
      const primaryRpc = 'https://api.developer.coinbase.com/rpc/v1/base/QDv2XZtiPNHyVtbLUsY5QT7UTHM6Re2N';
      
      const postRpc = async (endpoint: string, body: any) => {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        return await res.json();
      };

      // Get current block for chunking
      const currentBlockResponse = await postRpc(primaryRpc, {
        id: 1, jsonrpc: '2.0', method: 'eth_blockNumber', params: []
      });
      
      if (!currentBlockResponse.error) {
        const currentBlock = parseInt(currentBlockResponse.result, 16);
        const deployBlock = 19000000; // Approximate deployment block
        const chunkSize = 500; // Safe chunk size
        const totalBlocks = currentBlock - deployBlock;
        const chunks = Math.min(Math.ceil(totalBlocks / chunkSize), 20); // Max 20 chunks
        
        let allLogs: any[] = [];
        
        // Process chunks from most recent to oldest
        for (let i = chunks - 1; i >= 0 && allLogs.length < 50; i--) {
          const fromBlock = deployBlock + (i * chunkSize);
          const toBlock = i === chunks - 1 ? currentBlock : fromBlock + chunkSize - 1;
          
          try {
            const logsResponse = await postRpc(primaryRpc, {
              id: 1, jsonrpc: '2.0', method: 'eth_getLogs',
              params: [{
                address: mferContractAddress,
                topics: [
                  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer event
                  '0x0000000000000000000000000000000000000000000000000000000000000000', // from: 0x0 (mint)
                ],
                fromBlock: '0x' + fromBlock.toString(16),
                toBlock: '0x' + toBlock.toString(16)
              }]
            });

            if (logsResponse.result && Array.isArray(logsResponse.result)) {
              allLogs = [...allLogs, ...logsResponse.result];
              console.log(`✅ Chunk ${chunks - i} added ${logsResponse.result.length} logs (total: ${allLogs.length})`);
            }
            
            // Small delay between chunks
            if (i > 0) await new Promise(resolve => setTimeout(resolve, 100));
          } catch (chunkError) {
            console.error(`❌ Chunk ${chunks - i} failed:`, chunkError);
          }
        }

        if (allLogs.length > 0) {
          const formattedNFTs = allLogs.map(log => {
            const tokenId = parseInt(log.topics[3], 16);
            const blockNumber = parseInt(log.blockNumber, 16);
            return {
              tokenId,
              owner: '0x' + log.topics[2].slice(-40),
              blockNumber,
              txHash: log.transactionHash,
              mintDate: 'Recent',
              title: `Mfer-0-#${tokenId}/1000`
            };
          }).sort((a, b) => b.tokenId - a.tokenId);

          setMintedNFTs(formattedNFTs);
          setRpcSource('event-chunking');
          setRpcLogsCount(formattedNFTs.length);
          setRpcReturnedNoLogs(false);
          console.log('🎉 METHOD 2 SUCCESS: Event Chunking delivered', formattedNFTs.length, 'tokens!');
          return;
        }
      }

      // 🔄 METHOD 3: 800-block fallback
      console.log('🔥 Attempting 800-block fallback...');
      const currentBlockFallback = await postRpc(primaryRpc, {
        id: 1, jsonrpc: '2.0', method: 'eth_blockNumber', params: []
      });
      
      if (!currentBlockFallback.error) {
        const currentBlock = parseInt(currentBlockFallback.result, 16);
        const fromBlock = Math.max(currentBlock - 800, 19000000);

        const logsResponse = await postRpc(primaryRpc, {
          id: 1, jsonrpc: '2.0', method: 'eth_getLogs',
          params: [{
            address: mferContractAddress,
            topics: [
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              '0x0000000000000000000000000000000000000000000000000000000000000000',
            ],
            fromBlock: '0x' + fromBlock.toString(16),
            toBlock: '0x' + currentBlock.toString(16)
          }]
        });

        const logs = logsResponse.result || [];
        if (logs.length > 0) {
          const formattedNFTs = logs.map((log: any) => {
            const tokenId = parseInt(log.topics[3], 16);
            const blockNumber = parseInt(log.blockNumber, 16);
            return {
              tokenId,
              owner: '0x' + log.topics[2].slice(-40),
              blockNumber,
              txHash: log.transactionHash,
              mintDate: 'Recent',
              title: `Mfer-0-#${tokenId}/1000`
            };
          }).sort((a, b) => b.tokenId - a.tokenId);

          setMintedNFTs(formattedNFTs);
          setRpcSource('rpc-800');
          setRpcLogsCount(formattedNFTs.length);
          setRpcReturnedNoLogs(false);
          console.log('🎉 METHOD 3 SUCCESS: 800-block fallback delivered', formattedNFTs.length, 'tokens!');
          return;
        }
      }

      // 🚨 FINAL FALLBACK: Only show demo tokens in development
      const isDevelopment = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview';
      
      if (isDevelopment) {
        console.log('🎭 DEV MODE: Using emergency demo tokens');
        const emergencyTokens = [
          {
            tokenId: 13,
            owner: '0xbcd980d37293CBee62Bf5f93a26a0B744C18964D',
            blockNumber: 'Unknown',
            txHash: 'unavailable',
            mintDate: 'Recent',
            title: 'Mfer-0-#13/1000'
          },
          {
            tokenId: 12,
            owner: '0xbcd980d37293CBee62Bf5f93a26a0B744C18964D',
            blockNumber: 'Unknown',
            txHash: 'unavailable',
            mintDate: 'Recent',
            title: 'Mfer-0-#12/1000'
          }
        ];

        setMintedNFTs(emergencyTokens);
        setRpcSource('emergency-demo');
        setRpcLogsCount(emergencyTokens.length);
        setRpcReturnedNoLogs(true);
      } else {
        console.log('🏭 PRODUCTION MODE: No demo tokens, gallery empty until first real mint');
        setMintedNFTs([]);
        setRpcSource('production-empty');
        setRpcLogsCount(0);
        setRpcReturnedNoLogs(true);
      }

    } catch (overallError) {
      console.error('🚨 OVERALL fetchMintedNFTs ERROR:', overallError);
      setRpcError(overallError instanceof Error ? overallError.message : 'Unknown error occurred');
      setMintedNFTs([]);
      setRpcReturnedNoLogs(true);
    } finally {
      setLoadingMints(false);
      console.log('🏁 fetchMintedNFTs completed');
    }
  };

  // Load mints on component mount
  useEffect(() => {
    if (mounted) {
      console.log('🎯 Gallery mounted, loading minted NFTs...');
      fetchMintedNFTs();
    }
  }, [mounted]);

  // Auto-update when detected new mint from URL params
  useEffect(() => {
    if (searchParams.get('tx') && searchParams.get('ethMferId')) {
      console.log('🔄 New mint detected in URL, refreshing gallery...');
      const timer = setTimeout(() => {
        fetchMintedNFTs();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Component mount detection
  useEffect(() => {
    setMounted(true);
    
    const params = new URLSearchParams(window.location.search);
    const debugParam = params.get('debug');
    
    if (debugParam === 'true') {
      console.log('🧪 Debug mode enabled');
      setIsDebugMode(true);
    }
    
    // Fetch original Mfer metadata if we have ethMferId
    if (ethMferId) {
      console.log('🔍 Fetching original Mfer metadata #' + ethMferId);
      
      // Fetch complete metadata with image (correct URL from commit 5d40bd5)
      const ipfsBase = 'https://ipfs.io/ipfs/QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo';
      fetch(`${ipfsBase}/${ethMferId}`)
        .then(res => res.json())
        .then(metadata => {
          console.log('📝 Original Mfer metadata:', metadata);
          
          // Configure the image
          if (metadata.image) {
            const imageUrl = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
            setEthMferImageUrl(imageUrl);
            console.log('🖼️ Original Mfer image:', imageUrl);
          }
          
          // Detect smoke trait correctly
          if (metadata.attributes && Array.isArray(metadata.attributes)) {
            const smokeTrait = metadata.attributes.find(
              (attr: any) => 
                attr.trait_type?.toLowerCase().includes('smoke') ||
                attr.trait_type?.toLowerCase().includes('cigar')
            );
            
            if (smokeTrait) {
              const smokeValue = String(smokeTrait.value).toLowerCase();
              console.log('🔍 SMOKE TRAIT DEBUG:', {
                trait_type: smokeTrait.trait_type,
                value: smokeTrait.value,
                valueString: smokeValue,
                allAttributes: metadata.attributes
              });
              
              // 🚬 CORRECT LOGIC: 
              // - If smoke trait = "no" → false (rare)
              // - If smoke trait = anything else → true (common)
              const hasSmoke = !smokeValue.includes('no'); // Only false if explicitly "no"
              
              setOriginalSmoke(hasSmoke);
              console.log('🚬 SMOKE detected:', hasSmoke ? '✔️ A lot' : '❌ No way', 'from trait:', smokeTrait);
            } else {
              console.log('✅ No smoke trait found = DEFAULT TO SMOKE (most Mfers smoke)');
              setOriginalSmoke(true); // ✅ FIX: No smoke trait = DEFAULT has smoke
            }
          }
        })
        .catch(err => {
          console.warn('⚠️ Error fetching original Mfer metadata:', err);
          setOriginalSmoke(undefined);
        });
    }
    
    // 🚀 COMPLETE SEARCH: tokenId + blockNumber from transaction (as in commit 5d40bd5)
    if (txHash) {
      console.log('📡 Fetching transaction receipt:', txHash);
      fetch('https://mainnet.base.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log('📦 Transaction Receipt:', data.result);
        
        if (data.result) {
          // Extract tokenId from log (Transfer event)
          if (data.result?.logs) {
            const transferLog = data.result.logs.find((log: any) => 
              log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
            );
            if (transferLog?.topics[3]) {
              const tokenIdHex = transferLog.topics[3];
              const tokenIdNum = parseInt(tokenIdHex, 16);
              console.log('✨ Token ID extracted:', tokenIdNum);
              // Update URL with tokenId if necessary
              const currentUrl = new URL(window.location.href);
              if (!currentUrl.searchParams.has('tokenId')) {
                currentUrl.searchParams.set('tokenId', tokenIdNum.toString());
                window.history.replaceState({}, '', currentUrl.toString());
              }
            }
          }
        }
      })
      .catch(err => {
        console.warn('⚠️ Error fetching transaction receipt:', err);
      });
    }
  }, [ethMferId, txHash]);

  // Timer to hide confetti after 4 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Helper functions
  const getDemoRPCInfo = () => {
    if (rpcSource === 'base-indexer') {
      return { status: '✅ Base Official API', info: 'Using Base.org indexing service', logsCount: rpcLogsCount };
    } else if (rpcSource === 'event-chunking') {
      return { status: '🔄 Event Chunking', info: 'Smart chunking of blockchain events', logsCount: rpcLogsCount };
    } else if (rpcSource === 'rpc-800') {
      return { status: '📡 RPC 800-block', info: 'Fallback blockchain query', logsCount: rpcLogsCount };
    } else if (rpcSource === 'emergency-demo') {
      return { status: '🎭 Emergency Demo', info: 'All methods failed, showing demo', logsCount: rpcLogsCount };
    } else {
      return { status: '❓ Unknown', info: 'Data source unknown', logsCount: 0 };
    }
  };

  const getRPCSourceDisplay = () => {
    const info = getDemoRPCInfo();
    return `${info.status} (${info.logsCount} mints)`;
  };

  // Function to get token-specific image URL
  const getTokenImageUrl = (tokenId: number) => {
    // For now, all Mfer-0-Base tokens use the same artwork
    // In the future, this could fetch from tokenURI or use different CIDs
    return getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK);
  };

  // Don't render until mounted (prevent hydration mismatch)
  if (!mounted) {
    return <div>Loading gallery...</div>;
  }

  return (
    <div className="gallery-page">
      {showConfetti && (
        <div className="confetti-overlay">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['0', '1', '█', '▓', '▒', '░'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="gallery-header">
        <h1 className="gallery-title">KinGallery</h1>
        <p className="gallery-concept">
          The art isn't in the spin;<br />
          it's in that precise <span className="gallery-bold-moment">moment of recognition</span>
        </p>
      </div>

      <div className="main-container">
        {/* NFT Display */}
        <div className="nft-wrapper">
          <div className="glass-shell">
            <img 
              src={getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK)}
              alt="Your Mfer"
              className="nft-artwork"
            />
            <div className="glass-reflex">
              <img src="/ballon-reflexes-cutout.webp" alt="" className="reflex-layer reflex-1" />
              <img src="/reflexo-rightside-cutout.webp" alt="" className="reflex-layer reflex-2" />
            </div>
            
            <button 
              className="fullscreen-btn"
              onClick={() => window.open(getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK), '_blank')}
              title="View full size"
            >
              ⛶
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="metadata-wrapper">
          <ArtworkMetadata 
            showPricing={false}
            tokenId={tokenId || undefined}
            entangledMferId={ethMferId || undefined}
            ethMferImageUrl={ethMferImageUrl || undefined}
            transactionHash={txHash || undefined}
            mintDate={mintDate || undefined}
            blockNumber={blockNumber || undefined}
            collisionInfo={collisionInfo || undefined}
            originalSmoke={originalSmoke}
            originalTransactionHash={originalTransactionHash || undefined}
          />
          
          {/* 📱 SOCIAL SHARE ICONS - Always show for sharing gallery */}
          <SocialShareIcons 
            tokenId={tokenId}
            ethMferId={ethMferId}
            transactionHash={txHash || undefined}
          />
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mosaic-section">
        {/* RPC Debug Badge */}
        {rpcSource && (
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginRight: '8px' }}>RPC:</span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(0,230,255,0.9)' }}>{rpcSource}</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginLeft: '8px' }}>
              ({rpcLogsCount ?? 0} logs)
            </span>
          </div>
        )}

        <div className="mosaic-grid">
          {loadingMints ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.6)' }}>
              Loading collection...
            </div>
          ) : mintedNFTs.length > 0 ? (
            mintedNFTs.map((nft) => (
              <div 
                key={nft.tokenId} 
                className="mosaic-item" 
                title={`${nft.title} • Minted: ${nft.mintDate} • Owner: ${nft.owner.slice(0, 6)}...`}
                onClick={() => {
                  // Build complete URL with all available parameters
                  const params = new URLSearchParams();
                  if (nft.txHash && nft.txHash !== 'Unknown' && nft.txHash !== 'unavailable') {
                    params.set('tx', nft.txHash);
                  }
                  if (nft.tokenId) {
                    params.set('tokenId', nft.tokenId.toString());
                  }
                  if (nft.blockNumber && nft.blockNumber !== 'Unknown') {
                    params.set('blockNumber', nft.blockNumber.toString());
                  }
                  if (nft.mintDate && nft.mintDate !== 'Recent') {
                    params.set('mintDate', nft.mintDate);
                  }
                  
                  // For now, navigate to current page with new parameters
                  // In future: could implement ethMferId lookup for full entanglement
                  const url = `${window.location.origin}/gallery?${params.toString()}`;
                  window.open(url, '_blank');
                }}
              >
                <img 
                  src={getTokenImageUrl(nft.tokenId)}
                  alt={nft.title}
                  className="mosaic-img"
                  onError={(e) => {
                    console.warn(`Failed to load image for token ${nft.tokenId}, using fallback`);
                    e.currentTarget.src = getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK);
                  }}
                />
                <div className="mosaic-overlay">
                  <span className="mosaic-id">#{nft.tokenId}</span>
                </div>
                <div className="mosaic-info">
                  <div className="mosaic-title">{nft.title}</div>
                  <div className="mosaic-date">{nft.mintDate}</div>
                  <div className="mosaic-owner">{nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}</div>
                  <div style={{ marginTop: '4px', fontSize: '7px', color: 'rgba(0,230,255,0.8)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    tx: {nft.txHash?.slice(0, 8)}...
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.6)' }}>
              <div style={{ marginBottom: '12px' }}>No mints found</div>
              <button
                onClick={() => fetchMintedNFTs()}
                disabled={loadingMints}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: loadingMints ? 'rgba(100, 100, 100, 0.08)' : 'rgba(0, 230, 255, 0.08)',
                  border: loadingMints ? '1px solid rgba(100, 100, 100, 0.14)' : '1px solid rgba(0, 230, 255, 0.14)',
                  color: loadingMints ? 'rgba(255,255,255,0.4)' : 'white',
                  cursor: loadingMints ? 'wait' : 'pointer'
                }}
              >
                {loadingMints ? '⏳ Loading...' : '🔄 Refresh'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .gallery-page {
          min-height: 100vh;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
          background: #000000;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          position: relative;
          overflow-x: hidden;
        }

        .gallery-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: calc(50% + 8px);
          transform: translateX(-50%);
          width: min(470px, 100vw);
          height: 100%;
          background: url('/walls/disc-wall-brightgold.webp');
          background-size: cover;
          background-position: center;
          pointer-events: none;
          z-index: 0;
        }

        .confetti-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1000;
        }

        .confetti-particle {
          position: absolute;
          top: -20px;
          font-size: 24px;
          color: rgba(0, 230, 255, 0.8);
          animation: fall linear forwards;
        }

        @keyframes fall {
          to { 
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .gallery-header {
          text-align: center;
          padding: 30px 25px;
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 360px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          margin-top: 20px;
        }

        .gallery-title {
          font-size: 1.5rem;
          margin: 0;
          margin-bottom: 8px;
          color: rgba(60, 60, 60, 0.95);
          font-weight: 600;
          letter-spacing: 0.05em;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          text-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.2),
            0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .gallery-concept {
          color: rgba(80, 80, 80, 0.75);
          font-size: 0.95rem;
          margin: 0;
          letter-spacing: 0.02em;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 400;
          line-height: 1.6;
          font-style: italic;
        }

        .gallery-bold-moment {
          font-weight: 600;
          color: rgba(80, 80, 80, 0.85);
        }

        .main-container {
          width: 100%;
          max-width: 384px;
          min-width: 0px;
          margin: 20px auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
          align-items: center;
          justify-content: flex-start;
          position: relative;
          z-index: 2;
          padding: 0;
        }

        .nft-wrapper {
          position: relative;
          width: 100%;
          max-width: 384px;
          margin: 0 auto;
        }

        .glass-shell {
          position: relative;
          width: 100%;
          max-width: 384px;
          aspect-ratio: 3/4;
          margin: 0 auto;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0);
          backdrop-filter: blur(20px);
          border: 8px solid rgb(70, 50, 21);
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 10px 20px rgba(0, 0, 0, 0.8);
          overflow: hidden;
        }

        .nft-artwork {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
          position: relative;
          z-index: 1;
        }

        .glass-reflex {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }

        .reflex-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
          mix-blend-mode: screen;
        }

        .fullscreen-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          background: transparent;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }

        .fullscreen-btn:hover {
          background: rgba(0, 0, 0, 0.3);
          color: white;
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }

        .metadata-wrapper {
          width: 100%;
          max-width: 354px;
          display: flex;
          flex-direction: column;
          gap: 0px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 20px 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .mosaic-section {
          width: 100%;
          max-width: 384px;
          margin: 40px auto 0;
          padding: 40px 0px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 2;
        }

        .mosaic-grid {
          display: grid;
          grid-template-columns: repeat(3, 110px);
          gap: 8px;
          justify-content: center;
          margin: 0 auto;
          width: 100%;
          max-width: 360px;
        }

        .mosaic-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .mosaic-item:hover {
          transform: scale(1.05);
        }

        .mosaic-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mosaic-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
          display: flex;
          align-items: flex-end;
          padding: 12px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .mosaic-item:hover .mosaic-overlay {
          opacity: 1;
        }

        .mosaic-id {
          font-size: 14px;
          font-weight: 600;
          color: white;
        }

        .mosaic-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: white;
          padding: 12px 8px 8px 8px;
          font-size: 9px;
          opacity: 0;
          transition: opacity 0.3s;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mosaic-item:hover .mosaic-info {
          opacity: 1;
        }

        .mosaic-title {
          font-weight: 600;
          font-size: 10px;
        }

        .mosaic-date {
          color: rgba(255, 200, 100, 0.9);
          font-size: 8px;
        }

        .mosaic-owner {
          color: rgba(0, 150, 255, 0.9);
          font-size: 8px;
          font-family: 'Monaco', monospace;
        }
      `}</style>

      {/* 🛡️ PROTECTED Magic Button - Vault System Active */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <SafeMagicButton isOnGalleryPage={true} />
      </div>
    </div>
  );
}