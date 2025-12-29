'use client';

import React, { useState } from 'react';

export default function Page() {
  const [resp, setResp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const makePayload = () => ({
    to: process.env.NEXT_PUBLIC_MFER_ADDRESS || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
    value: '0',
    data: '0x',
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111),
    meta: { purpose: 'mint', createdAt: Date.now() },
  });

  const send = async () => {
    setLoading(true);
    setResp(null);
    try {
      const unsignedPayload = makePayload();
      const r = await fetch('/.netlify/functions/relay-paymaster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unsignedPayload }),
      });
      const text = await r.text();
      setResp(text);
    } catch (e: any) {
      setResp(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: '#071017', color: '#fff' }}>
      <div style={{ width: 680, maxWidth: '94vw', padding: 24, borderRadius: 12, background: 'linear-gradient(180deg, rgba(8,10,18,0.9), rgba(6,8,12,0.8))' }}>
        <h1 style={{ marginTop: 0 }}>KinGallery + MferMint — Paymaster demo</h1>
        <p>This minimal app demonstrates sending an unsigned payload to a paymaster function.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={send} style={{ padding: '10px 14px', borderRadius: 8, background: '#0069ff', border: 'none', color: '#fff' }} disabled={loading}>
            {loading ? 'Enviando…' : 'Gerar e enviar payload não assinado'}
          </button>
        </div>
        {resp && <pre style={{ marginTop: 12, color: '#dff', whiteSpace: 'pre-wrap' }}>{resp}</pre>}
      </div>
    </main>
  );
}
