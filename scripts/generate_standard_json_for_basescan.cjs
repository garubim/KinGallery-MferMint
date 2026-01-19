const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'contracts', 'MferMintGalleryCompatible_Flattened.sol');
const outDir = path.join(__dirname, '..', 'contracts', 'build');
const outPath = path.join(outDir, 'StandardJson_MferMintGalleryCompatible.json');

if (!fs.existsSync(srcPath)) {
  console.error('Source file not found:', srcPath);
  process.exit(1);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const sourceContent = fs.readFileSync(srcPath, 'utf8');

const standardJson = {
  language: 'Solidity',
  sources: {
    'contracts/MferMintGalleryCompatible.sol': {
      content: sourceContent
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000
    },
    evmVersion: 'paris',
    viaIR: false,
    metadata: {
      bytecodeHash: 'ipfs'
    },
    outputSelection: {
      '*': {
        '*': [
          'abi',
          'metadata',
          'evm.bytecode',
          'evm.deployedBytecode',
          'evm.bytecode.sourceMap',
          'evm.deployedBytecode.sourceMap'
        ]
      }
    }
  }
};

fs.writeFileSync(outPath, JSON.stringify(standardJson, null, 2));
console.log('Wrote Standard JSON to', outPath);
console.log('Remember to set compiler version to 0.8.19 when uploading to BaseScan, and supply constructor args hex and contract address.');
