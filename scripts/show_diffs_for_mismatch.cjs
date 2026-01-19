const fs = require('fs');
const path = require('path');
const reportPath = path.resolve(__dirname, '../contracts/build/oz_integrity_report.json');
const flattenedPath = path.resolve(__dirname, '../contracts/build/Mfer0base_flattened.sol');

function normalize(s) {
  return s.replace(/\r\n/g, '\n').replace(/\s+$/g, '\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function firstDiffIndex(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) return i;
  }
  if (a.length !== b.length) return n;
  return -1;
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const flattened = fs.readFileSync(flattenedPath, 'utf8');

for (const r of report) {
  if (r.status === 'match') continue;
  const headerPrefix = `// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/`;
  const headerLine = (flattened.match(new RegExp(`// File: .*${r.file.replace('.sol','')}.+`, 'g')) || [])[0];
  if (!headerLine) {
    console.log(`${r.file}: header not found in flattened`);
    continue;
  }
  // extract block from header to next // File:
  const idx = flattened.indexOf(headerLine);
  const rest = flattened.slice(idx);
  const nextFileIdx = rest.indexOf('\n// File: ');
  const block = nextFileIdx === -1 ? rest : rest.slice(0, nextFileIdx);
  const officialPath = path.resolve(__dirname, '../tmp/oz', r.file.replace('.sol', '.sol.raw'));
  let official = '';
  try { official = fs.readFileSync(officialPath, 'utf8'); } catch(e) { console.log(`${r.file}: official missing at ${officialPath}`); continue; }
  const nf = normalize(block);
  const no = normalize(official);
  const idxDiff = firstDiffIndex(nf, no);
  if (idxDiff === -1) {
    console.log(`${r.file}: contents appear identical after normalization`);
    continue;
  }
  const start = Math.max(0, idxDiff - 60);
  const end = Math.min(idxDiff + 60, Math.max(nf.length, no.length));
  console.log('---');
  console.log(`${r.file}: firstDiff at ${idxDiff}`);
  console.log('Flattened context:');
  console.log(nf.slice(start, Math.min(end, nf.length)).split('\n').map((l, i) => `${start + 1 + i}: ${l}`).join('\n'));
  console.log('---');
  console.log('Official context:');
  console.log(no.slice(start, Math.min(end, no.length)).split('\n').map((l, i) => `${start + 1 + i}: ${l}`).join('\n'));
}

process.exit(0);
