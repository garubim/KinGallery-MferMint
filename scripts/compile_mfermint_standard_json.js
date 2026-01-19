const fs = require('fs');
const path = require('path');
const solc = require('solc');
const cp = require('child_process');

const INPUT_PATH = process.argv[2] || 'contracts/MferMint_StandardJSON_CORRECTED.json';
const OUT_DIR = process.argv[3] || 'contracts/build';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

console.log('Reading standard-json from', INPUT_PATH);
const input = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf8'));

console.log('Compiling with solc (via solc-js)');
const output = JSON.parse(solc.compile(JSON.stringify(input)));
fs.writeFileSync(path.join(OUT_DIR, 'mfer_compiled_raw.json'), JSON.stringify(output, null, 2));
console.log('Wrote', path.join(OUT_DIR, 'mfer_compiled_raw.json'));

const contractKey = 'contracts/MferMintGalleryCompatible_Flattened.sol';
const contractName = 'MferMintGalleryCompatible';
if (!output.contracts || !output.contracts[contractKey] || !output.contracts[contractKey][contractName]) {
  console.error('Contract not found in compiled output:', contractKey, contractName);
  process.exit(1);
}
const c = output.contracts[contractKey][contractName];
const bytecode = c.evm.bytecode.object || '';
const deployed = c.evm.deployedBytecode.object || '';
fs.writeFileSync(path.join(OUT_DIR, 'mfer_bytecode.hex'), bytecode);
fs.writeFileSync(path.join(OUT_DIR, 'mfer_deployed.hex'), deployed);
console.log('Wrote bytecode and deployed bytecode files');

// Buildinfo: record settings and metadata
const buildinfo = {
  compiler: input.settings ? input.settings.compiler : null,
  settings: input.settings || null,
  metadata: output.metadata || null,
  buildTime: new Date().toISOString(),
};
fs.writeFileSync(path.join(OUT_DIR, 'mfer_buildinfo.json'), JSON.stringify(buildinfo, null, 2));
console.log('Wrote buildinfo');

// Compare with on-chain code
try {
  console.log('Fetching on-chain code (Base mainnet) for 0xbea2923331ca35cc72f7eb1227be5bd1714d6ae3');
  const cmd = `curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xbea2923331ca35cc72f7eb1227be5bd1714d6ae3","latest"]}' https://mainnet.base.org | jq -r .result`;
  const onchain = cp.execSync(cmd, { encoding: 'utf8' }).trim();
  const onchainStripped = onchain.startsWith('0x') ? onchain.slice(2) : onchain;

  console.log('Lengths: compiled deployed =', deployed.length, ' onchain=', onchainStripped.length);
  const min = Math.min(deployed.length, onchainStripped.length);
  let firstDiff = -1;
  for (let i = 0; i < min; i++) {
    if (deployed[i] !== onchainStripped[i]) { firstDiff = i; break; }
  }
  if (firstDiff === -1 && deployed.length === onchainStripped.length) {
    console.log('Exact match between compiled deployed bytecode and on-chain runtime bytecode ✅');
  } else {
    console.log('Bytecode differs. First differing hex char at index', firstDiff);
    if (firstDiff >= 0) {
      console.log('compiled around:', deployed.substr(Math.max(0, firstDiff - 40), 80));
      console.log('onchain  around:', onchainStripped.substr(Math.max(0, firstDiff - 40), 80));
    }
  }
  fs.writeFileSync(path.join(OUT_DIR, 'mfer_onchain_compare.json'), JSON.stringify({ onchain: onchainStripped, compiled: deployed, firstDiff }, null, 2));
  console.log('Wrote comparison report');
} catch (err) {
  console.warn('Could not fetch on-chain or compare automatically:', err.message);
}

console.log('Done. Artifacts in', OUT_DIR);
