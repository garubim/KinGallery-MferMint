#!/usr/bin/env node
import fs from 'fs';
import { ethers } from 'ethers';

// Simulate smartWallet.execute(target, value, data) by performing an eth_call with from=smartWallet
// Usage: set RPC_URL and SMART_WALLET env vars; node scripts/simulate_smartwallet_execute.js txs/transfer_0x....json

async function main(){
  const RPC = process.env.RPC_URL;
  const SMART = process.env.SMART_WALLET;
  if(!RPC || !SMART){ console.error('Set RPC_URL and SMART_WALLET env vars'); process.exit(1); }
  const provider = new ethers.JsonRpcProvider(RPC);
  const args = process.argv.slice(2);
  if(args.length===0){ console.error('Pass path to tx json (from txs/)'); process.exit(1); }
  const txpath = args[0];
  if(!fs.existsSync(txpath)){ console.error('file not found', txpath); process.exit(1); }
  const t = JSON.parse(fs.readFileSync(txpath,'utf8'));

  // We expect t.to, t.data
  // Build execute calldata if smart wallet uses execute(address,uint256,bytes)
  const execIface = new ethers.Interface(['function execute(address,uint256,bytes)']);
  const execData = execIface.encodeFunctionData('execute',[t.to, t.value || 0, t.data]);

  // simulate call with from = SMART
  try{
    const res = await provider.call({ to: SMART, data: execData, from: SMART });
    console.log('Call succeeded, return data:', res);
  }catch(e){
    console.error('Simulation reverted / failed:', e.message);
  }
}

main().catch(e=>{console.error(e); process.exit(1)});
