const fs = require('fs');
const path = require('path');
const flattened = fs.readFileSync(path.resolve(__dirname, '../contracts/build/Mfer0base_flattened.sol'), 'utf8');

const checks = [
  { header: 'contracts/token/ERC721/ERC721.sol', label: 'ERC721.sol', anchors: ['function _transfer(', 'function _mint('] },
  { header: 'contracts/token/common/ERC2981.sol', label: 'ERC2981.sol', anchors: ['function royaltyInfo(', 'function _setDefaultRoyalty('] },
  { header: 'contracts/utils/Strings.sol', label: 'Strings.sol', anchors: ['function toString(', 'function toHexString('] }
];

function extractFlattenedBlock(flattened, headerSuffix) {
  const regex = new RegExp(`// File: .*${headerSuffix.replace(/\//g,'\\/')}.*`, 'm');
  const headerMatch = flattened.match(regex);
  if (!headerMatch) return null;
  const startIdx = headerMatch.index;
  const rest = flattened.slice(startIdx);
  const nextFileIdx = rest.indexOf('\n// File: ');
  return nextFileIdx === -1 ? rest : rest.slice(0, nextFileIdx);
}

for (const c of checks) {
  const flat = extractFlattenedBlock(flattened, c.header);
  const officialPath = path.resolve(__dirname, '../tmp/oz', c.label.replace('.sol', '.sol.raw'));
  const off = fs.readFileSync(officialPath, 'utf8');
  console.log('---');
  console.log(c.label);
  for (const anchor of c.anchors) {
    const iFlat = flat.indexOf(anchor);
    const iOff = off.indexOf(anchor);
    console.log(`anchor: ${anchor}`);
    console.log('flat idx:', iFlat, 'off idx:', iOff);
    if (iFlat !== -1) console.log('flat snippet:', flat.slice(Math.max(0, iFlat - 80), iFlat + 260));
    if (iOff !== -1) console.log('off snippet:', off.slice(Math.max(0, iOff - 80), iOff + 260));
  }
}
process.exit(0);
