import hre from 'hardhat';

/**
 * Script to transfer ADMIN_ROLE from one address to another in KinGallery
 * 
 * Usage:
 * npx hardhat run scripts/transfer-admin.js --network base
 * 
 * Environment variables:
 * - KINGALLERY_ADDRESS: KinGallery contract address (required)
 * - FROM_ADMIN: current admin address (optional - defaults to current signer)
 * - TO_ADMIN: new admin address (required)
 */

async function main() {
  const kingalleryAddress = process.env.KINGALLERY_ADDRESS;
  const toAdmin = process.env.TO_ADMIN;

  if (!kingalleryAddress || !toAdmin) {
    console.error('❌ Missing env vars:');
    console.error('   - KINGALLERY_ADDRESS (current contract address)');
    console.error('   - TO_ADMIN (new admin address to transfer to)');
    process.exit(1);
  }

  const [signer] = await hre.ethers.getSigners();
  console.log('🔑 Signer:', signer.address);
  console.log('📝 KinGallery:', kingalleryAddress);
  console.log('🎯 New Admin:', toAdmin);

  // Get contract
  const KinGallery = await hre.ethers.getContractFactory('KinGallery');
  const contract = KinGallery.attach(kingalleryAddress);

  // Get role hash
  const ADMIN_ROLE = await contract.ADMIN_ROLE();
  console.log('\n📋 ADMIN_ROLE hash:', ADMIN_ROLE);

  // Check current permissions
  console.log('\n🔍 Checking permissions...');
  const signerIsAdmin = await contract.hasRole(ADMIN_ROLE, signer.address);
  const targetIsAdmin = await contract.hasRole(ADMIN_ROLE, toAdmin);

  console.log(`   Signer (${signer.address}) is admin: ${signerIsAdmin}`);
  console.log(`   Target (${toAdmin}) is admin: ${targetIsAdmin}`);

  if (!signerIsAdmin) {
    console.error('\n❌ ERROR: Your address is not admin of this contract!');
    console.error('   Cannot transfer admin role.');
    process.exit(1);
  }

  if (targetIsAdmin) {
    console.log('\n⚠️  Target address is already admin. Skipping...');
    process.exit(0);
  }

  // Grant new admin
  console.log('\n⏳ Granting ADMIN_ROLE to new admin...');
  let tx = await contract.grantRole(ADMIN_ROLE, toAdmin);
  console.log('   TX hash:', tx.hash);
  await tx.wait();
  console.log('✅ ADMIN_ROLE granted to', toAdmin);

  // Revoke old admin (optional - keep both for safety or remove)
  console.log('\n⏳ Revoking ADMIN_ROLE from current signer...');
  tx = await contract.revokeRole(ADMIN_ROLE, signer.address);
  console.log('   TX hash:', tx.hash);
  await tx.wait();
  console.log('✅ ADMIN_ROLE revoked from', signer.address);

  // Verify
  console.log('\n🔍 Verifying final state...');
  const finalSigenerIsAdmin = await contract.hasRole(ADMIN_ROLE, signer.address);
  const finalTargetIsAdmin = await contract.hasRole(ADMIN_ROLE, toAdmin);

  console.log(`   Signer (${signer.address}) is admin: ${finalSigenerIsAdmin}`);
  console.log(`   Target (${toAdmin}) is admin: ${finalTargetIsAdmin}`);

  console.log('\n✨ Admin transfer complete!');
  console.log(`   New admin: ${toAdmin}`);
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
