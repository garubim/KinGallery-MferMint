const fs = require('fs');
const path = require('path');
const solc = require('solc');
const cp = require('child_process');

const BASE_JSON = 'contracts/MferMint_StandardJSON_CORRECTED.json';
const OUT_DIR = 'contracts/build/variants';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

console.log('Loading base standard JSON:', BASE_JSON);
const base = JSON.parse(fs.readFileSync(BASE_JSON,'utf8'));

// fetch on-chain once
console.log('Fetching on-chain code (Base mainnet) for 0xbea2923331ca35cc72f7eb1227be5bd1714d6ae3');
const cmd = `curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xbea2923331ca35cc72f7eb1227be5bd1714d6ae3","latest"]}' https://mainnet.base.org | jq -r .result`;
let onchainRaw = '';
try {
  onchainRaw = cp.execSync(cmd, { encoding: 'utf8' }).trim();
} catch (err) {
  console.warn('Warning: could not fetch on-chain bytecode:', err.message);
}
const onchain = onchainRaw.startsWith('0x') ? onchainRaw.slice(2) : onchainRaw;

const metadataOptions = ['ipfs','none','bzzr1'];
const evmOptions = ['paris','london','berlin'];
const optimizerEnabledOptions = [true, false];
const runsOptions = [200,100,1,1000];
const viaIROptions = [false, true];

let results = [];
let total=0;
for (const meta of metadataOptions) {
  for (const evm of evmOptions) {
    for (const opt of optimizerEnabledOptions) {
      for (const runs of runsOptions) {
        for (const viaIR of viaIROptions) {
          total++;
          const cfg = JSON.parse(JSON.stringify(base));
          cfg.settings = cfg.settings || {};
          cfg.settings.metadata = cfg.settings.metadata || {};
          cfg.settings.metadata.bytecodeHash = meta;
          cfg.settings.evmVersion = evm;
          cfg.settings.optimizer = cfg.settings.optimizer || {};
          cfg.settings.optimizer.enabled = opt;
          cfg.settings.optimizer.runs = runs;
          if (viaIR) cfg.settings.viaIR = true; else delete cfg.settings.viaIR;

          const label = `meta=${meta},evm=${evm},opt=${opt},runs=${runs},viaIR=${viaIR}`;
          try {
            const out = JSON.parse(solc.compile(JSON.stringify(cfg)));
            const key = 'contracts/MferMintGalleryCompatible_Flattened.sol';
            const name = 'MferMintGalleryCompatible';
            if (!out.contracts || !out.contracts[key] || !out.contracts[key][name]) {
              results.push({ label, error: 'contract not in output' });
              console.log(label, '-> contract missing');
              continue;
            }
            const deployed = out.contracts[key][name].evm.deployedBytecode.object || '';
            let firstDiff = -1;
            if (onchain && onchain.length>0) {
              const min = Math.min(deployed.length, onchain.length);
              for (let i=0;i<min;i++){
                if (deployed[i] !== onchain[i]){ firstDiff = i; break; }
              }
            }
            const matchPrefix = (firstDiff===-1) ? Math.min(deployed.length,onchain.length) : firstDiff;
            results.push({ label, firstDiff, matchPrefix, compiledLen: deployed.length, onchainLen: onchain.length });
            console.log(`${label} -> firstDiff=${firstDiff} matchPrefix=${matchPrefix}`);
          } catch (err) {
            console.log(label, 'compile error:', err.message);
            results.push({ label, error: err.message });
          }
        }
      }
    }
  }
}

const outPath = path.join(OUT_DIR, 'search_results.json');
fs.writeFileSync(outPath, JSON.stringify({ total, onchainLen: onchain.length, results }, null, 2));
console.log('Wrote search results:', outPath);

// sort top matches by highest matchPrefix
const matches = results.filter(r=>typeof r.matchPrefix==='number').sort((a,b)=>b.matchPrefix - a.matchPrefix).slice(0,10);
fs.writeFileSync(path.join(OUT_DIR,'top_matches.json'), JSON.stringify(matches,null,2));
console.log('Top matches written');

console.log('Done.');
