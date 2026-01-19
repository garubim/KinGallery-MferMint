import hre from 'hardhat';

async function main() {
  const USDC = process.env.USDC_ADDRESS;
  const NEW_RELAYER = process.env.NEW_RELAYER;
  const MULTISIG = process.env.MULTISIG_ADDRESS;

  if(!USDC || !NEW_RELAYER || !MULTISIG){
    console.error('Missing env vars. Set USDC_ADDRESS, NEW_RELAYER, MULTISIG_ADDRESS');
    process.exit(1);
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with', deployer.address);

  const KinGallery = await hre.ethers.getContractFactory('KinGallery');
  const kingallery = await KinGallery.deploy(USDC, MULTISIG);
  await kingallery.deployed();
  console.log('Deployed KinGallery at', kingallery.address);

  // Set relayer to NEW_RELAYER
  const tx = await kingallery.setRelayer(NEW_RELAYER);
  console.log('setRelayer tx sent', tx.hash);
  await tx.wait();
  console.log('Relayer set to', NEW_RELAYER);

  console.log('Done. Contract address:', kingallery.address);
}

main().catch((err)=>{ console.error(err); process.exit(1); });