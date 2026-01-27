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

  // Por enquanto, retorna a imagem do artwork (você pode customizar depois)
  // Esta é a imagem animada do Mfer-0'-Base
  const artworkUrl = 'https://ipfs.io/ipfs/bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq';

  // Redireciona para a imagem
  return NextResponse.redirect(artworkUrl, {
    status: 307, // Temporary redirect
  });
}
