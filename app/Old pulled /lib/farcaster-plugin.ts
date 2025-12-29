// Centraliza integração com @farcaster/miniapp-sdk e heurísticas de host
let _mod: any = null;

async function initSdk() {
  if (_mod) return _mod;
  try {
    _mod = await import('@farcaster/miniapp-sdk');
    if (_mod?.sdk?.actions?.ready) {
      try { _mod.sdk.actions.ready(); } catch (e) { /* ignore */ }
    }
    return _mod;
  } catch (e) {
    _mod = null;
    return null;
  }
}

export async function getFarcasterProvider(): Promise<any | null> {
  // Try SDK first
  try {
    const mod = await initSdk();
    const provider = mod?.sdk?.wallet?.getEthereumProvider?.();
    if (provider) return provider;
  } catch (e) {
    // ignore
  }

  // Host heuristics
  try {
    const host = (globalThis as any).miniAppHost || (globalThis as any).Farcaster?.miniAppHost || (window as any).miniAppHost;
    if (!host) return null;
    if (typeof host.getEthereumProvider === 'function') return await host.getEthereumProvider();
    if (typeof host.eip6963RequestProvider === 'function') return await host.eip6963RequestProvider();
    if (typeof host.ethProviderRequestV2 === 'function') {
      try {
        await host.ethProviderRequestV2({ method: 'eth_requestAccounts', params: [] });
        // some hosts return provider via a global after request
        const maybe = (globalThis as any).ethereum || (window as any).ethereum;
        return maybe || null;
      } catch (e) {
        return null;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

export async function requestFarcasterProvider(): Promise<any | null> {
  // Try SDK-high-level request if available
  try {
    const mod = await initSdk();
    if (mod?.sdk?.wallet?.getEthereumProvider) {
      const provider = await mod.sdk.wallet.getEthereumProvider();
      if (provider) return provider;
    }
  } catch (e) {
    // ignore
  }

  // Try host methods to request provider
  try {
    const host = (globalThis as any).miniAppHost || (globalThis as any).Farcaster?.miniAppHost || (window as any).miniAppHost;
    if (!host) return null;
    if (typeof host.eip6963RequestProvider === 'function') {
      await host.eip6963RequestProvider();
      return (globalThis as any).ethereum || (window as any).ethereum || null;
    }
    if (typeof host.getEthereumProvider === 'function') {
      await host.getEthereumProvider();
      return (globalThis as any).ethereum || (window as any).ethereum || null;
    }
    if (typeof host.ethProviderRequestV2 === 'function') {
      await host.ethProviderRequestV2({ method: 'eth_requestAccounts', params: [] });
      return (globalThis as any).ethereum || (window as any).ethereum || null;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export function attachProviderToWindow(provider: any) {
  try {
    if (!provider) return;
    (window as any).ethereum = provider;
  } catch (e) {
    // ignore
  }
}

export { initSdk };
