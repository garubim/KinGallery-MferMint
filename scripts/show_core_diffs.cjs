const fs = require('fs');
const path = require('path');

const flattenedPath = path.resolve(__dirname, '../contracts/build/Mfer0base_flattened.sol');
const flattened = fs.readFileSync(flattenedPath, 'utf8');

const targets = [
  { headerSuffix: 'contracts/token/ERC721/ERC721.sol', label: 'ERC721.sol' },
  { headerSuffix: 'contracts/token/common/ERC2981.sol', label: 'ERC2981.sol' },
  { headerSuffix: 'contracts/utils/Strings.sol', label: 'Strings.sol' }
];

function normalize(s) {
  return s.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n').replace(/\s+$/g, '\n').trim() + '\n';
}
function stripHeaderToCode(s) {
  const re = /(?=\bpragma\b|\bimport\b|\binterface\b|\blibrary\b|\bcontract\b)/m;
  const m = s.match(re);
  if (m) return s.slice(m.index);
  return s;
}
function firstDiffIndex(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i;
  if (a.length !== b.length) return n;
  return -1;
}
function extractFlattenedBlock(flattened, headerSuffix) {
  const regex = new RegExp(`// File: .*${headerSuffix.replace(/\//g,'\\/')}.*`, 'm');
  const headerMatch = flattened.match(regex);
  if (!headerMatch) return null;
  const startIdx = headerMatch.index;
  const rest = flattened.slice(startIdx);
  const nextFileIdx = rest.indexOf('\n// File: ');
  return nextFileIdx === -1 ? rest : rest.slice(0, nextFileIdx);
}

for (const t of targets) {
  const flatBlock = extractFlattenedBlock(flattened, t.headerSuffix);
  const officialPath = path.resolve(__dirname, '../tmp/oz', t.label.replace('.sol', '.sol.raw'));
  const off = fs.readFileSync(officialPath, 'utf8');
  const nf = normalize(stripHeaderToCode(flatBlock));
  const no = normalize(stripHeaderToCode(off));
  const idx = firstDiffIndex(nf, no);
  console.log('---');
  console.log(`${t.label} firstDiffIndex: ${idx}`);
  if (idx === -1) { console.log('No diff'); continue; }
  const start = Math.max(0, idx - 120);
  const end = Math.min(idx + 120, Math.max(nf.length, no.length));
  console.log('Flattened around diff:\n', nf.slice(start, Math.min(end, nf.length)));
  console.log('--- Official around diff:\n', no.slice(start, Math.min(end, no.length)));
}
process.exit(0);
