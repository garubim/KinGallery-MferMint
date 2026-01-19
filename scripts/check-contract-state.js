#!/usr/bin/env node

/**
 * Script para verificar estado atual dos contratos KinGallery e MferBk0Base
 * Ajuda a diagnosticar problemas com payAndMint EOA failures
 */

const https = require('https');

const CONTRACTS = {
  kingallery: '0x8ABb13088C1707E9d5BE43daC0e78E8D9D35e44F',
  mfer: '0x01ECF65958dB5d1859d815ffC96b7b8C5e16E241',
  newMfer: '0x159137BF79634F97A900C85c4685652d9ed2870b' // contrato que você deployou
};

const KinGallery_ABI = [
  {
    "inputs": [],
    "name": "payee2",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "RELAYER_ROLE",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintPrice",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PAYEE1_AMOUNT",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PAYEE2_AMOUNT",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const MferBk0Base_ABI = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "artist",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gallery",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
];

function fetchRPC(method, params = []) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: 1
    });

    const options = {
      hostname: 'mainnet.base.org',
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.error) {
            reject(new Error(`RPC Error: ${result.error.message}`));
          } else {
            resolve(result.result);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function encodeCall(abi, functionName) {
  // Simples function selector
  const fnAbi = abi.find(f => f.name === functionName);
  if (!fnAbi) throw new Error(`Function ${functionName} not found in ABI`);
  
  // Para funções sem parâmetros, é só os 4 primeiros bytes do hash da assinatura
  const signature = `${functionName}()`;
  const hash = require('crypto').createHash('sha256').update(signature).digest('hex');
  return '0x' + hash.substring(0, 8);
}

async function checkContractState() {
  console.log('🔍 Verificando estado dos contratos...\n');

  try {
    // Check KinGallery
    console.log('📋 KinGallery (0x' + CONTRACTS.kingallery.slice(2).toUpperCase() + ')');
    console.log('─'.repeat(60));
    
    const payee2Call = encodeCall(KinGallery_ABI, 'payee2');
    const payee2Result = await fetchRPC('eth_call', [
      { to: CONTRACTS.kingallery, data: payee2Call },
      'latest'
    ]);
    console.log(`  payee2 (Gallery): ${payee2Result || '0x0000000000000000000000000000000000000000'}`);
    
    const mintPriceCall = encodeCall(KinGallery_ABI, 'mintPrice');
    const mintPriceResult = await fetchRPC('eth_call', [
      { to: CONTRACTS.kingallery, data: mintPriceCall },
      'latest'
    ]);
    console.log(`  mintPrice: ${BigInt(mintPriceResult).toString()} wei (${(BigInt(mintPriceResult) / 1000000000000000n).toString()} * 10^15)`);
    
    console.log('\n📋 MferBk0Base ATUAL (0x' + CONTRACTS.mfer.slice(2).toUpperCase() + ')');
    console.log('─'.repeat(60));
    
    const ownerCall = encodeCall(MferBk0Base_ABI, 'owner');
    const ownerResult = await fetchRPC('eth_call', [
      { to: CONTRACTS.mfer, data: ownerCall },
      'latest'
    ]);
    const ownerAddr = '0x' + ownerResult.slice(-40);
    console.log(`  owner (Artist): ${ownerAddr}`);
    
    const galleryCall = encodeCall(MferBk0Base_ABI, 'gallery');
    const galleryResult = await fetchRPC('eth_call', [
      { to: CONTRACTS.mfer, data: galleryCall },
      'latest'
    ]);
    const galleryAddr = '0x' + galleryResult.slice(-40);
    console.log(`  gallery: ${galleryAddr}`);
    
    console.log('\n⚠️  DIAGNÓSTICO:');
    console.log('─'.repeat(60));
    
    const payee2Addr = '0x' + payee2Result.slice(-40);
    const isZeroPayee2 = payee2Addr === '0x0000000000000000000000000000000000000000';
    const mismatchGallery = galleryAddr.toLowerCase() !== CONTRACTS.kingallery.toLowerCase();
    
    if (isZeroPayee2) {
      console.log('❌ ERRO CRÍTICO: payee2 está zerado em KinGallery!');
      console.log('   Isso faz com que payAndMint falhe ao tentar transferir ETH para a Gallery.');
      console.log('   ➜ Solução: Chamar setGalleryPayee com sua Smart Wallet (0x26dcd83d4e449059abf0334e4435d48e74f28eb0)');
    } else {
      console.log(`✅ payee2 configurado: ${payee2Addr}`);
    }
    
    if (mismatchGallery) {
      console.log(`⚠️  AVISO: gallery em MferBk0Base (${galleryAddr}) não corresponde a KinGallery (${CONTRACTS.kingallery})`);
      console.log(`   ➜ Solução: Chamar setGallery(${CONTRACTS.kingallery}) no contrato MferBk0Base`);
    } else {
      console.log(`✅ gallery em MferBk0Base está correto`);
    }
    
    console.log('\n✨ Resumo das mudanças necessárias:');
    console.log('─'.repeat(60));
    if (isZeroPayee2) {
      console.log('1. Em KinGallery, chamar: setGalleryPayee("0x26dcd83d4e449059abf0334e4435d48e74f28eb0")');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar contratos:', error.message);
    process.exit(1);
  }
}

checkContractState();
