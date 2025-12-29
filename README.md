Paymaster App (minimal scaffold)

This scaffold is a minimal Next-style app focused on OnchainKit + paymaster flow.

Quick steps to run locally:

1. cd paymaster-app
2. npm install
3. npm run dev

Notes:
- This is a minimal scaffold. Install required deps such as `@coinbase/onchainkit`, `wagmi`, `viem` when you are ready.
- The Netlify function `netlify/functions/relay-paymaster.js` is a stub that logs payloads; replace with your real paymaster integration.
- The client posts unsigned relayer payloads to `/.netlify/functions/relay-paymaster`.

Next actions I can take on this scaffold:
- Wire a working unsigned payload generator (Wallet Server V2 format)
- Implement the Netlify function to sign/submit via your paymaster secret
- Create a separate repo from this folder on request
