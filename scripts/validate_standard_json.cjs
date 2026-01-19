const fs = require('fs');
const solc = require('solc');
const path = require('path');

const INPUT = process.argv[2] || 'contracts/MferMint_StandardJSON_PREDEPLOY.json';
const OUTDIR = 'contracts/build/validation';
if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, {recursive:true});

const base = JSON.parse(fs.readFileSync(INPUT,'utf8'));
console.log('Compiling:', INPUT);
const out = JSON.parse(solc.compile(JSON.stringify(base)));
fs.writeFileSync(path.join(OUTDIR,'compiled.json'), JSON.stringify(out, null, 2));

const key = Object.keys(base.sources)[0];
// determine contract name by searching compiled output
let contractName = null;
if (out.contracts && out.contracts[key]) {
  contractName = Object.keys(out.contracts[key])[0];
}
if (!contractName) {
  console.error('Could not determine contract name from compiled output. Keys:', Object.keys(out.contracts||{}));
  process.exit(1);
}
console.log('Found contract:', contractName);
const compiledCreation = out.contracts[key][contractName].evm.bytecode.object || '';
const compiledDeployed = out.contracts[key][contractName].evm.deployedBytecode.object || '';
fs.writeFileSync(path.join(OUTDIR,'compiled_creation.hex'), compiledCreation);
fs.writeFileSync(path.join(OUTDIR,'compiled_deployed.hex'), compiledDeployed);
console.log('Wrote compiled_creation.hex (len):', compiledCreation.length);

let provided = '';
try { provided = fs.readFileSync('contracts/build/provided_creation.hex','utf8').trim(); } catch (e) { console.warn('No provided_creation.hex found to compare.'); }
if (provided) {
  const match = (provided === compiledCreation);
  const crypto = require('crypto');
  console.log('Provided len:', provided.length, 'compiled len:', compiledCreation.length);
  console.log('SHA256 provided:', crypto.createHash('sha256').update(provided).digest('hex'));
  console.log('SHA256 compiled:', crypto.createHash('sha256').update(compiledCreation).digest('hex'));
  console.log('Exact match?', match);
  // show first diff index if any
  if (!match) {
    const min = Math.min(provided.length, compiledCreation.length);
    let first = -1;
    for (let i=0;i<min;i++){ if (provided[i]!==compiledCreation[i]){ first=i; break; }}
    console.log('firstDiffIndex:', first);
    if (first>=0) {
      const start = Math.max(0, first-60);
      const end = Math.min(min, first+60);
      console.log('provided context:', provided.slice(start,end));
      console.log('compiled context:', compiledCreation.slice(start,end));
    }
  }
}

console.log('Done.');
