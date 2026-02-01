'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getIPFSUrl, KNOWN_CIDs } from '@/lib/ipfs-helper';
import ArtworkMetadata from '../components/ArtworkMetadata';
import MagicMintButton from '../components/MagicMintButton';

export default function GalleryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [ethMferId, setEthMferId] = useState<number | null>(null);
  const [ethMferImageUrl, setEthMferImageUrl] = useState<string | null>(null);
  const [mintDate, setMintDate] = useState<string | null>(null);
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [collisionInfo, setCollisionInfo] = useState<any | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [revealEntangled, setRevealEntangled] = useState(false);
  const [activeTab, setActiveTab] = useState<'collection' | 'yours'>('collection');
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);
  const [loadingMints, setLoadingMints] = useState(false); // ✅ FIX: Começa como false
  const [lastQueriedContract, setLastQueriedContract] = useState<string | null>(null);
  const [rpcReturnedNoLogs, setRpcReturnedNoLogs] = useState(false);
  const [rpcSource, setRpcSource] = useState<string | null>(null);
  const [rpcLogsCount, setRpcLogsCount] = useState<number | null>(null);
  const [fetchAttemptCount, setFetchAttemptCount] = useState(0); // 🛡️ Prevent infinite loops

  useEffect(() => {
    setMounted(true);
    const tx = searchParams.get('tx');
    const ethMfer = searchParams.get('ethMferId');
    const collision = searchParams.get('collision');
    
    // Armazena a tx para exibir como "certidão"
    if (tx) {
      setTxHash(tx);
    }
    
    // Parse collision info se existir
    if (collision) {
      try {
        const collisionData = JSON.parse(decodeURIComponent(collision));
        setCollisionInfo(collisionData);
        console.log('🌠 COLISÃO ESPECIAL DETECTADA:', collisionData);
      } catch (e) {
        console.error('Erro ao parsear collision:', e);
      }
    }
    
    // Armazena ethMferId (Legacy Mfer entangled)
    if (ethMfer) {
      setEthMferId(parseInt(ethMfer));
    }

    // 🚀 BUSCA COMPLETA: tokenId + blockNumber + timestamp da transação
    if (tx) {
      fetch('https://mainnet.base.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getTransactionReceipt',
          params: [tx]
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log('📦 Transaction Receipt:', data.result);
        
        if (data.result) {
          // Extrai tokenId do log (Transfer event)
          if (data.result?.logs) {
            const transferLog = data.result.logs.find((log: any) => 
              log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
            );
            if (transferLog?.topics[3]) {
              const tokenIdHex = transferLog.topics[3];
              const tokenIdNum = parseInt(tokenIdHex, 16);
              console.log('✨ Token ID:', tokenIdNum);
              setTokenId(tokenIdNum);
            }
          }
          
          // Extrai blockNumber
          if (data.result?.blockNumber) {
            const blockNum = parseInt(data.result.blockNumber, 16);
            console.log('📍 Block Number:', blockNum);
            setBlockNumber(blockNum);
          }
        }
      })
      .catch(err => console.error('❌ Erro ao buscar receipt:', err));

      // Busca timestamp do bloco
      setTimeout(() => {
        if (tx) {
          fetch('https://mainnet.base.org', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 2,
              method: 'eth_getTransactionByHash',
              params: [tx]
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.result?.blockNumber) {
              // Com o blockNumber, busca o timestamp do bloco
              const blockNumHex = data.result.blockNumber;
              return fetch('https://mainnet.base.org', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  id: 3,
                  method: 'eth_getBlockByNumber',
                  params: [blockNumHex, false]
                })
              });
            }
          })
          .then(res => res?.json())
          .then(data => {
            if (data.result?.timestamp) {
              // COMENTADO: não queremos a data do mint atual (2026), 
              // queremos a data do Mfer original (2021)
              // const timestamp = parseInt(data.result.timestamp, 16) * 1000;
              // const date = new Date(timestamp).toLocaleString('en-US', {
              //   year: 'numeric',
              //   month: 'long',
              //   day: '2-digit',
              //   hour: '2-digit',
              //   minute: '2-digit'
              // });
              // console.log('📅 Mint Date:', date);
              // setMintDate(date);
              console.log('📅 Skipping current mint date - using original Mfer date instead');
            }
          })
          .catch(err => console.error('❌ Erro ao buscar timestamp:', err));
        }
      }, 1000);
    }

    // 🎨 Busca imagem do Legacy Mfer entangled no IPFS
    if (ethMfer) {
      const mferId = parseInt(ethMfer);
      
      // Busca metadata do Mfer original
      fetch(`https://ipfs.io/ipfs/QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo/${mferId}`)
        .then(res => res.json())
        .then(metadata => {
          console.log(`🔍 Metadata completa do Mfer #${mferId}:`, metadata);
          
          if (metadata.image) {
            const imageUrl = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
            setEthMferImageUrl(imageUrl);
          }
          
          // 🗓️ Verificar se tem data na metadata
          const possibleDateFields = ['created_date', 'mint_date', 'timestamp', 'date', 'created_at'];
          let foundDate = null;
          
          possibleDateFields.forEach(field => {
            if (metadata[field]) {
              console.log(`📅 Campo de data encontrado - ${field}:`, metadata[field]);
              foundDate = metadata[field];
            }
          });
          
          // Se encontrou data na metadata, usar ela ao invés da genérica
          if (foundDate) {
            try {
              const realDate = new Date(foundDate).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC'
              });
              setMintDate(realDate + ' (Original Mfer)');
              console.log(`✅ Usando data real da metadata: ${realDate}`);
              return; // Sai da função para não usar a data genérica
            } catch (e) {
              console.warn(`⚠️ Erro ao parsear data da metadata:`, e);
            }
          }
          
          console.log(`🤷‍♂️ Nenhuma data encontrada na metadata, usando data genérica`);
        })
        .catch(err => console.error('Erro ao buscar Mfer image:', err));

      // 🗓️ SIMPLIFICADO: Usa data conhecida dos Mfers originais (2021)
      // Os Mfers originais foram mintados entre Nov-Dec 2021
      // Vamos usar uma data representativa ao invés de fazer query custosa na L1
      const originalMferDate = new Date('2021-11-30T00:00:00Z').toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      });
      
      setMintDate(originalMferDate + ' (Original L1 Mint)');
      console.log(`📅 Usando data representativa dos Mfers originais: ${originalMferDate}`);
    }

    setTimeout(() => setShowConfetti(false), 3000);
    setTimeout(() => setRevealEntangled(true), 4000);
  }, [searchParams]);

  // 🎨 Carregar NFTs mintados do contrato MferBk0Base
  const fetchMintedNFTs = async () => {
    // 🛡️ Prevent infinite loops
    if (fetchAttemptCount > 3) {
      console.warn('⚠️ fetchMintedNFTs: Maximum attempts (3) reached, aborting');
      return;
    }
    
    setFetchAttemptCount(prev => prev + 1);
    console.log('🚀 fetchMintedNFTs INICIANDO execução... (attempt #' + (fetchAttemptCount + 1) + ')');
    setLoadingMints(true);
    
    try {
        // 🚀 ROBUST GALLERY STRATEGY: 
        // 1st: Base Indexer API (official, fast, reliable)
        // 2nd: Smart Event Chunking (controlled RPC calls)  
        // 3rd: Original approach (800-block fallback)
        
        console.log('🔥 ATTEMPTING METHOD 1: Base Official Indexer API...');
        
        // Use configured Mfer contract or fallback to canonical deployed address
        const mferContractAddress = process.env.NEXT_PUBLIC_MFERBKOBASE_CONTRACT || process.env.NEXT_PUBLIC_MFER_ADDRESS || '0xb222e11864A2050bd19e2Df6648CfbB971f28325';
        console.log('🎯 Using contract address:', mferContractAddress);
        setLastQueriedContract(mferContractAddress);

        // 🚀 METHOD 1: Base Official NFT Indexer API
        try {
          console.log('📡 Calling Base Indexer API...');
          const indexerResponse = await fetch(`https://api.base.org/v1/nfts/contract/${mferContractAddress}?limit=100&order=desc`);
          
          if (indexerResponse.ok) {
            const indexerData = await indexerResponse.json();
            console.log('✅ Base Indexer API success:', indexerData?.nfts?.length || 0, 'tokens found');
            
            if (indexerData?.nfts?.length > 0) {
              const formattedNFTs = indexerData.nfts.map((nft: any) => ({
                tokenId: parseInt(nft.tokenId),
                owner: nft.owner,
                blockNumber: nft.blockNumber || 'Unknown',
                txHash: nft.transactionHash || 'Unknown',
                mintDate: nft.timestamp ? new Date(nft.timestamp * 1000).toLocaleDateString() : 'Unknown',
                title: `Mfer-0-#${nft.tokenId}/1000`
              }));
              
              setMintedNFTs(formattedNFTs.sort((a, b) => b.tokenId - a.tokenId));
              setRpcSource('base-indexer');
              setRpcLogsCount(formattedNFTs.length);
              setRpcReturnedNoLogs(false);
              console.log('🎉 METHOD 1 SUCCESS: Base Indexer API delivered', formattedNFTs.length, 'tokens!');
              return; // SUCCESS! Exit early
            }
          }
          console.log('⚠️ Base Indexer API returned empty or failed, trying METHOD 2...');
        } catch (apiError) {
          console.warn('❌ Base Indexer API failed:', apiError);
          console.log('🔄 Falling back to METHOD 2: Smart Event Chunking...');
        }

        // 🔄 METHOD 2: Smart Event Chunking (500-block chunks)
        console.log('🔥 ATTEMPTING METHOD 2: Smart Event Chunking...');
        
        const primaryRpc = 'https://api.developer.coinbase.com/rpc/v1/base/QDv2XZtiPNHyVtbLUsY5QT7UTHM6Re2N';
        const fallbackRpc = 'https://mainnet.base.org';
        
        const postRpc = async (endpoint: string, body: any) => {
          console.log('📡 Making RPC call to:', endpoint, 'method:', body.method);
          try {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });
            const result = await res.json();
            console.log('✅ RPC response received:', { status: res.status, hasResult: !!result.result, error: result.error });
            return result;
          } catch (error) {
            console.error('❌ RPC error:', error);
            throw error;
          }
        };

        try {
          console.log('📊 Getting current block number for chunking strategy...');
          const currentBlockResponse = await postRpc(primaryRpc, {
            id: 1,
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: []
          });

          if (currentBlockResponse.error) {
            throw new Error(currentBlockResponse.error.message);
          }

          const currentBlock = parseInt(currentBlockResponse.result, 16);
          console.log('📈 Current block number:', currentBlock);

          // Start from block when MferBk0Base was deployed (approximately)
          const deployBlock = 19000000; // Adjust based on actual deployment
          const totalBlocks = currentBlock - deployBlock;
          const chunkSize = 500; // Safe chunk size to avoid RPC limits
          const chunks = Math.ceil(totalBlocks / chunkSize);
          
          console.log(`📦 Will query ${chunks} chunks of ${chunkSize} blocks each (${totalBlocks} blocks total)`);

          let allLogs: any[] = [];

          // Process chunks from most recent to oldest
          for (let i = chunks - 1; i >= 0; i--) {
            const fromBlock = deployBlock + (i * chunkSize);
            const toBlock = i === chunks - 1 ? currentBlock : fromBlock + chunkSize - 1;

            console.log(`🔍 Chunk ${chunks - i}/${chunks}: blocks ${fromBlock} to ${toBlock}`);

            try {
              const logsResponse = await postRpc(primaryRpc, {
                id: 1,
                jsonrpc: '2.0',
                method: 'eth_getLogs',
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
                
                // Stop if we have enough recent mints
                if (allLogs.length >= 50) {
                  console.log('🎯 Found enough recent mints, stopping chunking');
                  break;
                }
              } else {
                console.warn(`⚠️ Chunk ${chunks - i} returned no logs`);
              }

              // Rate limiting: small delay between chunks
              if (i > 0) await new Promise(resolve => setTimeout(resolve, 100));
              
            } catch (chunkError) {
              console.error(`❌ Chunk ${chunks - i} failed:`, chunkError);
              // Continue with other chunks
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
            return; // SUCCESS! Exit early
          }

          console.log('⚠️ Event chunking found no mints, trying METHOD 3...');
          
        } catch (chunkingError) {
          console.warn('❌ Smart Event Chunking failed:', chunkingError);
          console.log('🔄 Falling back to METHOD 3: Original 800-block approach...');
        }

        // 🔄 METHOD 3: Original 800-block approach (final fallback)
        console.log('🔥 ATTEMPTING METHOD 3: Original 800-block fallback...');
        
        try {
          const currentBlockResponse = await postRpc(primaryRpc, {
            id: 1,
            jsonrpc: '2.0', 
            method: 'eth_blockNumber',
            params: []
          });

          if (currentBlockResponse.error) {
            throw new Error(`RPC Error: ${currentBlockResponse.error.message}`);
          }

          const currentBlock = parseInt(currentBlockResponse.result, 16);
          console.log('🔢 Current block (fallback method):', currentBlock);

          // Safe 800-block range to avoid RPC limits
          const blockRange = 800;
          const fromBlock = Math.max(currentBlock - blockRange, 19000000);

          console.log(`📊 METHOD 3: Querying blocks ${fromBlock} to ${currentBlock} (${currentBlock - fromBlock} blocks)`);

          const logsResponse = await postRpc(primaryRpc, {
            id: 1,
            jsonrpc: '2.0',
            method: 'eth_getLogs', 
            params: [{
              address: mferContractAddress,
              topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer event
                '0x0000000000000000000000000000000000000000000000000000000000000000', // from: 0x0 (mint)
              ],
              fromBlock: '0x' + fromBlock.toString(16),
              toBlock: '0x' + currentBlock.toString(16)
            }]
          });

          if (logsResponse.error) {
            console.error('❌ Logs RPC error:', logsResponse.error);
            throw new Error(`RPC Logs Error: ${logsResponse.error.message}`);
          }

          const logs = logsResponse.result || [];
          console.log(`✅ METHOD 3 found ${logs.length} Transfer events`);

          if (logs.length === 0) {
            setRpcReturnedNoLogs(true);
            setMintedNFTs([]);
            setRpcSource('none');
            setRpcLogsCount(0);
            console.log('⚠️ No Transfer events found in recent blocks');
            return;
          }

          // Process and format the mint events
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

        } catch (fallbackError) {
          console.error('❌ METHOD 3 (800-block fallback) failed:', fallbackError);
          
          // 🚨 FINAL FALLBACK: Demo tokens to prevent blank page
          console.log('🎭 ALL METHODS FAILED - Using emergency demo tokens');
          
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

  // Helper function for demo data rendering (when all methods fail)
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

  const resetMintsList = () => {
    console.log('🔄 Resetting mints list...');
    setMintedNFTs([]);
    setLoadingMints(false);
    setRpcError(null);
    setRpcReturnedNoLogs(false);
    setRpcSource('none');
    setRpcLogsCount(0);
    setLastQueriedContract('');
  };

  // Load mints on component mount or wallet connection
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
      }, 2000); // 2s delay to let transaction settle
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
  }, []);

  // Helper function for RPC source display
  const getRPCSourceDisplay = () => {
    const info = getDemoRPCInfo();
    return `${info.status} (${info.logsCount} mints)`;
  };

  // Don't render until mounted (prevent hydration mismatch)
  if (!mounted) {
    return <div>Loading gallery...</div>;
  }

  return (
    <div className="gallery-container">
      <h1>Gallery Loading...</h1>
    </div>
  );
}
      } else {
        // If we have data via RPC, ensure rpcReturnedNoLogs is false
        setRpcReturnedNoLogs(false);
      }
    } catch (err) {
      console.error('❌ Error fetching NFTs:', err);
      setRpcReturnedNoLogs(true);
      
      // Try localStorage if RPC fails completely
      try {
        const stored = JSON.parse(localStorage.getItem('mferMints') || '[]');
        if (stored && stored.length > 0) {
          const cached = stored.map((m: any) => ({
            tokenId: m.tokenId || 1,
            owner: m.owner || '',
            blockNumber: m.blockNumber || 0,
            txHash: m.hash || m.txHash || '',
            mintDate: m.mintDate || '' ,
            title: `Mfer-0-#${m.tokenId || 1}/1000`
          }));
          setMintedNFTs(cached.sort((a: any, b: any) => b.tokenId - a.tokenId));
        } else {
          setMintedNFTs([]);
        }
      } catch (err2) {
        console.error('Error reading localStorage during fallback:', err2);
        setMintedNFTs([]);
      }
    } finally {
      console.log('✅ fetchMintedNFTs FINALIZANDO...');
      setLoadingMints(false);
    }
  };

  useEffect(() => {
    // 🛡️ Reset states on mount
    setLoadingMints(false);
    setFetchAttemptCount(0);
    console.log('🔧 Reset states on mount');
    
    // Only fetch if we don't have demo data yet
    if (mintedNFTs.length === 0) {
      setTimeout(() => {
        fetchMintedNFTs();
      }, 500);
    } else {
      console.log('✅ Demo data already loaded, skipping fetchMintedNFTs');
    }
  }, []);

  if (!mounted) return null;

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

      {/* Header com titulo e conceito */}
      <div className="gallery-header">
        <h1 className="gallery-title">KinGallery</h1>
        <p className="gallery-concept">
          The art isn't in the spin;<br />
          it's in that precise <span className="gallery-bold-moment">moment of recognition</span>
        </p>
      </div>

      <div className="main-container">
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

            {!revealEntangled && (
              <div className="mystery-overlay">
                <div className="mystery-icon">🌀</div>
                <p className="mystery-text">Discovering entangled Mfer...</p>
              </div>
            )}
          </div>

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
          />
        </div>
      </div>

      {revealEntangled && (
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
                  onClick={() => window.open(`https://basescan.org/tx/${nft.txHash}`, '_blank')}
                >
                  <img 
                    src={getIPFSUrl(KNOWN_CIDs.MFER_ARTWORK)}
                    alt={nft.title}
                    className="mosaic-img"
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
                <div style={{ marginBottom: '12px' }}>Loading collection...</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
                  Searching blockchain for minted NFTs
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      if (!loadingMints) {
                        setFetchAttemptCount(0); // Reset counter
                        fetchMintedNFTs();
                      }
                    }}
                    disabled={loadingMints}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: loadingMints ? 'rgba(100, 100, 100, 0.08)' : 'rgba(0, 230, 255, 0.08)',
                      border: loadingMints ? '1px solid rgba(100, 100, 100, 0.14)' : '1px solid rgba(0, 230, 255, 0.14)',
                      color: loadingMints ? 'rgba(255,255,255,0.4)' : 'white',
                      cursor: loadingMints ? 'wait' : 'pointer',
                      opacity: loadingMints ? 0.6 : 1
                    }}
                  >
                    {loadingMints ? '⏳ Loading...' : '🔄 Refresh'}
                  </button>

                  {/* 🛡️ Emergency reset button - only show if stuck loading */}
                  {loadingMints && (
                    <button
                      onClick={() => {
                        console.log('🚨 Emergency reset clicked!');
                        setLoadingMints(false);
                        setTimeout(() => fetchMintedNFTs(), 100);
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: 'rgba(255, 100, 100, 0.15)',
                        border: '1px solid rgba(255, 100, 100, 0.3)',
                        color: 'rgba(255, 150, 150, 1)',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🚨 Reset
                    </button>
                  )}

                  {txHash && (
                    <button
                      onClick={() => window.open(`https://basescan.org/tx/${txHash}`, '_blank')}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: 'rgba(255,255,255,0.9)',
                        cursor: 'pointer'
                      }}
                    >
                      🔎 View my mint on BaseScan
                    </button>
                  )}
                </div>

                <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                  RPC indexers may need time to sync new transactions
                </div>

                {rpcReturnedNoLogs && lastQueriedContract && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,200,100,0.9)' }}>
                    ⚠️ No logs found for contract <code style={{ fontFamily: 'monospace' }}>{lastQueriedContract}</code>. If you expect mints, verify the contract address or try again later.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        /* GALLERY HEADER */
        .gallery-header {
          text-align: center;
          padding: 30px 20px 15px 20px;
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

        .gallery-page {
          min-height: 100vh;
          width: 100%;
          max-width: 100vw;
          background: #000000;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding: 0;
          position: relative;
          overflow-x: hidden;
        }

        .gallery-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 490px;
          max-width: 100%;
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

        .main-container {
          width: 100%;
          max-width: 450px;
          min-width: 320px;
          margin: 40px auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
          align-items: center;
          justify-content: flex-start;
          position: relative;
          z-index: 2;
          padding: 0 20px;
        }

        .nft-wrapper {
          position: relative;
          width: 100%;
          max-width: 450px;
          margin: 0 auto;
        }

        .glass-shell {
          position: relative;
          width: 100%;
          max-width: 375px;
          aspect-ratio: 3/4;
          margin: 0 auto;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0);
          backdrop-filter: blur(20px);
          border: 8px solid #0a0f1a;
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 20px 50px rgba(0, 0, 0, 0.8);
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

        .mystery-overlay {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          padding: 16px 24px;
          border-radius: 16px;
          text-align: center;
        }

        .mystery-icon {
          font-size: 32px;
          animation: spin 2s linear infinite;
          margin-bottom: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .mystery-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .entangled-section {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .entangled-badge {
          background: linear-gradient(135deg, rgba(0, 230, 255, 0.2), rgba(255, 0, 230, 0.2));
          border: 2px solid rgba(0, 230, 255, 0.6);
          padding: 12px 24px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(10px);
          animation: glow-pulse 2s ease infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 230, 255, 0.4); }
          50% { box-shadow: 0 0 40px rgba(0, 230, 255, 0.8); }
        }

        .badge-icon {
          font-size: 24px;
        }

        .badge-text {
          font-size: 16px;
          font-weight: 600;
          color: white;
        }

        .entangled-mfer-preview {
          margin-top: 16px;
          display: flex;
          justify-content: center;
        }

        .entangled-mfer-image {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          border: 2px solid rgba(0, 230, 255, 0.6);
          box-shadow: 0 0 20px rgba(0, 230, 255, 0.4);
          object-fit: cover;
          animation: fadeIn 0.6s ease;
        }

        .magic-mint-btn {
          width: 100%;
          max-width: 360px;
          padding: 18px;
          background: linear-gradient(135deg, #00e6ff, #0052ff);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          animation: fadeIn 0.6s ease;
        }

        .magic-mint-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 230, 255, 0.5);
        }

        .metadata-wrapper {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .actions-box {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #00e6ff, #0052ff);
          color: white;
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 230, 255, 0.4);
        }

        .mosaic-section {
          width: 100%;
          max-width: 450px;
          margin: 40px auto 0;
          padding: 40px 20px;
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

      {/* Magic Button - allows user to mint more */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <MagicMintButton isOnGalleryPage={true} />
      </div>
    </div>
  );
}
