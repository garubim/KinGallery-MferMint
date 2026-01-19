const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const flattenedPath = path.resolve(__dirname, '../contracts/build/Mfer0base_flattened.sol');
const flattened = fs.readFileSync(flattenedPath, 'utf8');

const targets = [
  {
    header: 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/ERC721/ERC721.sol',
    name: 'ERC721.sol',
    localFile: path.resolve(__dirname, '../tmp/oz/ERC721.sol.raw')
  },
  {
    header: 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/common/ERC2981.sol',
    name: 'ERC2981.sol',
    localFile: path.resolve(__dirname, '../tmp/oz/ERC2981.sol.raw')
  },
  {
    header: 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/utils/Strings.sol',
    name: 'Strings.sol',
    localFile: path.resolve(__dirname, '../tmp/oz/Strings.sol.raw')
  },
  {
    header: 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/utils/Context.sol',
    name: 'Context.sol',
    localFile: path.resolve(__dirname, '../tmp/oz/Context.sol.raw')
  },
  {
    header: 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/utils/introspection/IERC165.sol',
    name: 'IERC165.sol',
    localFile: path.resolve(__dirname, '../tmp/oz/IERC165.sol.raw')
  },
  {
    header: 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/utils/Address.sol',
    name: 'Address.sol',
    localFile: path.resolve(__dirname, '../tmp/oz/Address.sol.raw')
  }
];

function sha256(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

function extractFlattenedBlock(flattened, headerUrl) {
  const headerLine = `// File: ${headerUrl}`;
  const idx = flattened.indexOf(headerLine);
  if (idx === -1) return null;
  const rest = flattened.slice(idx);
  // find next // File: occurrence after the first line
  const nextFileIdx = rest.indexOf('\n// File: ', headerLine.length);
  return nextFileIdx === -1 ? rest : rest.slice(0, nextFileIdx);
}

function normalize(s) {
  // Trim trailing spaces, collapse CRLF, remove multiple blank lines at head/tail
  return s.replace(/\r\n/g, '\n').replace(/\s+$/g, '\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

if (!fs.existsSync(path.resolve(__dirname, '../tmp/oz'))){
  fs.mkdirSync(path.resolve(__dirname, '../tmp/oz'), { recursive: true });
}

const report = [];
for (const t of targets) {
  const block = extractFlattenedBlock(flattened, t.header);
  if (!block) {
    report.push({ file: t.name, status: 'missing_in_flattened' });
    continue;
  }
  // read official raw file saved earlier (we will expect the user to have saved them via fetch)
  let official = null;
  try {
    official = fs.readFileSync(t.localFile, 'utf8');
  } catch (e) {
    report.push({ file: t.name, status: 'official_missing', msg: `expected ${t.localFile} not found` });
    continue;
  }
  const normFlat = normalize(block);
  const normOff = normalize(official);
  const flatHash = sha256(normFlat);
  const offHash = sha256(normOff);
  const identical = flatHash === offHash || normFlat.includes(normOff) || normOff.includes(normFlat);
  report.push({ file: t.name, status: identical ? 'match' : 'mismatch', flatHash, offHash, sampleFlat: normFlat.slice(0, 400), sampleOff: normOff.slice(0,400) });
}

fs.writeFileSync(path.resolve(__dirname, '../contracts/build/oz_integrity_report.json'), JSON.stringify(report, null, 2));
console.log('Report written to contracts/build/oz_integrity_report.json');
console.log(JSON.stringify(report, null, 2));
process.exit(0);
