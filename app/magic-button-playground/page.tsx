'use client';

import { useState } from 'react';
import { MagicButtonNew as MagicButton } from '@/app/components/MagicButton';

export default function MagicButtonPlaygroundPage() {
  const [variant, setVariant] = useState<'simple' | 'with-droplets' | 'pill'>('simple');
  const [color, setColor] = useState<'blue' | 'turquoise' | 'orange' | 'salmon'>('turquoise');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">✨ Magic Button Playground</h1>
          <p className="text-gray-400 text-lg">Explore todas as variações do novo botão</p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-8 mb-12 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Configurações</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Variant Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Variante</label>
              <div className="space-y-2">
                {(['simple', 'with-droplets', 'pill'] as const).map((v) => (
                  <label key={v} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="variant"
                      value={v}
                      checked={variant === v}
                      onChange={(e) => setVariant(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300 capitalize">
                      {v === 'simple' && 'Simples'}
                      {v === 'with-droplets' && 'Com Seletores'}
                      {v === 'pill' && 'Pill Shape'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Cor</label>
              <div className="space-y-2">
                {(['blue', 'turquoise', 'orange', 'salmon'] as const).map((c) => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      value={c}
                      checked={color === c}
                      onChange={(e) => setColor(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300 capitalize">
                      {c === 'blue' && 'Azul'}
                      {c === 'turquoise' && 'Turquesa'}
                      {c === 'orange' && 'Laranja'}
                      {c === 'salmon' && 'Manga-Salmão'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Tamanho</label>
              <div className="space-y-2">
                {(['sm', 'md', 'lg'] as const).map((s) => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      value={s}
                      checked={size === s}
                      onChange={(e) => setSize(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300 uppercase">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-800 rounded-lg p-16 border border-gray-700 flex items-center justify-center min-h-96">
          <MagicButton
            onClick={handleClick}
            isLoading={isLoading}
            variant={variant}
            color={color}
            size={size}
            showAnimation
          />
        </div>

        {/* Code Example */}
        <div className="mt-12 bg-gray-900 rounded-lg p-8 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">📝 Exemplo de Código</h3>
          <pre className="bg-black p-4 rounded overflow-x-auto text-gray-300 text-sm">
            <code>{`import MagicButton from '@/app/components/MagicButton/MagicButtonNew';

export default function MyComponent() {
  return (
    <MagicButton
      variant="${variant}"
      color="${color}"
      size="${size}"
      onClick={() => console.log('Clicked!')}
      showAnimation
    />
  );
}`}</code>
          </pre>
        </div>

        {/* Props Documentation */}
        <div className="mt-12 bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">📚 Props</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-300 font-semibold">variant</p>
              <p className="text-gray-400 text-sm">'simple' | 'with-droplets' | 'pill'</p>
            </div>
            <div>
              <p className="text-gray-300 font-semibold">color</p>
              <p className="text-gray-400 text-sm">'blue' | 'turquoise' | 'orange' | 'salmon'</p>
            </div>
            <div>
              <p className="text-gray-300 font-semibold">size</p>
              <p className="text-gray-400 text-sm">'sm' | 'md' | 'lg'</p>
            </div>
            <div>
              <p className="text-gray-300 font-semibold">isLoading</p>
              <p className="text-gray-400 text-sm">boolean (default: false)</p>
            </div>
            <div>
              <p className="text-gray-300 font-semibold">onClick</p>
              <p className="text-gray-400 text-sm">{`() => void`}</p>
            </div>
            <div>
              <p className="text-gray-300 font-semibold">showAnimation</p>
              <p className="text-gray-400 text-sm">boolean (default: true)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
