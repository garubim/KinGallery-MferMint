'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { base } from 'viem/chains';

const queryClient = new QueryClient();

export default function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
        config={{
          wallet: { display: 'modal', preference: 'all' },
          appearance: { name: 'Paymaster App', mode: 'auto', theme: 'default' },
        }}
      >
        {children}
      </OnchainKitProvider>
    </QueryClientProvider>
  );
}
