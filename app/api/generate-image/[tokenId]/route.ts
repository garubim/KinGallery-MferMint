/**
 * API route to dynamically generate/serve NFT images
 * Redirects to the artwork IPFS or generates an image with token data
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

  // For now, returns the artwork image (can be customized later)
  // This is the animated image of Mfer-0-Base
  const artworkUrl = 'https://ipfs.io/ipfs/bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq';

  // Redirect to the image
  return NextResponse.redirect(artworkUrl, {
    status: 307, // Temporary redirect
  });
}
