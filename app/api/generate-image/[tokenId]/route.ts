/**
 * API route para gerar/servir imagem de NFT dinamicamente
 * Redireciona para o artwork IPFS ou gera uma imagem com dados do token
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params;

  // Validar tokenId
  if (!tokenId || isNaN(Number(tokenId))) {
    return NextResponse.json(
      { error: 'Invalid tokenId' },
      { status: 400 }
    );
  }

  const id = parseInt(tokenId);

  // Calculate entangled Ethereum Mfer ID (same logic as metadata)
  const calculateEthMferId = (tokenIdNum: number): number => {
    const hash = (tokenIdNum * 1337 + 42) % 10000;
    return hash === 0 ? 1 : hash;
  };

  const ethMferId = calculateEthMferId(id);

  // Use Pinata gateway for better reliability
  const artworkUrl = `https://gateway.pinata.cloud/ipfs/bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq?token=${id}&entangled=${ethMferId}`;

  // Add proper headers for NFT marketplaces
  const response = NextResponse.redirect(artworkUrl, {
    status: 307, // Temporary redirect
  });
  
  // Add cache headers for better performance on OpenSea
  response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  response.headers.set('Vary', 'Accept');
  
  return response;
}
