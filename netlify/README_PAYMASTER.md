# Netlify Paymaster Proxy

This Netlify Function fetches Paymaster credentials from AWS Secrets Manager and proxies requests to your Paymaster RPC endpoint adding the Authorization header.

Files:
- `netlify/functions/paymasterProxy.js` - Netlify Serverless function.

Environment variables (set in Netlify Site → Site settings → Build & deploy → Environment):

- `AWS_ACCESS_KEY_ID` — (if using IAM user) programmatic key
- `AWS_SECRET_ACCESS_KEY` — (if using IAM user)
- `AWS_REGION` — AWS region where the secret lives (ex: `us-east-1`)
- `KIN_SECRET_NAME` — Secret name (ex: `kin-gallery/paymaster`)

Secret structure (Secrets Manager) — JSON example:

```
{
  "PAYMASTER_RPC_URL": "https://api.developer.coinbase.com/...",
  "PAYMASTER_API_KEY": "sk_live_...",
  "AUTH_SCHEME": "Bearer"
}
```

How it works:
- Frontend POSTs the same JSON you would send to the Paymaster to `/.netlify/functions/paymasterProxy`.
- The function reads the secret, builds `Authorization: <AUTH_SCHEME> <PAYMASTER_API_KEY>` and forwards the request to `PAYMASTER_RPC_URL`.

Test example (frontend `fetch`):

```js
fetch('/.netlify/functions/paymasterProxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'pm_getPaymasterStubData', params: [ /* ... */ ] })
}).then(r => r.json()).then(console.log).catch(console.error)
```

Notes:
- Prefer OIDC/assume-role for production instead of IAM access keys. 
- Keep secrets out of chat and source control.
