'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { base } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected, coinbaseWallet } from 'wagmi/connectors';

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

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'KinGallery',
      preference: 'all', // Permite EOA e Smart Wallet
    }),
    coinbaseWallet({
      appName: 'KinGallery',
      preference: 'smartWalletOnly', // Força apenas Smart Wallet
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
