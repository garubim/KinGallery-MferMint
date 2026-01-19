const fs = require('fs');
const cp = require('child_process');

const compiledPath = process.argv[2] || 'contracts/build/mfer_compiled_raw.json';
const contractName = process.argv[3] || 'MferMintGalleryCompatible';
const contractAddress = (process.argv[4] || '0x3EAa38e66e4097262f75ba735A82740e64Afb308').toLowerCase();

if (!fs.existsSync(compiledPath)) { console.error('Compiled JSON not found:', compiledPath); process.exit(1); }
const compiled = JSON.parse(fs.readFileSync(compiledPath,'utf8'));
let deployed = null;
let foundKey = null;
for (const key of Object.keys(compiled.contracts||{})){
  if (compiled.contracts[key] && compiled.contracts[key][contractName]){
    deployed = compiled.contracts[key][contractName].evm.deployedBytecode.object || '';
    foundKey = key;
    break;
  }
}
if (!deployed){ console.error('Contract',contractName,'not found in compiled output'); process.exit(1); }
console.log('Found compiled contract under',foundKey,'deployed length',deployed.length);

try{
  const cmd = `curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["${contractAddress}","latest"]}' https://mainnet.base.org | jq -r .result`;
  let onchain = cp.execSync(cmd,{encoding:'utf8'}).trim(); if (!onchain) throw new Error('empty');
  if (onchain.startsWith('0x')) onchain = onchain.slice(2);
  console.log('Onchain length', onchain.length);
  const min = Math.min(deployed.length,onchain.length);
  let firstDiff=-1;
  for (let i=0;i<min;i++){ if (deployed[i]!==onchain[i]){ firstDiff=i; break; }}
  console.log('firstDiff', firstDiff,'compiledLen',deployed.length,'onchainLen',onchain.length);
  if (firstDiff>=0){
    const start = Math.max(0, firstDiff-80);
    const end = Math.min(min, firstDiff+80);
    console.log('compiled context:', deployed.slice(start,end));
    console.log('onchain  context:', onchain.slice(start,end));
  } else if (deployed.length !== onchain.length){
    console.log('No differing hex char but lengths differ');
  } else {
    console.log('Exact match ✅');
  }
  fs.writeFileSync('contracts/build/compiled_vs_onchain.json', JSON.stringify({contractAddress,foundKey,firstDiff,compiledLen:deployed.length,onchainLen:onchain.length,compiledSlice:deployed.slice(firstDiff-40,firstDiff+40),onchainSlice:onchain.slice(firstDiff-40,firstDiff+40)},null,2));
  console.log('Wrote contracts/build/compiled_vs_onchain.json');
} catch(err){ console.error('Error fetching onchain code:', err.message); process.exit(1); }
