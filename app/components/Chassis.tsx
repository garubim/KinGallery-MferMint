'use client';

import React from 'react';

export default function Chassis({ children }: { children: React.ReactNode }) {
  return (
    <div className="chassis-root">
      {/* Background Glows */}
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <div className="glow glow-3" />

      {/* Content */}
      <div className="content-wrapper">
        {children}
      </div>

      {/* Bottom Safe Area */}
      <div className="safe-area-bottom" />

      <style jsx>{`
        .chassis-root {
          width: 100vw;
          height: 100vh;
          background: #05080a;
          color: #fff;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 1;
          pointer-events: none;
          opacity: 0.6;
        }

        .glow-1 {
          top: -10%;
          left: -10%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(0, 105, 255, 0.15) 0%, transparent 70%);
          animation: float 20s infinite alternate ease-in-out;
        }

        .glow-2 {
          bottom: -10%;
          right: -10%;
          width: 70vw;
          height: 70vw;
          background: radial-gradient(circle, rgba(0, 230, 255, 0.1) 0%, transparent 70%);
          animation: float 25s infinite alternate-reverse ease-in-out;
        }

        .glow-3 {
          top: 40%;
          left: 30%;
          width: 40vw;
          height: 40vw;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
          animation: float 15s infinite alternate ease-in-out;
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(5%, 5%) scale(1.1); }
        }

        .content-wrapper {
          flex: 1;
          z-index: 2;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .safe-area-bottom {
          height: env(safe-area-inset-bottom);
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
