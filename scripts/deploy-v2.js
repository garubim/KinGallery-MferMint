import hre from 'hardhat';

async function main() {
  const USDC = process.env.USDC_ADDRESS;
  const NEW_RELAYER = process.env.NEW_RELAYER;
  const MULTISIG = process.env.MULTISIG_ADDRESS;
  const PAYEE1 = process.env.PAYEE1_ADDRESS;
  const PAYEE2 = process.env.PAYEE2_ADDRESS;

  if (!USDC || !NEW_RELAYER || !MULTISIG || !PAYEE1 || !PAYEE2) {
    console.error('❌ Missing env vars. Set:');
    console.error('   - USDC_ADDRESS');
    console.error('   - NEW_RELAYER');
    console.error('   - MULTISIG_ADDRESS');
    console.error('   - PAYEE1_ADDRESS');
    console.error('   - PAYEE2_ADDRESS');
    process.exit(1);
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log('🚀 Deploying with account:', deployer.address);
  console.log('   Network: Base Mainnet');

  // Verify inputs
  console.log('\n📋 Deployment Configuration:');
  console.log('   USDC:', USDC);
  console.log('   Multisig/Admin:', MULTISIG);
  console.log('   Relayer:', NEW_RELAYER);
  console.log('   Payee1:', PAYEE1);
  console.log('   Payee2:', PAYEE2);

  // Deploy
  console.log('\n⏳ Deploying KinGallery...');
  const KinGallery = await hre.ethers.getContractFactory('KinGallery');
  const kingallery = await KinGallery.deploy(USDC, MULTISIG, PAYEE1, PAYEE2);
  await kingallery.deployed();
  console.log('✅ Deployed KinGallery at', kingallery.address);

  // Set relayer
  console.log('\n⏳ Setting relayer...');
  const tx1 = await kingallery.setRelayer(NEW_RELAYER);
  console.log('   TX hash:', tx1.hash);
  await tx1.wait();
  console.log('✅ Relayer set to', NEW_RELAYER);

  // Verify state
  console.log('\n🔍 Verification:');
  const payee1 = await kingallery.payee1();
  const payee2 = await kingallery.payee2();
  const mintPrice = await kingallery.MINT_PRICE();
  
  console.log('   Payee1:', payee1);
  console.log('   Payee2:', payee2);
  console.log('   MINT_PRICE:', mintPrice.toString(), 'wei');
  console.log('   MINT_PRICE:', hre.ethers.utils.formatEther(mintPrice), 'ETH');

  if (payee1.toLowerCase() !== PAYEE1.toLowerCase()) {
    console.error('❌ ERROR: Payee1 mismatch!');
    process.exit(1);
  }
  if (payee2.toLowerCase() !== PAYEE2.toLowerCase()) {
    console.error('❌ ERROR: Payee2 mismatch!');
    process.exit(1);
  }

  console.log('\n✨ ✅ Deploy successful!');
  console.log('   Contract Address:', kingallery.address);
  console.log('\n📝 Next steps:');
  console.log('   1. Update frontend .env.local with new contract address');
  console.log('   2. Verify contract on BaseScan');
  console.log('   3. Test with small transaction');
  console.log('   4. Check that funds reach payee2');
}

main().catch((err) => {
  console.error('❌ Deploy failed:', err);
  process.exit(1);
});
