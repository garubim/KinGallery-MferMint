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
  const [loadingMints, setLoadingMints] = useState(true);
  const [lastQueriedContract, setLastQueriedContract] = useState<string | null>(null);
  const [rpcReturnedNoLogs, setRpcReturnedNoLogs] = useState(false);
  const [rpcSource, setRpcSource] = useState<string | null>(null);
  const [rpcLogsCount, setRpcLogsCount] = useState<number | null>(null);

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
  // Fetch minted NFTs from RPC, with retries and localStorage fallback
  const fetchMintedNFTs = async () => {
    // 🛡️ DEBOUNCE: Evitar múltiplas chamadas simultâneas
    if (loadingMints) {
      console.log('⚠️ fetchMintedNFTs já está rodando, ignorando nova chamada');
      return;
    }
    
    console.log('🚀 fetchMintedNFTs INICIANDO execução real...');
    setLoadingMints(true);
    
    // 🛡️ Safety timeout - auto-reset após 30s se travar
    const safetyTimeout = setTimeout(() => {
      console.warn('⏰ fetchMintedNFTs travada > 30s, resetando...');
      setLoadingMints(false);
    }, 30000);
    
    try {
        // 🧪 TEMPORARY: Demo mode due to SDK v2 vs OnchainKit v1 conflicts
        console.log('🎭 Using demo mode to show tokens while fixing version conflicts...');
        
        const demoNFTs = [
          {
            tokenId: 8,
            owner: '0xbcd980d37293CBee62Bf5f93a26a0B744C18964D',
            blockNumber: 41576440,
            txHash: '0x101c3a71ebb0f5a8f68b22cd8811d2aa8530880ebe688e71390b5f5b97c93d14',
            mintDate: 'Feb 01, 2026',
            title: 'Mfer-0-#8/1000'
          },
          {
            tokenId: 9,
            owner: '0xbcd980d37293CBee62Bf5f93a26a0B744C18964D',  
            blockNumber: 41577618,
            txHash: '0x' + '9'.repeat(64),
            mintDate: 'Feb 01, 2026',
            title: 'Mfer-0-#9/1000'
          }
        ];
        
        console.log('✅ Demo NFTs ready:', demoNFTs.length);
        setMintedNFTs(demoNFTs.sort((a, b) => b.tokenId - a.tokenId));
        setRpcSource('demo');
        setRpcLogsCount(demoNFTs.length);
        
        // Use configured Mfer contract or fallback to canonical deployed address
        const mferContractAddress = process.env.NEXT_PUBLIC_MFERBKOBASE_CONTRACT || process.env.NEXT_PUBLIC_MFER_ADDRESS || '0xb222e11864A2050bd19e2Df6648CfbB971f28325';
        console.log('🎯 Using contract address:', mferContractAddress);
        setLastQueriedContract(mferContractAddress);
        setRpcReturnedNoLogs(false);

        const primaryRpc = 'https://api.developer.coinbase.com/rpc/v1/base/QDv2XZtiPNHyVtbLUsY5QT7UTHM6Re2N';
        const fallbackRpc = 'https://mainnet.base.org'; // Oficial Base RPC ao invés de drpc.org
        console.log('🌐 RPC endpoints ready:', { primaryRpc, fallbackRpc });

        // Helper to POST JSON-RPC
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
          } catch (fetchError) {
            console.error('❌ RPC fetch error:', fetchError);
            throw fetchError;
          }
        };

        // First, try to get current block from primary; fallback if necessary
        console.log('🔍 Getting current block number...');
        let blockResponse = await postRpc(primaryRpc, { jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] });
        let usedRpc = primaryRpc;
        if (!blockResponse || blockResponse.error) {
          console.warn('Primary RPC blockNumber failed, falling back to mainnet.base.org', blockResponse?.error);
          blockResponse = await postRpc(fallbackRpc, { jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] });
          usedRpc = fallbackRpc;
        }

        const currentBlock = parseInt(blockResponse.result, 16);
        
        // 🎯 SMART SEARCH: Últimos 2000 blocos (onde provavelmente estão todos os tokens)
        // Se o contrato é novo, todos os mints devem estar nos últimos 2000 blocos
        const fromBlock = Math.max(0, currentBlock - 2000); // Max 2000 blocos = ~6-7 horas na Base
        
        console.log(`📊 Smart search: ${fromBlock} to ${currentBlock} (${currentBlock - fromBlock} blocks)`);
        console.log(`🔍 Contract address: ${mferContractAddress}`);
      

      
      // Query for Transfer events (mints) — try primary first, then fallback
      let response = await postRpc(primaryRpc, {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getLogs',
        params: [{
          address: mferContractAddress,
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer event
            '0x0000000000000000000000000000000000000000000000000000000000000000' // from zero (mints)
          ],
          fromBlock: '0x' + fromBlock.toString(16),
          toBlock: '0x' + currentBlock.toString(16)
        }]
      });

      let data = response;
      let usedRpcForLogs = primaryRpc;

      console.log(`🔍 Primary RPC response for contract ${mferContractAddress}:`, data?.result ? `${data.result.length} Transfer events found` : `Error: ${data?.error?.message || 'No data'}`);

      if (!data || data.error || (Array.isArray(data.result) && data.result.length === 0)) {
        console.warn('Primary RPC returned no logs or error, trying fallback RPC...', data?.error);
        const fallbackResponse = await postRpc(fallbackRpc, {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getLogs',
          params: [{
            address: mferContractAddress,
            topics: [
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              '0x0000000000000000000000000000000000000000000000000000000000000000'
            ],
            fromBlock: '0x0',
            toBlock: '0x' + currentBlock.toString(16)
          }]
        });

        data = fallbackResponse;
        usedRpcForLogs = fallbackRpc;
      }

      console.log('📡 RPC Response:', data);

      if (data.error) {
        console.error('❌ RPC Error:', data.error);
        
        // 🚦 Se for rate limit, aguarda e tenta localStorage
        if (data.error?.message?.includes('rate') || data.error?.code === -32005) {
          console.log('⏳ Rate limit detectado, aguardando 10s e carregando cache...');
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        
        // Carrega cache local se RPC falhar
        try {
          const stored = JSON.parse(localStorage.getItem('mferMints') || '[]');
          if (stored && stored.length > 0) {
            console.log('💾 Carregando NFTs do cache local devido ao erro RPC...');
            const cached = stored.map((m: any) => ({
              tokenId: m.tokenId || 1,
              owner: m.owner || '',
              blockNumber: m.blockNumber || 0,
              txHash: m.hash || m.txHash || '',
              mintDate: m.mintDate || '',
              title: `Mfer-0-#${m.tokenId || 1}/1000`
            }));
            setMintedNFTs(cached.sort((a: any, b: any) => b.tokenId - a.tokenId));
          } else {
            setMintedNFTs([]);
          }
        } catch (cacheErr) {
          console.error('Erro carregando cache:', cacheErr);
          setMintedNFTs([]);
        }
      } else {
        let transfers = data.result || [];
        console.log(`📦 Found ${transfers.length} Transfer events via ${usedRpcForLogs}`);
        if (transfers.length > 0) console.log('🔍 First transfer:', transfers[0]);

        // update states about rpc source and counts
        setRpcSource(usedRpcForLogs === primaryRpc ? 'coinbase' : 'mainnet');
        setRpcLogsCount(transfers.length);

        // If still no transfers found, try expanded search
        if (transfers.length === 0) {
          console.warn('❌ No mints found in last 2000 blocks, trying expanded search...');
          
          // 🔍 Expanded search: últimos 10000 blocos (em chunks de 1000)
          const chunks = 10; // 10 chunks de 1000 blocos cada = 10000 blocos total
          const chunkSize = 1000;
          
          for (let i = 0; i < chunks && transfers.length === 0; i++) {
            const chunkFromBlock = Math.max(0, currentBlock - ((i + 1) * chunkSize));
            const chunkToBlock = currentBlock - (i * chunkSize);
            
            console.log(`🔍 Chunk ${i + 1}/${chunks}: blocks ${chunkFromBlock}-${chunkToBlock}`);
            
            const chunkResponse = await postRpc(usedRpcForLogs, {
              jsonrpc: '2.0',
              id: 3 + i,
              method: 'eth_getLogs',
              params: [{
                address: mferContractAddress,
                topics: [
                  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                  '0x0000000000000000000000000000000000000000000000000000000000000000'
                ],
                fromBlock: '0x' + chunkFromBlock.toString(16),
                toBlock: '0x' + chunkToBlock.toString(16)
              }]
            });
            
            if (chunkResponse.result && chunkResponse.result.length > 0) {
              console.log(`✅ Found ${chunkResponse.result.length} transfers in chunk ${i + 1}!`);
              transfers = chunkResponse.result;
              break;
            }
            
            // Rate limiting between chunks
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        // Process logs to extract tokenId and owner
        const nfts = transfers.map((log: any) => {
          const tokenIdHex = log.topics[3];
          const tokenId = parseInt(tokenIdHex, 16);
          const ownerAddress = '0x' + log.topics[2].slice(-40);
          
          return {
            tokenId,
            owner: ownerAddress,
            blockNumber: parseInt(log.blockNumber, 16),
            txHash: log.transactionHash
          };
        });

        console.log(`🎨 Processed ${transfers.length} Transfer events into ${nfts.length} NFT objects`);
        console.log('📋 Sample NFT objects:', nfts.slice(0, 3));

        // 🚦 Rate limiting helper - max 30 RPS (mais rápido)
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const RATE_LIMIT_DELAY = 33; // 33ms = 30 RPS (mais rápido)

        // Enrich with block timestamps (rate limited)
        console.log(`⏳ Enriching ${nfts.length} NFTs with timestamps (rate limited to 30 RPS)...`);
        const enrichedNFTs: any[] = [];
        
        // 🛡️ Processamento sequencial ao invés de paralelo para evitar rate limit
        for (let i = 0; i < nfts.length; i++) {
          const nft = nfts[i];
          try {
            // 🚦 Rate limiting: aguarda entre cada request
            if (i > 0) await delay(RATE_LIMIT_DELAY);
            
            const blockResp = await postRpc(usedRpcForLogs, {
              jsonrpc: '2.0',
              id: 1,
              method: 'eth_getBlockByNumber',
              params: ['0x' + nft.blockNumber.toString(16), false]
            });

            let blkData = blockResp; // 🔧 Changed to 'let' para permitir reatribuição
            
            // 🛡️ Better error handling para rate limits
            if (blkData.error) {
              console.warn(`⚠️ Error fetching block ${nft.blockNumber}:`, blkData.error);
              if (blkData.error?.message?.includes('rate') || blkData.error?.code === -32005) {
                console.log('⏳ Rate limit no timestamp, aguardando 2s...');
                await delay(2000);
                // Tenta novamente
                const retryResp = await postRpc(usedRpcForLogs, {
                  jsonrpc: '2.0',
                  id: 1,
                  method: 'eth_getBlockByNumber',
                  params: ['0x' + nft.blockNumber.toString(16), false]
                });
                if (retryResp.result) {
                  blkData = retryResp;
                }
              }
            }
            
            const timestamp = blkData.result?.timestamp ? parseInt(blkData.result.timestamp, 16) * 1000 : null;
              
            let mintDate = '';
            if (timestamp) {
              const date = new Date(timestamp);
              mintDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              });
            }

            enrichedNFTs.push({
              ...nft,
              mintDate,
              title: `Mfer-0-#${nft.tokenId}/1000`
            });
          } catch (err) {
            console.error(`Error fetching NFT block data for token ${nft.tokenId}:`, err);
            // Adiciona NFT mesmo sem timestamp
            enrichedNFTs.push({
              ...nft,
              mintDate: '',
              title: `Mfer-0-#${nft.tokenId}/1000`
            });
          }
        }

        setMintedNFTs(enrichedNFTs.sort((a, b) => b.tokenId - a.tokenId));
        console.log('✅ Minted NFTs found:', enrichedNFTs.length);
      }

      // If RPC returned nothing, try localStorage (user's own recent mints cached by UI)
      if (!data || (data.result && data.result.length === 0)) {
        setRpcReturnedNoLogs(true);
        try {
          const stored = JSON.parse(localStorage.getItem('mferMints') || '[]');
          if (stored && stored.length > 0) {
            console.log('ℹ️ Loading mints from localStorage cache...');
            const cached = stored.map((m: any) => ({
              tokenId: m.tokenId || 1,
              owner: m.owner || '',
              blockNumber: m.blockNumber || 0,
              txHash: m.hash || m.txHash || '',
              mintDate: m.mintDate || '' ,
              title: `Mfer-0-#${m.tokenId || 1}/1000`
            }));
            setMintedNFTs(cached.sort((a: any, b: any) => b.tokenId - a.tokenId));
          }
        } catch (err) {
          console.error('Error reading mferMints from localStorage:', err);
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
      clearTimeout(safetyTimeout);
      setLoadingMints(false);
    }
  };

  useEffect(() => {
    // 🛡️ Reset loadingMints no mount para evitar travamento
    setLoadingMints(false);
    console.log('🔧 Reset loadingMints state on mount');
    
    // Delay pequeno para garantir que tudo carregou
    setTimeout(() => {
      fetchMintedNFTs();
    }, 500);
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
