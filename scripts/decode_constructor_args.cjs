const { ethers } = require('ethers');
const fs = require('fs');

const RPC = 'https://mainnet.base.org';
const provider = new ethers.JsonRpcProvider(RPC);

async function main(){
  const txHash = process.argv[2];
  if (!txHash) { console.error('Usage: node decode_constructor_args.cjs <txHash> <creationHexFile>'); process.exit(1); }
  const creationFile = process.argv[3] || 'contracts/build/creation_hex.txt';
  const abiPath = process.argv[4] || 'contracts/build/MferMint_ABI.json';

  const tx = await provider.getTransaction(txHash);
  if (!tx) { console.error('Transaction not found'); process.exit(1); }

  const input = tx.data || tx.input;
  console.log('txHash:', txHash);
  console.log('from:', tx.from);

  let creationHex = '';
  try { creationHex = fs.readFileSync(creationFile,'utf8').trim(); } catch(e){ console.warn('creationHex file not found at', creationFile); }
  if (creationHex.startsWith('0x')) creationHex = creationHex.slice(2);

  let ctorHex = input.startsWith('0x') ? input.slice(2) : input;
  if (creationHex && ctorHex.startsWith(creationHex)) {
    ctorHex = ctorHex.slice(creationHex.length);
    console.log('Detected creation prefix; constructor hex length:', ctorHex.length);
  } else {
    console.log('creation prefix not provided or not found; using full input as constructor-data candidate');
  }

  const abi = JSON.parse(fs.readFileSync(abiPath,'utf8'));
  const constructorAbi = abi.find(e=>e.type==='constructor') || { inputs: [] };
  const types = constructorAbi.inputs.map(i => i.type);

  if (types.length===0){ console.log('No constructor inputs defined in ABI'); process.exit(0); }

  // Remove potential trailing zeros padding if present
  const ctorData = '0x' + (ctorHex || '');

  try{
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const decoded = abiCoder.decode(types, ctorData);
    console.log('Decoded constructor params:');
    constructorAbi.inputs.forEach((inp, idx)=>{
      console.log(`- ${inp.name} (${inp.type}):`, decoded[idx]);
    });
  } catch(err){
    console.error('Decode failed:', err.message);
    console.log('Constructor raw hex (first 400 chars):', ctorData.slice(0,400));
  }

  // fetch receipt to get created contract address
  const receipt = await provider.getTransactionReceipt(txHash);
  if (receipt && receipt.contractAddress) {
    console.log('Contract Address (from receipt):', receipt.contractAddress);
    const onchain = await provider.getCode(receipt.contractAddress);
    console.log('On-chain runtime bytecode length:', (onchain || '').length);
    // print snippet
    console.log('Onchain snippet (head 200):', onchain.slice(0,200));
  } else {
    console.log('No contractAddress found in receipt (maybe not a creation tx?)');
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });
