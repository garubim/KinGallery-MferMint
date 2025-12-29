import { ethers } from 'ethers';
import readline from 'readline';

// Secure interactive simulation helper.
// Avoids requiring exported env vars that can be accidentally committed.
// Usage: node scripts/simulate_setRelayer.mjs

async function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans.trim()); }));
}

const envRpc = process.env.RPC_URL || process.env.NEXT_PUBLIC_ALCHEMY || process.env.ALCHEMY_API_URL || '';
let RPC = envRpc;
if (!RPC) {
  RPC = await ask('RPC URL (will not be saved): ');
}
if (!RPC) {
  console.error('No RPC provided; aborting.');
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC);

const GALLERY = '0x4a4005306fB72AA234CD0A550d03E55DE889c5E7';
const SMART_WALLET = '0x26dCd83d4e449059ABf0334e4435d48e74f28EB0';

const defaultRelayer = '0x4d639D1Bd428899599F0Da564926DA1a1A3bd3a8';
const envNew = process.env.NEW_RELAYER || '';
let NEW_RELAYER = envNew || '';
if (!NEW_RELAYER) {
  const ans = await ask(`NEW_RELAYER [enter for ${defaultRelayer}]: `);
  NEW_RELAYER = ans || defaultRelayer;
}

function encodeSetRelayer(addr) {
  const selector = '0x6548e9bc';
  const padded = addr.toLowerCase().replace('0x', '').padStart(64, '0');
  return selector + padded;
}

(async () => {
  try {
    const calldata = encodeSetRelayer(NEW_RELAYER);
    console.log('Simulating call: Gallery.setRelayer(', NEW_RELAYER, ')');
    const res = await provider.call({ to: GALLERY, data: calldata, from: SMART_WALLET });
    console.log('Simulation returned (hex):', res);
    console.log('No revert detected (call succeeded).');
  } catch (err) {
    console.error('Simulation reverted or failed:');
    console.error(err);
    process.exitCode = 1;
  }
})();
