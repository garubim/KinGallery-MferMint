const hre = require('hardhat');
const fs = require('fs');
async function main(){
  const USDC = process.env.USDC_ADDRESS;
  const NEW_RELAYER = process.env.NEW_RELAYER;
  const MULTISIG = process.env.MULTISIG_ADDRESS;

  if(!USDC || !NEW_RELAYER || !MULTISIG){
    console.error('Missing env vars. Set USDC_ADDRESS, NEW_RELAYER, MULTISIG_ADDRESS and run with node scripts/generate_relayer_payloads.js');
    process.exit(1);
  }

  // ensure artifacts compiled
  await hre.run('compile');

  const Gallery = await hre.ethers.getContractFactory('Gallery');

  // Deploy tx payload (unsigned)
  const deployTx = Gallery.getDeployTransaction(USDC);
  const deployPayload = {
    to: null, // null for contract creation
    value: deployTx.value ? deployTx.value.toString() : '0',
    data: deployTx.data,
  };

  // After deployment we need to call setRelayer and transferOwnership
  // Build calldata (requires ABI)
  const galleryInterface = Gallery.interface;
  const setRelayerData = galleryInterface.encodeFunctionData('setRelayer', [NEW_RELAYER]);
  const transferOwnershipData = galleryInterface.encodeFunctionData('transferOwnership', [MULTISIG]);

  // Save payloads to txs/
  if(!fs.existsSync('txs')) fs.mkdirSync('txs');
  fs.writeFileSync('txs/deploy_payload.json', JSON.stringify(deployPayload, null, 2));
  fs.writeFileSync('txs/setRelayer_payload.json', JSON.stringify({ to: '<deployed_contract_address_here>', value: '0', data: setRelayerData }, null, 2));
  fs.writeFileSync('txs/transferOwnership_payload.json', JSON.stringify({ to: '<deployed_contract_address_here>', value: '0', data: transferOwnershipData }, null, 2));

  console.log('Payloads written to txs/*.json');
  console.log('Next: send deploy_payload.json to your Wallet Server V2 endpoint to create the contract. After deployment, replace <deployed_contract_address_here> in the other files with the actual address and send them in order.');
  console.log('\nExample curl (replace URL and TOKEN):');
  console.log("curl -X POST \"https://your-wallet-server.example/api/transactions\" -H \"Authorization: Bearer $TOKEN\" -H \"Content-Type: application/json\" -d @txs/deploy_payload.json");
}

main().catch((err)=>{ console.error(err); process.exit(1); });
