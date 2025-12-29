'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = { text: string; className?: string; keyBase?: string };

export default function AnimatedText({ text, className, keyBase }: Props) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [revealKey, setRevealKey] = useState(0);

  useEffect(() => {
    // bump key to trigger re-render animation when text changes
    setRevealKey((k) => k + 1);
  }, [text]);

  return (
    <span className={className} aria-hidden={false} role="text">
      {chars.map((ch, i) => {
        const delay = `${i * 30}ms`;
        return (
          <span
            key={`${keyBase || 'at'}-${revealKey}-${i}-${ch}`}
            style={{ display: 'inline-block', willChange: 'transform,opacity', animationDelay: delay }}
            className="alo-char"
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        );
      })}

      <style jsx>{`
        .alo-char { opacity: 0; transform: translateY(8px) scale(0.98); display:inline-block }
        @media (prefers-reduced-motion: no-preference) {
          .alo-char { animation: aloIn 360ms ease forwards }
          @keyframes aloIn { to { opacity: 1; transform: none } }
        }
        @media (prefers-reduced-motion: reduce) {
          .alo-char { opacity: 1; transform: none }
        }
      `}</style>
    </span>
  );
}
