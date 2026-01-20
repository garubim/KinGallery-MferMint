#!/usr/bin/env node
/**
 * Gera JSONs de metadados para tokens 1-5
 * Cria pasta ready para upload no Pinata
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do metadado base
const baseMetadata = {
  name: "Mfer",
  description: "Whaaaaa! - Exclusive NFT Collection on Base",
  imageBase: "https://orange-eager-slug-339.mypinata.cloud/ipfs/bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq",
  attributes: [
    {
      trait_type: "Collection",
      value: "Mfer-bk-0'-base"
    },
    {
      trait_type: "Chain",
      value: "Base"
    }
  ]
};

// Criar diretório de output
const outputDir = path.join(__dirname, '../metadata-tokens');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✅ Criado diretório: ${outputDir}`);
}

// Gerar JSONs para tokens 1-5
for (let tokenId = 1; tokenId <= 5; tokenId++) {
  const metadata = {
    name: `${baseMetadata.name} ${tokenId}`,
    description: baseMetadata.description,
    image: baseMetadata.imageBase,
    attributes: [
      ...baseMetadata.attributes,
      {
        trait_type: "Token ID",
        value: tokenId.toString()
      }
    ]
  };

  const filename = path.join(outputDir, `${tokenId}.json`);
  fs.writeFileSync(filename, JSON.stringify(metadata, null, 2));
  console.log(`✅ Criado: ${tokenId}.json`);
}

console.log(`\n📦 Arquivos criados em: ${outputDir}`);
console.log(`\n📋 Próximo passo:`);
console.log(`   1. Upload dessa pasta para Pinata via UI`);
console.log(`   2. Copiar o CID da pasta`);
console.log(`   3. Chamar setBaseURI("ipfs://{CID}/") no BaseScan`);
console.log(`\n💡 Comando para verificar arquivos gerados:`);
console.log(`   ls -la ${outputDir}`);
