/**
 * IPFS Gateway Helper
 * 
 * Fornece função para construir URLs IPFS com fallback automático de gateways
 * Prioridade: Cloudflare (mais rápido) → Pinata dedicado → Pinata público → IPFS.io
 */

export const IPFS_GATEWAYS = [
  'https://orange-eager-slug-339.mypinata.cloud/ipfs/', // Pinata dedicado (principal) ✅
  'https://ipfs.io/ipfs/', // IPFS.io público ✅
  'https://gateway.pinata.cloud/ipfs/', // Pinata público (backup) ✅
  // 'https://cloudflare-ipfs.com/ipfs/', // ❌ DNS broken (13/01/2026)
];

/**
 * Constrói URL IPFS com CID
 * @param cid - Content ID do IPFS (ex: bafybeiXXX...)
 * @param gatewayIndex - Índice do gateway a usar (para fallback)
 * @returns URL completa do IPFS
 */
export function getIPFSUrl(cid: string, gatewayIndex: number = 0): string {
  const gateway = IPFS_GATEWAYS[gatewayIndex] || IPFS_GATEWAYS[0];
  return `${gateway}${cid}`;
}

/**
 * Constrói picture element com múltiplos gateways para fallback automático
 * Útil para img/video tags que suportam fallback
 * @param cid - Content ID do IPFS
 * @returns Array de URLs em ordem de prioridade
 */
export function getIPFSUrlsWithFallback(cid: string): string[] {
  return IPFS_GATEWAYS.map(gateway => `${gateway}${cid}`);
}

/**
 * CIDs conhecidos do projeto
 */
export const KNOWN_CIDs = {
  MFER_ARTWORK: 'bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq', // Vídeo correto do Mfer (loop infinito)
  MFER_OLD: 'bafybeidaayca2bccbnvtkwh5x25xniye4etzlyzotxe47fypo6ehwjeiae', // Vídeo antigo (não usar)
} as const;

export default {
  getIPFSUrl,
  getIPFSUrlsWithFallback,
  KNOWN_CIDs,
  IPFS_GATEWAYS,
};
