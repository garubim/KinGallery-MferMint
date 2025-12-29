const hre = require('hardhat');

async function main() {
  const USDC = process.env.USDC_ADDRESS;
  const NEW_RELAYER = process.env.NEW_RELAYER;
  const MULTISIG = process.env.MULTISIG_ADDRESS; // address to become owner

  if(!USDC || !NEW_RELAYER || !MULTISIG){
    console.error('Missing env vars. Set USDC_ADDRESS, NEW_RELAYER, MULTISIG_ADDRESS and run with npx hardhat run --network <network> scripts/deployKinGallery.js');
    process.exit(1);
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with', deployer.address);

  const Gallery = await hre.ethers.getContractFactory('Gallery');
  const gallery = await Gallery.deploy(USDC);
  await gallery.deployed();
  console.log('Deployed Gallery (KinGallery) at', gallery.address);

  // set relayer while deployer is still owner
  const tx1 = await gallery.setRelayer(NEW_RELAYER);
  console.log('setRelayer tx sent', tx1.hash);
  await tx1.wait();
  console.log('Relayer set to', NEW_RELAYER);

  // transfer ownership to multisig
  const tx2 = await gallery.transferOwnership(MULTISIG);
  console.log('transferOwnership tx sent', tx2.hash);
  await tx2.wait();
  console.log('Ownership transferred to', MULTISIG);

  console.log('Done. Update frontends to use new contract address:', gallery.address);
}

main().catch((err)=>{ console.error(err); process.exit(1); });
