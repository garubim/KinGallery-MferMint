const fs = require('fs');
const path = require('path');
const solc = require('solc');
const cp = require('child_process');

const INPUT_JSON = process.argv[2] || 'contracts/build/StandardJson_MferMintGalleryCompatible.json';
const CONTRACT_ADDRESS = (process.argv[3] || '0x3EAa38e66e4097262f75ba735A82740e64Afb308').toLowerCase();
const OUT_DIR = process.argv[4] || 'contracts/build/variants';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR,{recursive:true});

console.log('Using base standard json:', INPUT_JSON);
const base = JSON.parse(fs.readFileSync(INPUT_JSON,'utf8'));

console.log('Fetching on-chain code for', CONTRACT_ADDRESS);
const cmd = `curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["${CONTRACT_ADDRESS}","latest"]}' https://mainnet.base.org | jq -r .result`;
let onchainRaw = '';
try { onchainRaw = cp.execSync(cmd,{encoding:'utf8'}).trim(); } catch(err){ console.warn('Warning: could not fetch on-chain code:',err.message); }
const onchain = onchainRaw.startsWith('0x') ? onchainRaw.slice(2) : onchainRaw;
console.log('onchain len',onchain.length);

const metadataOptions = ['ipfs','none','bzzr1'];
const evmOptions = ['paris','london','berlin'];
const optimizerEnabledOptions = [true]; // optimizer should be true given earlier runs
const runsOptions = [1,100,200,1000];
const viaIROptions = [false,true];

let results = [];
for (const meta of metadataOptions){
  for (const evm of evmOptions){
    for (const opt of optimizerEnabledOptions){
      for (const runs of runsOptions){
        for (const viaIR of viaIROptions){
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
            // find the compiled contract in out.contracts keys
            let deployed = '';
            let found=false;
            for (const key of Object.keys(out.contracts||{})){
              if (out.contracts[key] && out.contracts[key]['MferMintGalleryCompatible']){
                deployed = out.contracts[key]['MferMintGalleryCompatible'].evm.deployedBytecode.object || '';
                found=true; break;
              }
            }
            if (!found){ results.push({label, error:'contract missing'}); console.log(label,'-> contract missing'); continue; }
            let firstDiff=-1;
            if (onchain && onchain.length>0){
              const min = Math.min(deployed.length,onchain.length);
              for (let i=0;i<min;i++){ if (deployed[i]!==onchain[i]){ firstDiff=i; break; }}
            }
            const matchPrefix = (firstDiff===-1) ? Math.min(deployed.length,onchain.length) : firstDiff;
            results.push({ label, firstDiff, matchPrefix, compiledLen: deployed.length, onchainLen: onchain.length });
            console.log(`${label} -> firstDiff=${firstDiff} matchPrefix=${matchPrefix}`);
            // optionally write this deployed variant for inspection if it's among top
            fs.writeFileSync(path.join(OUT_DIR, `deployed_${meta}_${evm}_runs${runs}_viaIR${viaIR}.hex`), deployed);
          } catch(err){ console.log(label,'compile error',err.message); results.push({label,error:err.message}); }
        }
      }
    }
  }
}

fs.writeFileSync(path.join(OUT_DIR,'search_results.json'), JSON.stringify({onchainLen:onchain.length,results},null,2));
const matches = results.filter(r=>typeof r.matchPrefix==='number').sort((a,b)=>b.matchPrefix - a.matchPrefix).slice(0,10);
fs.writeFileSync(path.join(OUT_DIR,'top_matches.json'), JSON.stringify(matches,null,2));
console.log('Done. Wrote results to',OUT_DIR);
