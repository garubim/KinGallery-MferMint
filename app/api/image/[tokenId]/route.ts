/**
 * Alternative image endpoint for better NFT marketplace compatibility
 * Serves images in multiple formats based on Accept headers
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params;
  const acceptHeader = request.headers.get('accept') || '';

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

  // Choose appropriate IPFS gateway and format based on user agent and accept headers
  let artworkUrl: string;
  
  if (acceptHeader.includes('image/png') || request.headers.get('user-agent')?.includes('OpenSea')) {
    // For OpenSea and PNG requests, use a fallback static image
    // TODO: Create PNG version of the artwork
    artworkUrl = `https://gateway.pinata.cloud/ipfs/bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq`;
  } else {
    // Default to WebP animated
    artworkUrl = `https://gateway.pinata.cloud/ipfs/bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq`;
  }

  console.log(`🖼️  Serving image for token ${id} (entangled with ETH Mfer ${ethMferId})`);
  console.log(`📄 User-Agent: ${request.headers.get('user-agent')?.slice(0, 50)}...`);
  console.log(`🎯 Accept: ${acceptHeader}`);

  const response = NextResponse.redirect(artworkUrl, {
    status: 307,
  });
  
  // NFT marketplace optimized headers
  response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
  response.headers.set('Vary', 'Accept, User-Agent');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}