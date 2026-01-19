#!/usr/bin/env node
/**
 * Usage:
 *  node scripts/set_gallery.cjs --contract <MFER_CONTRACT> --new <NEW_GALLERY_ADDRESS> --rpc <RPC_URL> --pk <PRIVATE_KEY> [--send] [--calldata-only]
 *  node scripts/set_gallery.cjs --kingallery <KINGALERY_CONTRACT> --new <NEW_GALLERY_ADDRESS> --rpc <RPC_URL> --pk <PRIVATE_KEY> --set-payee2 [--send] [--calldata-only]
 *  node scripts/set_gallery.cjs --contract <MFER_CONTRACT> --new <NEW_GALLERY_ADDRESS> --transfer-ownership --rpc <RPC_URL> --pk <PRIVATE_KEY> [--send] [--calldata-only]
 *
 * Options:
 *  --contract        MferMint contract address (default: 0x3EAa38e66e4097262f75ba735A82740e64Afb308)
 *  --kingallery      KinGallery contract address (optional)
 *  --new             New gallery address (required for actions)
 *  --rpc             RPC endpoint (default: https://mainnet.base.org)
 *  --pk              Private key (if using --send). Prefer using a short-lived key or run locally in safe environment.
 *  --send            Send the transaction with provided PK (will check owner matches signer)
 *  --calldata-only   Don't send, print calldata (for multisig/Gnosis Safe execution)
 *  --set-payee2      When used with --kingallery will call setGalleryPayee on KinGallery
 *  --transfer-ownership  Also call transferOwnership(newAddress) on Mfer contract (owner-only)
 */

const { ethers } = require('ethers');
const argv = require('minimist')(process.argv.slice(2));

const MFER_DEFAULT = '0x3EAa38e66e4097262f75ba735A82740e64Afb308'.toLowerCase();
const RPC_DEFAULT = 'https://mainnet.base.org';

const contractAddr = (argv.contract || MFER_DEFAULT).toLowerCase();
const kingalleryAddr = argv.kingallery && argv.kingallery.toLowerCase();
const newGallery = argv.new && argv.new.toLowerCase();
const rpc = argv.rpc || RPC_DEFAULT;
const pk = argv.pk;
const send = !!argv.send;
const calldataOnly = !!argv['calldata-only'];
const setPayee2 = !!argv['set-payee2'];
const transferOwnership = !!argv['transfer-ownership'];

if (!newGallery) {
  console.error('ERROR: --new <NEW_GALLERY_ADDRESS> is required');
  process.exit(1);
}

const mferAbi = [
  'function owner() view returns (address)',
  'function gallery() view returns (address)',
  'function setGallery(address newGallery) external',
  'function transferOwnership(address newOwner) external'
];

const kinGalleryAbi = [
  'function payee2() view returns (address)',
  'function setGalleryPayee(address _payee2) external'
];

(async function main(){
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const mfer = new ethers.Contract(contractAddr, mferAbi, provider);

  const owner = (await mfer.owner()).toLowerCase();
  const gallery = (await mfer.gallery()).toLowerCase();
  console.log('Mfer contract:', contractAddr);
  console.log('Current owner:', owner);
  console.log('Current gallery:', gallery);
  console.log('New gallery:', newGallery);

  // Prepare calldata for setGallery
  const iface = new ethers.utils.Interface(mferAbi);
  const setGalleryData = iface.encodeFunctionData('setGallery', [newGallery]);
  const transferOwnershipData = iface.encodeFunctionData('transferOwnership', [newGallery]);

  // KinGallery optional
  let kinGalleryData = null;
  if (kingalleryAddr && setPayee2) {
    const kgIface = new ethers.utils.Interface(kinGalleryAbi);
    kinGalleryData = kgIface.encodeFunctionData('setGalleryPayee', [newGallery]);
    const kgContract = new ethers.Contract(kingalleryAddr, kinGalleryAbi, provider);
    const currentPayee2 = (await kgContract.payee2()).toLowerCase();
    console.log('KinGallery:', kingalleryAddr, 'current payee2:', currentPayee2);
  }

  if (calldataOnly) {
    console.log('\n--- Calldata (for multisig / Gnosis) ---');
    console.log('Mfer setGallery calldata:', setGalleryData);
    if (transferOwnership) console.log('Mfer transferOwnership calldata:', transferOwnershipData);
    if (kinGalleryData) console.log('KinGallery setGalleryPayee calldata:', kinGalleryData);
    console.log('To (Mfer):', contractAddr);
    if (kingalleryAddr) console.log('To (KinGallery):', kingalleryAddr);
    process.exit(0);
  }

  if (!send) {
    console.log('\nNo --send flag: prepared calldata but not sending. Use --calldata-only for multisig output, or add --send --pk to broadcast.');
    console.log('Prepared tx data:');
    console.log({ setGalleryData, transferOwnership: transferOwnership ? transferOwnershipData : null, kinGalleryData });
    process.exit(0);
  }

  if (!pk) {
    console.error('ERROR: --pk required when using --send');
    process.exit(1);
  }

  const wallet = new ethers.Wallet(pk, provider);
  console.log('Signer:', wallet.address);
  if (wallet.address.toLowerCase() !== owner.toLowerCase()) {
    console.warn('WARNING: signer is not the owner of the Mfer contract - transaction will likely revert if signer lacks permission. Owner:', owner);
  }

  const mferWithSigner = mfer.connect(wallet);
  try {
    console.log('Sending setGallery transaction...');
    const tx = await mferWithSigner.setGallery(newGallery);
    console.log('tx hash:', tx.hash);
    await tx.wait();
    console.log('setGallery confirmed');
  } catch (err) {
    console.error('setGallery failed:', err && err.message ? err.message : err);
  }

  if (transferOwnership) {
    try {
      console.log('Sending transferOwnership transaction...');
      const tx2 = await mferWithSigner.transferOwnership(newGallery);
      console.log('tx hash:', tx2.hash);
      await tx2.wait();
      console.log('transferOwnership confirmed');
    } catch (err) {
      console.error('transferOwnership failed:', err && err.message ? err.message : err);
    }
  }

  if (kingalleryAddr && setPayee2) {
    const kg = new ethers.Contract(kingalleryAddr, kinGalleryAbi, provider).connect(wallet);
    try {
      console.log('Sending KinGallery setGalleryPayee transaction...');
      const tx3 = await kg.setGalleryPayee(newGallery);
      console.log('tx hash:', tx3.hash);
      await tx3.wait();
      console.log('KinGallery setGalleryPayee confirmed');
    } catch (err) {
      console.error('KinGallery setGalleryPayee failed:', err && err.message ? err.message : err);
    }
  }

  console.log('\nDone. Verify on-chain that `gallery` and ownership updated.');
  process.exit(0);
})();
