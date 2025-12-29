#!/usr/bin/env node
import {ethers} from 'ethers';

async function main(){
  const RPC_URL = process.env.RPC_URL;
  const DEST = process.env.DEST;
  const OLD_PK = process.env.OLD_PK;

  if(!RPC_URL){
    console.error('RPC_URL not set');
    process.exit(1);
  }
  if(!DEST){
    console.error('DEST not set');
    process.exit(1);
  }
  if(!OLD_PK){
    console.error('OLD_PK not set');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(OLD_PK, provider);

  console.log('From address:', wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log('Balance (ETH):', ethers.formatEther(balance));

  const reserve = ethers.parseUnits('0.0005','ether');
  const amount = balance - reserve;
  if(amount <= 0n){
    console.error('Insufficient balance after reserving gas');
    process.exit(1);
  }

  console.log('Sending amount (wei):', amount.toString());
  const tx = await wallet.sendTransaction({ to: DEST, value: amount });
  console.log('txHash:', tx.hash);
  await tx.wait();
  console.log('Transfer confirmed');
}

main().catch((e)=>{ console.error(e); process.exit(1); });
