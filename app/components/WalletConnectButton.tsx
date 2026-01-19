'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export default function WalletConnectButton({ className = '' }: { className?: string }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const walletConnectConnector = connectors.find(c => c.id === 'walletConnect');

  const handleConnect = () => {
    if (walletConnectConnector) {
      connect({ connector: walletConnectConnector });
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <button
      onClick={isConnected ? handleDisconnect : handleConnect}
      disabled={isPending}
      className={className}
    >
      {isPending ? 'Connecting...' : isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
    </button>
  );
}
