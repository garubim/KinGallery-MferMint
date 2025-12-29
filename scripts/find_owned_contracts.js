#!/usr/bin/env node
import fs from 'fs';
import { ethers } from 'ethers';

async function main(){
  const RPC = process.env.RPC_URL;
  if(!RPC){
    console.error('Set RPC_URL env var'); process.exit(1);
  }
  const provider = new ethers.JsonRpcProvider(RPC);

  // load addresses from contracts_list.json or contracts_list.txt
  let addrs = [];
  if(fs.existsSync('contracts_list.json')){
    addrs = JSON.parse(fs.readFileSync('contracts_list.json','utf8'));
  } else if(fs.existsSync('contracts_list.txt')){
    addrs = fs.readFileSync('contracts_list.txt','utf8').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  } else if(process.argv[2]){
    addrs = process.argv.slice(2);
  } else {
    console.error('Provide contracts_list.json or contracts_list.txt or pass addresses as args');
    process.exit(1);
  }

  const suspect = (process.env.SUSPECT_ADDRESS || '').toLowerCase();
  if(!suspect){
    console.error('Set SUSPECT_ADDRESS env var to the compromised address you want to check');
    process.exit(1);
  }

  const out = [];
  const abi = [
    'function owner() view returns (address)',
    'function getOwners() view returns (address[])'
  ];

  for(const a of addrs){
    try{
      const c = new ethers.Contract(a, abi, provider);
      let isOwner = false;
      let ownerVal = null;
      try{ ownerVal = await c.owner(); if(ownerVal && ownerVal.toLowerCase()===suspect) isOwner = true; }catch(e){}
      let ownersArr = null;
      try{ ownersArr = await c.getOwners(); if(ownersArr && ownersArr.map(x=>x.toLowerCase()).includes(suspect)) isOwner = true; }catch(e){}
      if(isOwner){
        out.push({address:a, owner: ownerVal?ownerVal:null, owners: ownersArr?ownersArr:[]});
        console.log('OWNED:', a, 'owner=', ownerVal, 'ownersCount=', ownersArr?ownersArr.length:0);
      } else {
        console.log('skip:', a);
      }
    }catch(e){
      console.log('error reading', a, e.message);
    }
  }

  fs.writeFileSync('owned_contracts.json', JSON.stringify(out, null, 2));
  console.log('Wrote owned_contracts.json with', out.length, 'entries');
}

main().catch(e=>{console.error(e); process.exit(1)});
