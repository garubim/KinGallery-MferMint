import { NextResponse } from 'next/server';

// Server-side RPC health check proxy to avoid CORS from browser
export async function GET() {
  // Use reliable Base RPC endpoints
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://base.drpc.org';

  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] }),
      signal: AbortSignal.timeout(5000), // 5s timeout instead of default 30s
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ healthy: false, status: res.status, error: text }, { status: 502 });
    }

    const data = await res.json();
    const isHealthy = !data.error && !!data.result;

    return NextResponse.json({ healthy: isHealthy, result: data.result || null });
  } catch (err: any) {
    return NextResponse.json({ healthy: false, error: String(err) }, { status: 502 });
  }
}
