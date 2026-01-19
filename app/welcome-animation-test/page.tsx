'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function WelcomeAnimationTestPage() {
  const [activeVersion, setActiveVersion] = useState<'webp' | 'webm'>('webp');
  const videoRef1 = useRef<AnimatedWebImageElement>(null);
  const videoRef2 = useRef<AnimatedWebImageElement>(null);

  return (
    <div className="min-h-screen bg-transparent text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">🎬 Welcome Animation Testing</h1>
          <p className="text-gray-400">Compare WebP vs WebM Sequential</p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveVersion('webp')}
            className={`px-6 py-3 rounded font-semibold transition ${
              activeVersion === 'webp'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            WebP Animated (3.5 MB)
          </button>
          <button
            onClick={() => setActiveVersion('webm')}
            className={`px-6 py-3 rounded font-semibold transition ${
              activeVersion === 'webm'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            WebM Sequential (566 KB)
          </button>
        </div>

        {/* WebP Display */}
        {activeVersion === 'webp' && (
          <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded">
              <p className="text-sm text-gray-400 mb-2">WebP Animated Single File</p>
              <div className="relative aspect-video bg-black rounded overflow-hidden flex items-center justify-center">
                <img
                  src="/content/MagicButton-OfficialAnimatedTitels/WizButtonAnimatedTitles-official-7-JAN-WebP-animMax.webp"
                  alt="WebP Animation"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">File: 3.5 MB | Format: WebP Animated | Duration: ~5.2s</p>
            </div>
            <div className="bg-blue-900 bg-opacity-30 p-4 rounded border border-blue-600">
              <p className="text-sm font-semibold mb-2">✅ Advantages:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Single file, no sync issues</li>
                <li>• Perfect visual quality</li>
                <li>• No join artifacts</li>
              </ul>
            </div>
            <div className="bg-red-900 bg-opacity-30 p-4 rounded border border-red-600">
              <p className="text-sm font-semibold mb-2">❌ Disadvantages:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Large file size (3.5 MB)</li>
                <li>• Slow on mobile (6-15s on 3G)</li>
                <li>• High bandwidth usage</li>
              </ul>
            </div>
          </div>
        )}

        {/* WebM Display */}
        {activeVersion === 'webm' && (
          <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded">
              <p className="text-sm text-gray-400 mb-2">WebM Sequential - Part 1</p>
              <div className="relative aspect-video bg-black rounded overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef1}
                  autoPlay
                  loop
                  muted
                  className="max-w-full max-h-full object-contain"
                  onEnded={() => {
                    // When part 1 ends, this could trigger part 2
                    if (videoRef2.current) {
                      videoRef2.current.play();
                    }
                  }}
                >
                  <source
                    src="/content/MagicButton-OfficialAnimatedTitels/MAGIC-BUTTON-TITLES-1ST-PART-01of02-WELCOME-PRORES-4444-HQ.webm"
                    type="video/webm"
                  />
                </video>
              </div>
              <p className="text-xs text-gray-500 mt-2">File: 283 KB | Format: WebM VP9 | Duration: ~2.6s</p>
            </div>

            <div className="bg-gray-900 p-4 rounded">
              <p className="text-sm text-gray-400 mb-2">WebM Sequential - Part 2 (⚠️ Watch Join Point!)</p>
              <div className="relative aspect-video bg-black rounded overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef2}
                  autoPlay
                  loop
                  muted
                  className="max-w-full max-h-full object-contain"
                >
                  <source
                    src="/content/MagicButton-OfficialAnimatedTitels/MAGIC-BUTTON-TITLES-1ST-PART-02of02-WELCOME-PRORES-4444-HQ.webm"
                    type="video/webm"
                  />
                </video>
              </div>
              <p className="text-xs text-gray-500 mt-2">File: 283 KB | Format: WebM VP9 | Duration: ~2.6s</p>
            </div>

            <div className="bg-yellow-900 bg-opacity-40 p-4 rounded border border-yellow-600">
              <p className="text-sm font-semibold mb-2">👁️ CRITICAL TEST:</p>
              <p className="text-sm text-gray-300">
                Watch very carefully when Part 1 ends and Part 2 begins. Look for:
              </p>
              <ul className="text-sm text-gray-300 space-y-1 mt-2">
                <li>• ❌ Fade/darkening?</li>
                <li>• ❌ Image jump or jitter?</li>
                <li>• ❌ Delay or stutter?</li>
                <li>• ✅ Smooth seamless transition?</li>
              </ul>
            </div>

            <div className="bg-green-900 bg-opacity-30 p-4 rounded border border-green-600">
              <p className="text-sm font-semibold mb-2">✅ Advantages:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Small file size (566 KB total = 84% savings!)</li>
                <li>• Fast on mobile (loads in 300-500ms)</li>
                <li>• Excellent quality (VP9 codec)</li>
                <li>• Low bandwidth usage</li>
              </ul>
            </div>

            <div className="bg-orange-900 bg-opacity-30 p-4 rounded border border-orange-600">
              <p className="text-sm font-semibold mb-2">⚠️ Concerns:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Join point synchronization (THIS IS THE TEST!)</li>
                <li>• Need JavaScript to chain Part 1 → Part 2</li>
                <li>• Must test on slow networks</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Test on Slow 4G (DevTools → Network) to see the real difference.
            <br />
            Pay special attention to the WebM join point!
          </p>
        </div>
      </div>
    </div>
  );
}
