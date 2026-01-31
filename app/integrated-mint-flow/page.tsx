'use client';

import { useState, useRef } from 'react';
import { MagicButtonNew as MagicButton } from '@/app/components/MagicButton';

export default function IntegratedMintFlowPage() {
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMint = async () => {
    setState('loading');
    
    // Reset video to start
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }

    // Simulate mint transaction (2 seconds)
    setTimeout(() => {
      setState('success');
    }, 2000);
  };

  const handleReset = () => {
    setState('idle');
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-cyan-950 to-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">🎬 Integrated Mint Flow</h1>
          <p className="text-cyan-300">Welcome Animation + Magic Button + Mint</p>
        </div>

        {/* State Indicator */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-gray-800 px-6 py-3 rounded-full border border-gray-700">
            <div
              className={`w-3 h-3 rounded-full ${
                state === 'idle'
                  ? 'bg-cyan-400 animate-pulse'
                  : state === 'loading'
                  ? 'bg-orange-400 animate-pulse'
                  : 'bg-green-400 animate-pulse'
              }`}
            />
            <span className="text-gray-300 font-semibold capitalize">
              State: {state === 'idle' && '🟢 Ready'}
              {state === 'loading' && '🟠 Minting...'}
              {state === 'success' && '🟢 Success!'}
            </span>
          </div>
        </div>

        {/* Main Container */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
          {/* Top Section: Welcome Animation */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-12 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-gray-300 mb-6 text-center">
              Welcome Animation
            </h2>

            <div className="bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-96 mb-6">
              {state === 'idle' && (
                <div className="text-center text-gray-500">
                  <div className="text-5xl mb-3">📹</div>
                  <p>Click the button below to start</p>
                </div>
              )}

              {state === 'loading' && (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-contain"
                  onEnded={() => {
                    // Video ends, keep showing for effect
                  }}
                >
                  <source
                    src="/MagicButton-OfficialAnimatedTitels/WELCOME-COMPLETE-MBLUR.webm"
                    type="video/webm"
                  />
                  Your browser does not support the video tag.
                </video>
              )}

              {state === 'success' && (
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce">✨</div>
                  <h3 className="text-3xl font-bold text-green-400 mb-2">NFT Minted!</h3>
                  <p className="text-gray-400">Your artwork is ready</p>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500 text-center">
              <p>
                {state === 'idle' && 'The welcome animation plays when you click mint'}
                {state === 'loading' && 'Your NFT is being minted on the blockchain...'}
                {state === 'success' && 'Check your wallet for your new NFT!'}
              </p>
            </div>
          </div>

          {/* Bottom Section: Magic Button */}
          <div className="p-12 flex flex-col items-center gap-8">
            <h2 className="text-xl font-semibold text-gray-300">Mint Button</h2>

            {/* Button Display */}
            <div className="bg-gray-900 rounded-lg p-8 flex items-center justify-center min-h-64">
              <MagicButton
                onClick={handleMint}
                isLoading={state === 'loading'}
                variant="simple"
                color="turquoise"
                size="lg"
                showAnimation
              />
            </div>

            {/* Controls */}
            <div className="flex gap-4 w-full">
              <button
                onClick={handleReset}
                disabled={state === 'loading'}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                onClick={handleMint}
                disabled={state === 'loading' || state === 'success'}
                className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state === 'loading' ? 'Minting...' : 'Test Mint Flow'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">📊 Integration Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-semibold">Animation</p>
              <p className="text-cyan-400">WELCOME-COMPLETE-MBLUR.webm</p>
              <p className="text-gray-600 text-xs mt-1">939 KB • VP9 • 10-bit</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold">Button</p>
              <p className="text-cyan-400">MagicButtonNew</p>
              <p className="text-gray-600 text-xs mt-1">Turquoise • Large</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold">Flow</p>
              <p className="text-cyan-400">Idle → Loading → Success</p>
              <p className="text-gray-600 text-xs mt-1">~3.8s total duration</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">🚀 Next Steps</h3>
          <ul className="space-y-2 text-blue-200 text-sm">
            <li>✓ Test animation and button on mobile (DevTools)</li>
            <li>✓ Adjust timing if necessary</li>
            <li>✓ Integrate with real smart contract</li>
            <li>✓ Add SUCCESS and ERROR animations</li>
            <li>✓ Deploy to production</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
