const hre = require('hardhat');

async function main() {
  const USDC = process.env.USDC_ADDRESS;
  const NEW_RELAYER = process.env.NEW_RELAYER; // Wallet Server v2 address
  const MULTISIG = process.env.MULTISIG_ADDRESS; // Multisig address

  if(!USDC || !NEW_RELAYER || !MULTISIG){
    console.error('Missing env vars. Set USDC_ADDRESS, NEW_RELAYER, MULTISIG_ADDRESS and run with npx hardhat run --network <network> scripts/deployKinGallery.js');
    process.exit(1);
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with', deployer.address);

  const KinGallery = await hre.ethers.getContractFactory('KinGallery');
  const kingallery = await KinGallery.deploy(USDC, MULTISIG);
  await kingallery.deployed();
  console.log('Deployed KinGallery at', kingallery.address);

  // Grant RELAYER_ROLE to NEW_RELAYER
  const tx1 = await kingallery.setRelayer(NEW_RELAYER);
  console.log('setRelayer tx sent', tx1.hash);
  await tx1.wait();
  console.log('Relayer set to', NEW_RELAYER);

  // Revoke deployer admin role if desired (deployer is initial admin)
  // const tx2 = await kingallery.revokeRole(await kingallery.DEFAULT_ADMIN_ROLE(), deployer.address);
  // await tx2.wait();
  // console.log('Deployer admin role revoked');

  console.log('Done. Update frontends to use new contract address:', kingallery.address);
}

main().catch((err)=>{ console.error(err); process.exit(1); });
