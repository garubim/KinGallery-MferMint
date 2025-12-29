#!/usr/bin/env node
import fs from 'fs';
import { ethers } from 'ethers';

// Generates calldata JSON files for transferOwnership and setRelayer for owned contracts
// Usage: set env NEW_OWNER and RELAYER (optional) then: node scripts/gen_transfer_calldata.js

function loadOwned(){
  if(!fs.existsSync('owned_contracts.json')){
    console.error('owned_contracts.json not found. Run scripts/find_owned_contracts.js first'); process.exit(1);
  }
  return JSON.parse(fs.readFileSync('owned_contracts.json','utf8'));
}

async function main(){
  const NEW_OWNER = process.env.NEW_OWNER; // example 0x...
  const RELAYER = process.env.RELAYER_ADDRESS;
  if(!NEW_OWNER){ console.error('Set NEW_OWNER env var'); process.exit(1); }

  const owned = loadOwned();
  if(!fs.existsSync('txs')) fs.mkdirSync('txs');

  for(const entry of owned){
    const addr = entry.address;
    const ifaceOwn = new ethers.Interface(['function transferOwnership(address)']);
    const dataTransfer = ifaceOwn.encodeFunctionData('transferOwnership',[NEW_OWNER]);
    const obj = { to: addr, value: 0, data: dataTransfer, note: `transferOwnership -> ${NEW_OWNER}` };
    fs.writeFileSync(`txs/transfer_${addr}.json`, JSON.stringify(obj, null, 2));
    console.log('Wrote txs/transfer_%s.json', addr);

    if(RELAYER){
      const ifaceRel = new ethers.Interface(['function setRelayer(address)']);
      const dataRel = ifaceRel.encodeFunctionData('setRelayer',[RELAYER]);
      const obj2 = { to: addr, value:0, data: dataRel, note: `setRelayer -> ${RELAYER}` };
      fs.writeFileSync(`txs/setRelayer_${addr}.json`, JSON.stringify(obj2, null, 2));
      console.log('Wrote txs/setRelayer_%s.json', addr);
    }
  }
  console.log('Done. Review txs/ folder');
}

main().catch(e=>{console.error(e); process.exit(1)});
