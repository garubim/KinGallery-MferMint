'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = { text: string; className?: string; keyBase?: string; onEnd?: () => void };

export default function CustomAnimatedText({ text, className, keyBase, onEnd }: Props) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [revealKey, setRevealKey] = useState(0);
  // animation timing constants (used in render and in effect)
  const perChar = 28; // ms delay per char
  const duration = 320; // ms animation duration per char

  useEffect(() => {
    setRevealKey((k) => k + 1);
    // Call onEnd after the per-char animation completes (default quick animation)
    const estimated = chars.length * perChar + duration + 80;
    const t = setTimeout(() => { onEnd?.(); }, estimated);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <span className={className} aria-hidden={false} role="text">
      {chars.map((ch, i) => (
        <span
          key={`${keyBase || 'cust'}-${revealKey}-${i}-${ch}`}
          data-char-index={i}
          className="custom-alo-char"
          style={{ display: 'inline-block', willChange: 'transform,opacity', animationDelay: `${i * perChar}ms` }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}

      <style jsx>{`
        .custom-alo-char { opacity: 0; transform: translateY(8px) scale(0.98); }
        @media (prefers-reduced-motion: no-preference) {
          .custom-alo-char { animation: customAloIn ${duration}ms cubic-bezier(.2,.9,.35,1) forwards; }
        }
        @media (prefers-reduced-motion: reduce) {
          .custom-alo-char { opacity: 1; transform: none; }
        }
        @keyframes customAloIn { to { opacity: 1; transform: none; } }
      `}</style>
    </span>
  );
}
