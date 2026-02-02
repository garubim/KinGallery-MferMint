/**
 * Debug endpoint to test NFT metadata accessibility
 * Helps identify IPFS and OpenSea integration issues
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kingallery.netlify.app';

  if (!tokenId || isNaN(Number(tokenId))) {
    return NextResponse.json(
      { error: 'Invalid tokenId' },
      { status: 400 }
    );
  }

  const id = parseInt(tokenId);

  try {
    // Test our own metadata endpoint
    const metadataResponse = await fetch(`${baseUrl}/api/metadata/${id}`);
    const metadata = metadataResponse.ok ? await metadataResponse.json() : null;

    // Test image endpoint
    const imageResponse = await fetch(`${baseUrl}/api/generate-image/${id}`, { method: 'HEAD' });
    
    // Test IPFS directly
    const ipfsResponse = await fetch('https://gateway.pinata.cloud/ipfs/bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq', { method: 'HEAD' });

    const debug = {
      tokenId: id,
      timestamp: new Date().toISOString(),
      tests: {
        metadata: {
          url: `${baseUrl}/api/metadata/${id}`,
          status: metadataResponse.status,
          ok: metadataResponse.ok,
          data: metadata
        },
        image: {
          url: `${baseUrl}/api/generate-image/${id}`,
          status: imageResponse.status,
          ok: imageResponse.ok,
          redirectLocation: imageResponse.headers.get('location')
        },
        ipfs: {
          url: 'https://gateway.pinata.cloud/ipfs/bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq',
          status: ipfsResponse.status,
          ok: ipfsResponse.ok,
          contentType: ipfsResponse.headers.get('content-type')
        }
      },
      opensea: {
        metadataUrl: `${baseUrl}/api/metadata/${id}`,
        imageUrl: `${baseUrl}/api/generate-image/${id}`,
        expectedImageUrl: metadata?.image,
        contractAddress: '0xb222e11864A2050bd19e2Df6648CfbB971f28325',
        tokenStandard: 'ERC-721'
      }
    };

    return NextResponse.json(debug, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Debug test failed', details: String(error) },
      { status: 500 }
    );
  }
}