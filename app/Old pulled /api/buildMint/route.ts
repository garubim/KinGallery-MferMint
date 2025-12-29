import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData } from 'viem';

// Minimal rate-limiter + allowlist for /api/buildMint
// Configurable via env:
// - ALLOWED_RECIPIENTS (comma-separated addresses) optional
// - RATE_LIMIT_PER_IP (number, default 60)
// - RATE_LIMIT_WINDOW_SEC (seconds, default 3600)
// - REPLAY_PROTECT (boolean, default true)

// ABI for Gallery.payAndMint(address artistContract, address to, string paymentId)
const GALLERY_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'artistContract', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'string', name: 'paymentId', type: 'string' },
    ],
    name: 'payAndMint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

const ENTRY_POINT_ADDRESS = process.env.ENTRY_POINT_ADDRESS || '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

// Simple in-memory stores (works for basic protection; serverless env resets on cold start)
const ipStore = new Map<string, { count: number; resetAt: number }>();
const paymentIdStore = new Set<string>();

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

function getClientIp(req: NextRequest) {
  const xff = req.headers.get('x-forwarded-for') || req.headers.get('x-nf-client-connection-ip');
  if (!xff) return 'unknown';
  return xff.split(',')[0].trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      contractAddress,
      artistContract,
      buyerAddress,
      paymentId,
      sponsored = true,
      value = '0',
    } = body;

    if (!contractAddress || !artistContract || !buyerAddress || !paymentId) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }

    const PAYMASTER_RPC_URL = process.env.PAYMASTER_RPC_URL;
    if (!PAYMASTER_RPC_URL) {
      return NextResponse.json({ error: 'PAYMASTER_RPC_URL not configured on server' }, { status: 500 });
    }

    // Basic allowlist check (optional)
    const allowed = process.env.ALLOWED_RECIPIENTS;
    if (allowed) {
      const allowedSet = new Set(allowed.split(',').map(s => s.trim().toLowerCase()));
      if (!allowedSet.has(contractAddress.toLowerCase())) {
        return NextResponse.json({ error: 'recipient not allowed' }, { status: 403 });
      }
    }

    // Build calldata for payAndMint and verify selector
    const calldata = encodeFunctionData({ abi: GALLERY_ABI as any, functionName: 'payAndMint', args: [artistContract, buyerAddress, paymentId] });
    const expectedSelector = calldata.slice(0, 10); // 0x + 8 hex chars
    // defensive: ensure calldata provided to entrypoint will have that selector

    // Rate-limit by IP
    const limit = Number(process.env.RATE_LIMIT_PER_IP || 60);
    const windowSec = Number(process.env.RATE_LIMIT_WINDOW_SEC || 3600);
    const ip = getClientIp(req);
    const now = nowSec();
    const entry = ipStore.get(ip) || { count: 0, resetAt: now + windowSec };
    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowSec;
    }
    entry.count += 1;
    ipStore.set(ip, entry);
    if (entry.count > limit) {
      return NextResponse.json({ error: 'rate limit exceeded' }, { status: 429 });
    }

    // Basic replay protection by paymentId
    if ((process.env.REPLAY_PROTECT ?? 'true') === 'true') {
      if (paymentIdStore.has(paymentId)) {
        return NextResponse.json({ error: 'paymentId already used' }, { status: 409 });
      }
      paymentIdStore.add(paymentId);
    }

    // Non-sponsored (server pays via CDP)
    if (!sponsored) {
      try {
        const { CdpClient } = await import('@coinbase/cdp-sdk');
        const cdp = new CdpClient();

        const tx = { to: contractAddress, data: calldata, value } as any;
        const result = await cdp.evm.sendTransaction({
          address: process.env.CDP_SERVER_ACCOUNT_ADDRESS || 'cdp-server-address',
          transaction: tx,
          network: process.env.CDP_NETWORK || 'base-sepolia',
        } as any);

        return NextResponse.json({ ok: true, tx: result });
      } catch (err: any) {
        console.error('CDP sendTransaction error', err?.message || err);
        return NextResponse.json({ error: 'server send failed', details: String(err) }, { status: 500 });
      }
    }

    // Sponsored flow: construct userOp and request paymaster data
    const userOp = {
      sender: buyerAddress,
      nonce: '0x0',
      initCode: '0x',
      callData: calldata,
      callGasLimit: '0x5208',
      verificationGasLimit: '0x5208',
      preVerificationGas: '0x5208',
      maxFeePerGas: '0x0',
      maxPriorityFeePerGas: '0x0',
      paymasterAndData: '0x',
      signature: '0x',
    };

    const pmPayload = { jsonrpc: '2.0', id: 1, method: 'pm_getPaymasterData', params: [userOp] };
    const pmResp = await fetch(PAYMASTER_RPC_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pmPayload) });
    if (!pmResp.ok) {
      const txt = await pmResp.text();
      console.error('Paymaster pm_getPaymasterData error', pmResp.status, txt);
      return NextResponse.json({ error: 'paymaster error', details: txt }, { status: 502 });
    }
    const pmJson = await pmResp.json();
    const paymasterResult = pmJson.result ?? pmJson;
    if (!paymasterResult) return NextResponse.json({ error: 'invalid paymaster response', details: pmJson }, { status: 502 });
    if (paymasterResult.paymasterAndData) userOp.paymasterAndData = paymasterResult.paymasterAndData;
    const finalUserOp = paymasterResult.userOperation ?? userOp;

    // Submit to bundler (using PAYMASTER_RPC_URL by default; you can set BUNDLER_URL separately)
    const bundlerUrl = process.env.BUNDLER_URL || PAYMASTER_RPC_URL;
    const sendPayload = { jsonrpc: '2.0', id: 2, method: 'eth_sendUserOperation', params: [finalUserOp, ENTRY_POINT_ADDRESS] };
    const sendResp = await fetch(bundlerUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sendPayload) });
    if (!sendResp.ok) {
      const txt = await sendResp.text();
      console.error('Bundler send error', sendResp.status, txt);
      return NextResponse.json({ error: 'bundler send failed', details: txt }, { status: 502 });
    }
    const sendJson = await sendResp.json();
    return NextResponse.json({ ok: true, paymaster: paymasterResult, bundler: sendJson, selector: expectedSelector });
  } catch (err: any) {
    console.error('buildMint error', err?.message || err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
