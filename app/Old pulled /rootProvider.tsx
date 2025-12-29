'use client';

import { useEffect } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base, sepolia } from 'viem/chains';
import { createConfig, http } from 'wagmi';
import { coinbaseWallet, walletConnect } from '@wagmi/connectors';

const baseRpc = process.env.NEXT_PUBLIC_BASE_RPC || process.env.NEXT_PUBLIC_BASE_MAIN_RPC || '';
const sepoliaRpc = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || process.env.NEXT_PUBLIC_SEPOLIA_RPC || '';

const chains = sepoliaRpc ? ([base, sepolia] as const) : ([base] as const);

const transports: Record<number, any> = {};
if (baseRpc) transports[base.id] = http(baseRpc);
else transports[base.id] = http();
if (sepoliaRpc) transports[sepolia.id] = http(sepoliaRpc);

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
const _coinbaseOpts: any = { chains, options: { appName: 'Whaaaaa' } };
const _wcOpts: any = { chains, options: { projectId: walletConnectProjectId } };
const connectors = [
  coinbaseWallet(_coinbaseOpts) as any,
  // Only include WalletConnect if a valid project id is configured to avoid runtime errors
  ...(walletConnectProjectId ? [walletConnect(_wcOpts) as any] : []),
];

const config = createConfig({
  chains,
  transports,
  connectors: connectors.filter(Boolean) as any,
});

const queryClient = new QueryClient();

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Re-enable Farcaster miniapp SDK ready() so Farcaster hosts (miniapp) can integrate cleanly.
  // We keep OnchainKit as the primary manager but allow Farcaster hosts to signal readiness.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('@farcaster/miniapp-sdk');
        if (!mounted) return;
        try {
          if (mod?.sdk?.actions?.ready) {
            mod.sdk.actions.ready();
          }
        } catch (e) {
          // ignore sdk errors
          // eslint-disable-next-line no-console
          console.debug('farcaster sdk ready() failed', e);
        }
      } catch (e) {
        // module not available or failed to load — ignore
      }
    })();
    return () => { mounted = false; };
  }, []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            // Neutral modal: let the manager/presenter show all available wallets without explicit preference
            wallet: { display: 'modal', preference: 'all' },
            appearance: { name: 'Whaaaaa', mode: 'auto', theme: 'default' },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
