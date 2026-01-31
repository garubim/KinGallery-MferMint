'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function MagicButtonDesignPage() {
  const [selectedColor, setSelectedColor] = useState<'blue' | 'turquoise' | 'orange' | 'salmon'>('turquoise');

  const colors = {
    blue: {
      gradient: 'from-blue-600 to-blue-400',
      bg: 'bg-blue-500',
      hex: '#3B82F6',
      name: 'Azul',
    },
    turquoise: {
      gradient: 'from-cyan-500 to-teal-400',
      bg: 'bg-cyan-400',
      hex: '#06B6D4',
      name: 'Turquesa',
    },
    orange: {
      gradient: 'from-orange-500 to-amber-400',
      bg: 'bg-orange-500',
      hex: '#F97316',
      name: 'Laranja',
    },
    salmon: {
      gradient: 'from-pink-400 to-rose-300',
      bg: 'bg-pink-400',
      hex: '#F472B6',
      name: 'Manga-Salmão',
    },
  };

  const color = colors[selectedColor];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">🎨 Magic Button Design System</h1>
          <p className="text-gray-600">Novo botão inspirado em seus designs, com cores vibrantes</p>
        </div>

        {/* Color Selector */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Escolha a Cor</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(colors).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelectedColor(key as any)}
                className={`p-6 rounded-lg transition transform hover:scale-105 ${
                  selectedColor === key
                    ? `${val.bg} text-white ring-4 ring-offset-2`
                    : `${val.bg} opacity-60 hover:opacity-80`
                }`}
              >
                <p className="font-semibold">{val.name}</p>
                <p className="text-sm opacity-90">{val.hex}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Reference Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              <img
                src="/KinGall-MagicVutton-op02.png"
                alt="Button Design 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Versão 1: Minimalista</h3>
              <p className="text-sm text-gray-600">Botão limpo com gotinhas laterais</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              <img
                src="/KinGall-Magic-Titles-op108.png"
                alt="Button Design 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Versão 2: Com Título</h3>
              <p className="text-sm text-gray-600">Integração com animação de boas-vindas</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              <img
                src="/KinGall-MagicVutton-op21.png"
                alt="Button Design 3"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Versão 3: Interativa</h3>
              <p className="text-sm text-gray-600">Estados: ETH / USDC selector</p>
            </div>
          </div>
        </div>

        {/* New Magic Button Mockup */}
        <div className="bg-white rounded-lg shadow-lg p-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Nova Magic Button</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Version 1: Simple */}
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Versão 1: Simples</h3>
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${color.gradient} shadow-2xl flex items-center justify-center transform transition hover:scale-110 cursor-pointer`}>
                <span className="text-white font-bold text-center px-4">
                  <div className="text-3xl mb-2">✨</div>
                  <div className="text-sm">MINT NOW</div>
                </span>
              </div>
              <p className="text-sm text-gray-600 text-center max-w-sm">
                Botão circular puro. Sem gotinhas. Clean e moderno.
              </p>
            </div>

            {/* Version 2: With Droplets */}
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Versão 2: Com Seletores</h3>
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Main Button */}
                <div className={`absolute w-32 h-32 rounded-full bg-gradient-to-br ${color.gradient} shadow-2xl flex items-center justify-center transform transition hover:scale-110 cursor-pointer z-10`}>
                  <span className="text-white font-bold text-center">
                    <div className="text-2xl mb-1">✨</div>
                    <div className="text-xs">MINT</div>
                  </span>
                </div>

                {/* ETH Droplet - Left */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-blue-400 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition text-white font-bold">
                  Ξ
                </div>

                {/* USDC Droplet - Right */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-blue-600 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition text-white font-bold">
                  $
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center max-w-sm">
                Botão central com seletores de moeda (ETH/USDC) nos lados.
              </p>
            </div>

            {/* Version 3: Wide */}
            <div className="flex flex-col items-center space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700">Versão 3: Pill Shape (Alternativa)</h3>
              <div className={`px-12 py-6 rounded-full bg-gradient-to-r ${color.gradient} shadow-2xl flex items-center justify-center transform transition hover:scale-105 cursor-pointer max-w-md w-full`}>
                <span className="text-white font-bold text-lg flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <span>MINT YOUR NFT</span>
                  <span className="text-2xl">✨</span>
                </span>
              </div>
              <p className="text-sm text-gray-600 text-center max-w-2xl">
                Formato alongado. Melhor para layouts desktop/mobile. Mais espaço pro texto animado.
              </p>
            </div>
          </div>

          {/* Color Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Color</h3>
            <div className={`p-8 rounded-lg bg-gradient-to-br ${color.gradient} text-white`}>
              <p className="text-2xl font-bold mb-2">{color.name}</p>
              <p className="text-lg opacity-90">{color.hex}</p>
              <p className="text-sm mt-4 opacity-75">
                This is the color used across buttons, backgrounds and interactive elements.
              </p>
            </div>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📝 Next Steps</h3>
          <ul className="space-y-2 text-blue-800">
            <li>✓ Create React MagicButton component with 3 variants</li>
            <li>✓ Integrate Welcome animation (WELCOME-COMPLETE-MBLUR.webm)</li>
            <li>✓ Implement ETH/USDC selectors (v2)</li>
            <li>✓ Test responsiveness on mobile</li>
            <li>✓ Connect to smart contract</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
