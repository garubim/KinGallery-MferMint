"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AnimatedTextConfig {
  state: 'idle' | 'hover' | 'press' | 'loading' | 'success' | 'error';
  src?: string; // WebP com alpha channel
  duration?: number; // ms
  delay?: number; // ms
  loop?: boolean;
  enterFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'scale';
  exitTo?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'scale';
}

interface AnimatedTextLayerProps {
  config: AnimatedTextConfig;
  show: boolean;
  onAnimationComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const enterVariants = {
  bottom: { y: 40, opacity: 0 },
  top: { y: -40, opacity: 0 },
  left: { x: -40, opacity: 0 },
  right: { x: 40, opacity: 0 },
  center: { scale: 0.8, opacity: 0 },
  scale: { scale: 0.6, opacity: 0 },
};

const exitVariants = {
  bottom: { y: 40, opacity: 0 },
  top: { y: -40, opacity: 0 },
  left: { x: -40, opacity: 0 },
  right: { x: 40, opacity: 0 },
  center: { scale: 0.8, opacity: 0 },
  scale: { scale: 0.6, opacity: 0 },
};

export default function AnimatedTextLayer({
  config,
  show,
  onAnimationComplete,
  className = '',
  style = {},
}: AnimatedTextLayerProps) {
  const [cycles, setCycles] = useState(0);
  const animationRef = useRef<HTMLDivElement>(null);

  const enterFrom = config.enterFrom || 'scale';
  const exitTo = config.exitTo || 'scale';
  const duration = config.duration || 600;
  const delay = config.delay || 0;

  const animationVariants = {
    enter: {
      ...enterVariants[enterFrom as keyof typeof enterVariants],
      transition: {
        duration: duration / 1000,
        ease: 'easeOut',
        delay: delay / 1000,
      },
    },
    center: {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: duration / 1000,
        ease: 'easeOut',
        delay: delay / 1000,
      },
    },
    exit: {
      ...exitVariants[exitTo as keyof typeof exitVariants],
      transition: {
        duration: duration / 1000,
        ease: 'easeIn',
      },
    },
  };

  // Handle animation loop for WebP frames
  useEffect(() => {
    if (!show || !config.loop) return;

    const timer = setTimeout(() => {
      setCycles((prev) => prev + 1);
    }, duration + delay);

    return () => clearTimeout(timer);
  }, [show, config.loop, duration, delay, cycles]);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          ref={animationRef}
          key={`text-layer-${config.state}-${cycles}`}
          variants={animationVariants}
          initial="enter"
          animate="center"
          exit="exit"
          onAnimationComplete={onAnimationComplete}
          className={className}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            ...style,
          }}
        >
          {config.src && (
            <img
              src={config.src}
              alt={`${config.state} text animation`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                imageRendering: 'crisp-edges',
              }}
              loading="eager"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
