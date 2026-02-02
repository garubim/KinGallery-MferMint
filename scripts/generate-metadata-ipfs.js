#!/usr/bin/env node

/**
 * Script para gerar metadata IPFS para novo deploy Mfer-0-Base
 * Domain Pinata: orange-eager-slug-339.mypinata.cloud
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PINATA_DOMAIN = 'orange-eager-slug-339.mypinata.cloud';
const MAX_SUPPLY = 1000;

// Calculate entangled Ethereum Mfer ID (same logic as frontend)
const calculateEthMferId = (tokenIdNum) => {
  const hash = (tokenIdNum * 1337 + 42) % 10000;
  return hash === 0 ? 1 : hash;
};

// Create metadata directory
const metadataDir = path.join(__dirname, 'metadata-new-deploy');
if (!fs.existsSync(metadataDir)) {
  fs.mkdirSync(metadataDir, { recursive: true });
}

console.log('🎯 Gerando metadata para novo Mfer-0-Base deploy...');
console.log(`📍 Pinata Domain: ${PINATA_DOMAIN}`);
console.log(`🔢 Max Supply: ${MAX_SUPPLY}`);

// Generate metadata for all possible tokens
for (let tokenId = 1; tokenId <= MAX_SUPPLY; tokenId++) {
  const ethMferId = calculateEthMferId(tokenId);
  
  const metadata = {
    name: `Mfer-0'-Base #${tokenId}/${MAX_SUPPLY}`,
    description: `Your mark is recorded. This NFT is entangled with Ethereum Mfer #${ethMferId} from the original 2021 collection. Part of the Mfer-0'-Base collection on Base chain. Evolution documented, not imitation.`,
    image: `https://${PINATA_DOMAIN}/ipfs/bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq`,
    animation_url: `https://${PINATA_DOMAIN}/ipfs/bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq`,
    external_url: `https://kingallery.netlify.app/gallery?tokenId=${tokenId}`,
    background_color: "000000",
    attributes: [
      {
        trait_type: 'Collection',
        value: "Mfer-0'-Base",
      },
      {
        trait_type: 'Chain',
        value: 'Base (8453)',
      },
      {
        trait_type: 'Edition',
        value: `${tokenId}/${MAX_SUPPLY}`,
      },
      {
        trait_type: 'Type',
        value: 'Entangled L1-L2',
      },
      {
        trait_type: 'Artist',
        value: 'Kinwiz.base.eth',
      },
      {
        trait_type: 'Entangled With',
        value: `Ethereum Mfer #${ethMferId}`,
      },
      {
        trait_type: 'Original Chain',
        value: 'Ethereum Mainnet',
      },
      {
        trait_type: 'Evolution Layer',
        value: 'Base',
      },
      {
        trait_type: 'Entanglement Status',
        value: 'Active',
      },
    ],
  };

  // Write individual JSON files
  const filename = `${tokenId}.json`;
  const filepath = path.join(metadataDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(metadata, null, 2));
  
  if (tokenId <= 10 || tokenId % 100 === 0) {
    console.log(`✅ Generated: ${filename} (entangled with ETH Mfer #${ethMferId})`);
  }
}

console.log(`\n🎉 Metadata generation complete!`);
console.log(`📁 Files: ${metadataDir}`);
console.log(`📊 Total files: ${MAX_SUPPLY}`);

// Generate upload instructions
const instructions = `
🚀 PRÓXIMOS PASSOS PARA DEPLOY:

1. UPLOAD METADATA PARA PINATA:
   📁 Folder: ${metadataDir}
   🌐 Upload para: ${PINATA_DOMAIN}
   📋 Obter CID da pasta (ex: QmAbc123...)

2. NOVO CONTRATO MferBk0Base:
   📝 baseURI_: "https://${PINATA_DOMAIN}/ipfs/[METADATA_CID]/"
   🔗 Exemplo: "https://${PINATA_DOMAIN}/ipfs/QmAbc123/"
   
3. DEPLOY & VERIFY:
   🏗️  Deploy novo contrato no Remix
   ✅ Verify na BaseScan
   🔄 Update endereços no frontend

4. LEGACY TOKENS:
   📈 Tokens atuais (1-14) = "Legacy Test Tokens"
   🆕 Novo contrato = Produção oficial

METADATA CRIADA: ✅
- 1000 arquivos JSON individuais
- Cada um com entanglement único
- URLs apontando para seu Pinata domain
- Attributes completos

`;

fs.writeFileSync(path.join(metadataDir, 'DEPLOY_INSTRUCTIONS.md'), instructions);
console.log(instructions);