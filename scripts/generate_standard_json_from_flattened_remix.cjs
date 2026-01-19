const fs = require('fs');
const path = require('path');

const flatPath = process.argv[2] || path.join('contracts','build','Mfer0base_flattened.sol');
const outPath = process.argv[3] || path.join('contracts','build','StandardJson_Mfer0base_fromRemix.json');

if (!fs.existsSync(flatPath)) { console.error('Flattened file not found:', flatPath); process.exit(1); }
const content = fs.readFileSync(flatPath,'utf8');

const standardJson = {
  language: 'Solidity',
  sources: {
    'contracts/Mfer0base_flattened.sol': {
      content: content
    }
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    evmVersion: 'paris',
    viaIR: false,
    metadata: { bytecodeHash: 'ipfs' },
    outputSelection: { '*': { '*': ['abi','metadata','evm.bytecode','evm.deployedBytecode','evm.bytecode.sourceMap','evm.deployedBytecode.sourceMap'] } }
  }
};

fs.writeFileSync(outPath, JSON.stringify(standardJson, null, 2));
console.log('Wrote Standard JSON to', outPath);
console.log('Do not compile. Upload this JSON in BaseScan with compiler v0.8.19 and constructor args as provided.');
