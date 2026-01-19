const fs = require('fs');
const solc = require('solc');

const [,,meta='ipfs',evm='paris',opt='true',runs='200',viaIR='false'] = process.argv;
const base = JSON.parse(fs.readFileSync('contracts/MferMint_StandardJSON_CORRECTED.json','utf8'));
const cfg = JSON.parse(JSON.stringify(base));
cfg.settings = cfg.settings || {};
cfg.settings.metadata = cfg.settings.metadata || {};
cfg.settings.metadata.bytecodeHash = meta;
cfg.settings.evmVersion = evm;
cfg.settings.optimizer = cfg.settings.optimizer || {};
cfg.settings.optimizer.enabled = (opt === 'true');
cfg.settings.optimizer.runs = Number(runs);
if (viaIR === 'true') cfg.settings.viaIR = true; else delete cfg.settings.viaIR;

const out = JSON.parse(solc.compile(JSON.stringify(cfg)));
const key = 'contracts/MferMintGalleryCompatible_Flattened.sol';
const name = 'MferMintGalleryCompatible';
if (!out.contracts || !out.contracts[key] || !out.contracts[key][name]) { console.error('contract not in output'); process.exit(1); }
const deployed = out.contracts[key][name].evm.deployedBytecode.object || '';
fs.writeFileSync(`contracts/build/variants/deployed_${meta}_${evm}_opt${opt}_runs${runs}_viaIR${viaIR}.hex`, deployed);
console.log('Wrote deployed bytecode length:', deployed.length);

// fetch onchain
const cp = require('child_process');
const cmd = `curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xbea2923331ca35cc72f7eb1227be5bd1714d6ae3","latest"]}' https://mainnet.base.org | jq -r .result`;
let onchain = cp.execSync(cmd,{encoding:'utf8'}).trim(); if (onchain.startsWith('0x')) onchain=onchain.slice(2);

let firstDiff=-1; const min = Math.min(deployed.length,onchain.length);
for (let i=0;i<min;i++){ if (deployed[i]!==onchain[i]){ firstDiff=i; break; }}
console.log('firstDiff:', firstDiff,'compiledLen',deployed.length,'onchainLen',onchain.length);
if (firstDiff>=0){
  const start = Math.max(0, firstDiff-40);
  const end = Math.min(min, firstDiff+40);
  console.log('compiled context:', deployed.slice(start,end));
  console.log('onchain  context:', onchain.slice(start,end));
}
