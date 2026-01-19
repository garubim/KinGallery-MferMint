const fs = require('fs');
const path = require('path');

const flattened = fs.readFileSync(path.resolve(__dirname, '../contracts/build/Mfer0base_flattened.sol'), 'utf8');
const targets = [
  { header: 'contracts/token/ERC721/ERC721.sol', label: 'ERC721.sol' },
  { header: 'contracts/token/common/ERC2981.sol', label: 'ERC2981.sol' },
  { header: 'contracts/utils/Strings.sol', label: 'Strings.sol' },
  { header: 'contracts/utils/Context.sol', label: 'Context.sol' }
];

function normalize(s) { return s.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n').replace(/\s+$/g, '\n').trim() + '\n'; }
function stripHeaderToCode(s) { const re = /(?=\bpragma\b|\bimport\b|\binterface\b|\blibrary\b|\bcontract\b)/m; const m = s.match(re); return m ? s.slice(m.index) : s; }
function removeImports(s) { return s.split('\n').filter(l => !l.trim().startsWith('import ')).join('\n'); }

function extractFlattenedBlock(flattened, headerSuffix) {
  const regex = new RegExp(`// File: .*${headerSuffix.replace(/\//g,'\\/')}.*`, 'm');
  const headerMatch = flattened.match(regex);
  if (!headerMatch) return null;
  const startIdx = headerMatch.index;
  const rest = flattened.slice(startIdx);
  const nextFileIdx = rest.indexOf('\n// File: ');
  return nextFileIdx === -1 ? rest : rest.slice(0, nextFileIdx);
}

const crypto = require('crypto');
const report = [];
for (const t of targets) {
  const flat = extractFlattenedBlock(flattened, t.header);
  const offPath = path.resolve(__dirname, '../tmp/oz', t.label.replace('.sol', '.sol.raw'));
  const off = fs.readFileSync(offPath, 'utf8');
  const coreFlat = normalize(removeImports(stripHeaderToCode(flat)));
  const coreOff = normalize(removeImports(stripHeaderToCode(off)));
  const hFlat = crypto.createHash('sha256').update(coreFlat).digest('hex');
  const hOff = crypto.createHash('sha256').update(coreOff).digest('hex');
  report.push({ file: t.label, hashFlat: hFlat, hashOff: hOff, match: hFlat === hOff });
}
fs.writeFileSync(path.resolve(__dirname, '../contracts/build/oz_core_noimports.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(0);
