'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { base } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000, // Cache 30s
      gcTime: 5 * 60_000, // Garbage collect após 5min
    },
  },
});

// Debug: Log wallet connection events
if (typeof window !== 'undefined') {
  console.log('🔐 RootProvider: Wallet configuration initialized');
  console.log('✓ Connector: coinbaseWallet with smartWalletOnly preference');
  console.log('ℹ️ Environment:', process.env.NODE_ENV);
  console.log('ℹ️ OnchainKit API Key configured:', !!process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY);
}

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'KinGallery',
      // EOA: oferece opção de carteiras non-custodial
    }),
    coinbaseWallet({
      appName: 'KinGallery',
      preference: 'smartWalletOnly', // Smart Account ONLY via Passkey/Biometria
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '44788a3961a4e5fa217c4ddb6ae62da8',
      showQrModal: true,
    }),
    injected({
      shimDisconnect: true,
      unstable_shimAsyncInject: 1_000,
    }),
  ],
  multiInjectedProviderDiscovery: true,
  ssr: false,
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
});

export default function RootProvider({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'QUICKSTART_API_KEY';

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={apiKey}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
