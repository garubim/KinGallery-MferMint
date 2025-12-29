// Local Farcaster plugin: centraliza a obtenção do provider do host
export async function getFarcasterProvider(): Promise<any | null> {
  // try SDK first
  try {
    // dynamic import so it doesn't break SSR
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = await import('@farcaster/miniapp-sdk');
    if (mod?.sdk?.wallet?.getEthereumProvider) {
      try {
        const prov = await mod.sdk.wallet.getEthereumProvider();
        if (prov) return prov;
      } catch (e) {
        // continue to heuristics
      }
    }
  } catch (e) {
    // SDK not available — continue to heuristics
  }

  // Host heuristics: eip-6963 / window.parent postMessage / global host objects
  try {
    // @ts-ignore
    if (typeof (globalThis as any).miniAppHost?.getEthereumProvider === 'function') {
      // @ts-ignore
      return await (globalThis as any).miniAppHost.getEthereumProvider();
    }
  } catch (e) {}

  try {
    // eip-6963 style
    // @ts-ignore
    if (typeof (globalThis as any).eip6963RequestProvider === 'function') {
      // @ts-ignore
      return await (globalThis as any).eip6963RequestProvider();
    }
  } catch (e) {}

  // Try window.parent postMessage request — some hosts respond with provider via message
  try {
    return await new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), 1500);
      function handler(event: MessageEvent) {
        if (!event.data) return;
        if (event.data?.type === 'FarcasterFrameEthProviderResponse' && event.data.provider) {
          window.removeEventListener('message', handler);
          clearTimeout(timeout);
          resolve(event.data.provider);
        }
      }
      window.addEventListener('message', handler);
      try {
        window.parent.postMessage({ type: 'FarcasterFrameEthProviderRequest' }, '*');
      } catch (e) {
        window.removeEventListener('message', handler);
        clearTimeout(timeout);
        resolve(null);
      }
    });
  } catch (e) {
    // fallback
  }

  return null;
}

export async function ensureWindowEthereum(): Promise<any | null> {
  const prov = await getFarcasterProvider();
  if (!prov) return null;
  // If provider is an EIP-1193 style provider, assign to window.ethereum
  try {
    // @ts-ignore
    if (!globalThis.window?.ethereum) {
      // @ts-ignore
      globalThis.window.ethereum = prov;
    }
  } catch (e) {
    // ignore assignment errors
  }
  return prov;
}

export default {
  getFarcasterProvider,
  ensureWindowEthereum,
};
