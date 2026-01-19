Short guide: How to compile and compare the MferMint standard-json

1) Compile in Node (solc-js):

   node scripts/compile_mfermint_standard_json.js contracts/MferMint_StandardJSON_CORRECTED.json contracts/build

2) Output notes:
   - contracts/build/mfer_compiled_raw.json  -> full solc JSON output
   - contracts/build/mfer_bytecode.hex       -> creation bytecode (hex)
   - contracts/build/mfer_deployed.hex       -> runtime bytecode (hex)
   - contracts/build/mfer_buildinfo.json     -> build metadata (settings)
   - contracts/build/mfer_onchain_compare.json -> on-chain comparison report (if available)

3) Use the produced files for verification on BaseScan or further diagnostic steps.

Note: The script uses the 'solc' package (solc-js). If the package is not installed, run:

   npm i solc@0.8.19 --no-save --legacy-peer-deps

or use npx solc in a different workflow to get the same compilation.  

Reminder: We will not perform the mainnet deploy here; please use Remix for deploy steps if you prefer (as discussed).