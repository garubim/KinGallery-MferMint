const fs = require('fs');
const path = require('path');

const flattenedPath = path.resolve(__dirname, '../contracts/build/Mfer0base_flattened.sol');
const flattened = fs.readFileSync(flattenedPath, 'utf8');

const targets = [
  'ERC721.sol',
  'ERC2981.sol',
  'Strings.sol',
  'Context.sol',
  'IERC165.sol',
  'Address.sol'
];

function normalize(s) {
  return s.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n').replace(/\s+$/g, '\n').trim() + '\n';
}

function stripHeaderToCode(s) {
  // find first occurrence of pragma, import, interface, library, contract
  const re = /(?=\bpragma\b|\bimport\b|\binterface\b|\blibrary\b|\bcontract\b)/m;
  const m = s.match(re);
  if (m) {
    return s.slice(m.index);
  }
  return s;
}

function extractFlattenedBlock(flattened, fileName) {
  const headerUrl = `https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0`;
  // find the file header line containing fileName
  const regex = new RegExp(`// File: .*${fileName.replace('.','\\.').replace(/\//g,'\\/')}.*`, 'm');
  const headerMatch = flattened.match(regex);
  if (!headerMatch) return null;
  const startIdx = headerMatch.index;
  const rest = flattened.slice(startIdx);
  const nextFileIdx = rest.indexOf('\n// File: ');
  return nextFileIdx === -1 ? rest : rest.slice(0, nextFileIdx);
}

const report = [];
for (const f of targets) {
  const flatBlock = extractFlattenedBlock(flattened, f);
  if (!flatBlock) { report.push({file:f, status:'missing_in_flattened'}); continue; }
  const officialPath = path.resolve(__dirname, '../tmp/oz', f.replace('.sol','.sol.raw'));
  if (!fs.existsSync(officialPath)) { report.push({file:f, status:'official_missing'}); continue; }
  const off = fs.readFileSync(officialPath, 'utf8');
  const coreFlat = normalize(stripHeaderToCode(flatBlock));
  const coreOff = normalize(stripHeaderToCode(off));
  const same = coreFlat === coreOff;
  report.push({ file: f, coreMatch: same, coreFlatHash: require('crypto').createHash('sha256').update(coreFlat).digest('hex'), coreOffHash: require('crypto').createHash('sha256').update(coreOff).digest('hex') });
}

fs.writeFileSync(path.resolve(__dirname, '../contracts/build/oz_core_integrity.json'), JSON.stringify(report, null, 2));
console.log('Written contracts/build/oz_core_integrity.json');
console.log(JSON.stringify(report, null, 2));
process.exit(0);
