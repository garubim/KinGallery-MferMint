"use client";

import { useEffect, useRef, useState } from 'react';

export default function CodePoem({ src, poem }: { src?: string; poem?: string }) {
  const [open, setOpen] = useState(false);
  // Prefer bundled 'Matrix' assets in public/code_poem-Matrix when available
  const defaultMatrix = '/code_poem-Matrix/Matrix Codepoem 2 Layers Blue&Green Curto half ProRes 4444+Alpha .webm';
  const videoSrc = src || process.env.NEXT_PUBLIC_CODEPOEM_WEBM || defaultMatrix || '/codepoem.webm';
  const text = poem || `/**\n * manifestoSoul — versão rápida\n * no núcleo da noite, o código respira\n * sussurros onchain dobram-se em loops\n * mintamos o eco e chamemos de lar\n */\nfunction manifestoSoul() external pure returns (string memory) {\n  return "eternal";\n}`;

  const chars = Array.from(text);
  const closeRef = useRef<HTMLDivElement | null>(null);
  const [mintMsg, setMintMsg] = useState<string | null>(null);
  const isWebm = /\.webm($|\?)/i.test(videoSrc);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const handleMintPlaceholder = () => {
    try {
      const meta = {
        name: 'CodePoem — EternalLoop',
        description: 'A codepoem minted from EternalLoop',
        poem: text,
        media: videoSrc,
        createdAt: new Date().toISOString(),
      };
      // save to localStorage as placeholder for actual IPFS pin
      const raw = localStorage.getItem('codepoem_mints_v1') || '[]';
      const arr = JSON.parse(raw);
      arr.unshift(meta);
      localStorage.setItem('codepoem_mints_v1', JSON.stringify(arr));
      // trigger download of metadata.json for user's upload to IPFS if desired
      const blob = new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'codepoem-metadata.json';
      a.click();
      setMintMsg('Metadata downloaded to your device.');
      setTimeout(() => setMintMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {open && (
        <div role="dialog" onClick={() => setOpen(false)} style={{
          position:'fixed', inset:0, display:'grid', placeItems:'center', background:'rgba(0,0,0,0.55)', zIndex: 5999
        }}>
          <div ref={closeRef} onClick={(e) => e.stopPropagation()} className="cp-stage" style={{
            width:720, maxWidth:'94vw', height: '76vh', maxHeight: '86vh', padding:0, borderRadius:14, transform:'translateZ(40px) rotateX(6deg)',
            background:'linear-gradient(180deg, rgba(8,10,18,0.92), rgba(4,6,12,0.78))',
            boxShadow:'0 40px 120px rgba(0,0,0,0.7)', color:'#fff', overflow: 'hidden', position: 'relative'
          }}>
            {/* close button */}
            <button onClick={() => setOpen(false)} aria-label="close" className="cp-close" style={{ position: 'absolute', right: 12, top: 12, zIndex: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', padding: '6px 8px', borderRadius: 8 }}>✕</button>
            {/* Background media: use <video> for .webm, <img> for animated webp/gif */}
            {isWebm ? (
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
              />
            ) : (
              <img
                src={videoSrc}
                alt="CodePoem background"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
              />
            )}

            {/* depth / mask layer placeholder for artist */}
            <div className="cp-layer cp-layer-depth" data-layer="depth" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />

            {/* code layer: each character is a span the artist can animate */}
            <pre className="cp-layer cp-layer-code" aria-hidden style={{ position: 'absolute', zIndex: 2, inset: '6% 6% auto 6%', margin: 0, padding: '22px', overflow: 'auto', maxHeight: '62%', background: 'rgba(0,0,0,0.12)', borderRadius: 8 }}>
              {chars.map((ch, i) => (
                <span
                  key={`cp-${i}-${ch}`}
                  className="cp-char"
                  data-index={i}
                  style={{ display: 'inline-block', whiteSpace: 'pre', willChange: 'transform,opacity', animationDelay: `${i * 26}ms`, opacity: 0, transform: 'translateY(8px) scale(0.98)' }}
                >{ch}</span>
              ))}
            </pre>

            {/* UI / metadata area */}
            <div className="cp-layer cp-layer-ui" style={{ position: 'absolute', zIndex: 3, left: 20, right: 20, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'auto' }}>
              <div style={{ color: '#e6fff6', fontFamily: 'Inter, monospace', fontSize: 13 }}>
                <div style={{ fontWeight: 700 }}>manifestoSoul()</div>
                <div style={{ opacity: 0.85, marginTop: 6 }}>q9p1B3</div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.75)' }}><small>click outside to close • esc to close</small></div>
                <div>
                  <button onClick={handleMintPlaceholder} style={{ padding: '8px 10px', borderRadius: 8, background: 'linear-gradient(90deg,#00c6fb,#005bea)', color: '#fff', border: 'none' }}>Mint this codepoem</button>
                </div>
              </div>
            </div>

            {mintMsg && <div style={{ position: 'absolute', left: 20, top: 16, zIndex: 7, background: 'rgba(0,0,0,0.6)', padding: '8px 12px', borderRadius: 8, color: '#dff' }}>{mintMsg}</div>}
            <style>{`
              .cp-stage { --cp-accent: #00c6fb; }
              .cp-layer-code { color: #dff; font-family: Inter, monospace; font-size: 13px; line-height: 1.35; }
              .cp-char { transition: transform 360ms ease, opacity 300ms ease; }
              @keyframes cpCharIn { to { opacity: 1; transform: none; } }
              @media (prefers-reduced-motion: no-preference) {
                .cp-char { animation: cpCharIn 320ms cubic-bezier(.2,.9,.35,1) forwards; }
              }
              @media (prefers-reduced-motion: reduce) { .cp-char { transition: none !important } }

              /* camouflaged micro-text */
              .cp-camouflage { display: inline-flex; flex-direction: column; gap: 2px; align-items: flex-start; color: rgba(255,255,255,0.9); font-family: Inter, sans-serif; }
              .cp-camouflage:focus { outline: none; }
              .cp-camouflage .cp-recognize { font-size: 12px; opacity: 0.12; transition: opacity 240ms ease, transform 240ms ease; transform: translateY(0); }
              .cp-camouflage:hover .cp-recognize, .cp-camouflage:focus .cp-recognize { opacity: 1; transform: translateY(-2px); }

              /* glitch text (subtle) */
              .cp-glitch { display: inline-block; font-size: 11px; letter-spacing: 0.6px; opacity: 0.16; transform-origin: left center; transition: opacity 220ms ease; }
              .cp-camouflage:hover .cp-glitch, .cp-camouflage:focus .cp-glitch { opacity: 0.95; }
              .cp-glitch::before, .cp-glitch::after { content: attr(data-text); position: absolute; left: 0; top: 0; opacity: 0.6; }
              @keyframes cp-glitch-x { 0% { transform: translateX(0); } 20% { transform: translateX(-2px); } 40% { transform: translateX(2px); } 60% { transform: translateX(-1px); } 80% { transform: translateX(1px); } 100% { transform: translateX(0); } }
              .cp-glitch { animation: cp-glitch-x 3.6s linear infinite; }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
