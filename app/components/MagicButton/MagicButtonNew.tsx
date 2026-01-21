'use client';

import React, { useState } from 'react';

interface MagicButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  variant?: 'simple' | 'with-droplets' | 'pill';
  color?: 'blue' | 'turquoise' | 'orange' | 'salmon';
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}

const colorConfig = {
  blue: 'from-blue-600 to-blue-400',
  turquoise: 'from-cyan-500 to-teal-400',
  orange: 'from-orange-500 to-amber-400',
  salmon: 'from-pink-400 to-rose-300',
};

const sizeConfig = {
  sm: { main: 'w-24 h-24', icon: 'text-lg' },
  md: { main: 'w-32 h-32', icon: 'text-3xl' },
  lg: { main: 'w-40 h-40', icon: 'text-5xl' },
};

export default function MagicButton({
  onClick,
  isLoading = false,
  variant = 'simple',
  color = 'turquoise',
  size = 'md',
  showAnimation = true,
}: MagicButtonProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'eth' | 'usdc'>('eth');
  const [isHovered, setIsHovered] = useState(false);

  const gradient = colorConfig[color];
  const dims = sizeConfig[size];

  // Versão 1: Simples
  if (variant === 'simple') {
    return (
      <button
        onClick={onClick}
        disabled={isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${dims.main} rounded-full bg-gradient-to-br ${gradient} shadow-2xl flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 relative overflow-hidden`}
      >
        <div className="flex flex-col items-center gap-1 relative z-10">
          <div className={`${dims.icon} ${isLoading ? 'animate-spin' : ''}`}>
            {isLoading ? '⏳' : '✨'}
          </div>
          <div className="text-xs font-semibold">
            {isLoading ? 'MINTING...' : 'MINT NOW'}
          </div>
        </div>
      </button>
    );
  }

  // Versão 2: Com seletores ETH/USDC
  if (variant === 'with-droplets') {
    return (
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Main Button */}
        <button
          onClick={onClick}
          disabled={isLoading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            absolute w-40 h-40
            rounded-full
            bg-gradient-to-br ${gradient}
            shadow-2xl
            flex items-center justify-center
            text-white font-bold
            transition-all duration-300
            hover:scale-110
            active:scale-95
            disabled:opacity-50
            z-10
            overflow-hidden
          `}
        >
          <div className="flex flex-col items-center gap-1 relative z-10">
            <div className="text-3xl">{isLoading ? '⏳' : '✨'}</div>
            <div className="text-xs font-semibold">MINT</div>
          </div>
        </button>

        {/* ETH Droplet - Left */}
        <button
          onClick={() => {
            setSelectedCurrency('eth');
            onClick?.();
          }}
          className={`
            absolute left-0 top-1/2 transform -translate-y-1/2
            w-14 h-14
            rounded-full
            shadow-lg
            flex items-center justify-center
            cursor-pointer
            transition-all
            font-bold text-lg
            z-20
            hover:scale-115
            active:scale-90
            ${
              selectedCurrency === 'eth'
                ? 'bg-blue-400 text-white ring-4 ring-white'
                : 'bg-blue-300 text-blue-900 hover:bg-blue-400'
            }
          `}
        >
          Ξ
        </button>

        {/* USDC Droplet - Right */}
        <button
          onClick={() => {
            setSelectedCurrency('usdc');
            onClick?.();
          }}
          className={`
            absolute right-0 top-1/2 transform -translate-y-1/2
            w-14 h-14
            rounded-full
            shadow-lg
            flex items-center justify-center
            cursor-pointer
            transition-all
            font-bold text-lg
            z-20
            hover:scale-115
            active:scale-90
            ${
              selectedCurrency === 'usdc'
                ? 'bg-blue-600 text-white ring-4 ring-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }
          `}
        >
          $
        </button>

        {/* Selected currency label */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700 whitespace-nowrap">
          {selectedCurrency === 'eth' ? 'Ethereum' : 'USDC'}
        </div>
      </div>
    );
  }

  // Versão 3: Pill Shape
  if (variant === 'pill') {
    return (
      <motion.button
        onClick={onClick}
        disabled={isLoading}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
       button
        onClick={onClick}
        disabled={isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          px-12 py-6
          rounded-full
          bg-gradient-to-r ${gradient}
          shadow-2xl
          flex items-center justify-center gap-4
          text-white font-bold text-lg
          transition-all duration-300
          hover:scale-105
          active:scale-95
          disabled:opacity-50
          relative
          overflow-hidden
        `}
      >
        <span className="text-2xl relative z-10">
          {isLoading ? '⏳' : '✨'}
        </span>
        <span className="relative z-10">
          {isLoading ? 'MINTING NFT...' : 'MINT YOUR NFT'}
        </span>
        <span className="text-2xl relative z-10">
          {isLoading ? '⏳' : '✨'}
        </span>
      </