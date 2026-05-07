/**
 * IPFS Gateway Helper
 * 
 * Provides a function to build IPFS URLs with automatic gateway fallback
 * Priority: Cloudflare (fastest) → Dedicated Pinata → Public Pinata → IPFS.io
 */

export const IPFS_GATEWAYS = [
  'https://orange-eager-slug-339.mypinata.cloud/ipfs/', // Dedicated Pinata (primary) ✅
  'https://ipfs.io/ipfs/', // IPFS.io public ✅
  'https://gateway.pinata.cloud/ipfs/', // Public Pinata (backup) ✅
  // 'https://cloudflare-ipfs.com/ipfs/', // ❌ DNS broken (13/01/2026)
];

/**
 * Builds an IPFS URL with a CID
 * @param cid - IPFS Content ID (e.g. bafybeiXXX...)
 * @param gatewayIndex - Gateway index to use (for fallback)
 * @returns Full IPFS URL
 */
export function getIPFSUrl(cid: string, gatewayIndex: number = 0): string {
  const gateway = IPFS_GATEWAYS[gatewayIndex] || IPFS_GATEWAYS[0];
  return `${gateway}${cid}`;
}

/**
 * Builds a picture element with multiple gateways for automatic fallback
 * Useful for img/video tags that support fallback
 * @param cid - IPFS Content ID
 * @returns Array of URLs in priority order
 */
export function getIPFSUrlsWithFallback(cid: string): string[] {
  return IPFS_GATEWAYS.map(gateway => `${gateway}${cid}`);
}

/**
 * CIDs conhecidos do projeto
 */
export const KNOWN_CIDs = {
  MFER_ARTWORK: 'bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq', // Correct Mfer video (infinite loop)
  MFER_OLD: 'bafybeidaayca2bccbnvtkwh5x25xniye4etzlyzotxe47fypo6ehwjeiae', // Old video (do not use)
} as const;

export default {
  getIPFSUrl,
  getIPFSUrlsWithFallback,
  KNOWN_CIDs,
  IPFS_GATEWAYS,
};
