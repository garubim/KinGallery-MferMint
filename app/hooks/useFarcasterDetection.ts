'use client';

import { useState, useEffect } from 'react';

/**
 * 🔍 Farcaster Environment Detection Hook
 * 
 * Detects if the app is running inside Farcaster frame context
 * Used for conditional rendering between web and Farcaster environments
 */
export const useFarcasterDetection = () => {
  const [isFarcaster, setIsFarcaster] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkFarcaster = async () => {
      try {
        // Method 1: Check for Farcaster SDK availability
        const { sdk } = await import('@farcaster/miniapp-sdk');
        
        if (sdk && sdk.wallet) {
          console.log('🔍 Farcaster SDK detected');
          setIsFarcaster(true);
          return true;
        }
        
        // Method 2: Check for Farcaster-specific window properties
        if (typeof window !== 'undefined') {
          // Check for Farcaster user agent
          const userAgent = window.navigator.userAgent.toLowerCase();
          if (userAgent.includes('farcaster')) {
            console.log('🔍 Farcaster user agent detected');
            setIsFarcaster(true);
            return true;
          }
          
          // Check for Farcaster frame context
          if (window.parent !== window) {
            // Running in frame - could be Farcaster
            try {
              const parentData = window.parent.postMessage;
              if (parentData) {
                console.log('🔍 Frame context detected - assuming Farcaster');
                setIsFarcaster(true);
                return true;
              }
            } catch (e) {
              // Cross-origin frame - likely Farcaster
              console.log('🔍 Cross-origin frame detected - assuming Farcaster');
              setIsFarcaster(true);
              return true;
            }
          }
        }
        
      } catch (error) {
        console.log('🔍 Not in Farcaster environment:', error.message);
      }
      
      setIsFarcaster(false);
      return false;
    };
    
    checkFarcaster().finally(() => setIsLoading(false));
  }, []);
  
  return { isFarcaster, isLoading };
};

/**
 * 🎯 Farcaster Context Hook
 * 
 * Provides additional Farcaster-specific context and utilities
 */
export const useFarcasterContext = () => {
  const { isFarcaster, isLoading } = useFarcasterDetection();
  const [farcasterUser, setFarcasterUser] = useState(null);
  
  useEffect(() => {
    if (!isFarcaster) return;
    
    const getFarcasterContext = async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        const context = await sdk.context;
        setFarcasterUser(context.user);
        
        console.log('🎭 Farcaster user context:', context.user);
      } catch (error) {
        console.error('❌ Failed to get Farcaster context:', error);
      }
    };
    
    getFarcasterContext();
  }, [isFarcaster]);
  
  return {
    isFarcaster,
    isLoading,
    farcasterUser,
  };
};