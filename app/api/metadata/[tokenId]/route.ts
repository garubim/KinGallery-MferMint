import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params;

  // Validar que tokenId é um número válido
  if (!tokenId || isNaN(Number(tokenId))) {
    return Response.json(
      { error: 'Invalid tokenId' },
      { status: 400 }
    );
  }

  const id = parseInt(tokenId);

  const metadata = {
    name: `Mfer-0'-Base #${id}/1000`,
    description:
      "Your mark is recorded. This NFT is entangled with a legacy Ethereum Mfer from the original 2021 collection. Part of the Mfer-0'-Base collection on Base chain.",
    image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kingallery.netlify.app'}/api/generate-image/${id}`,
    external_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kingallery.netlify.app'}/gallery?tokenId=${id}`,
    attributes: [
      {
        trait_type: 'Collection',
        value: "Mfer-0'-Base",
      },
      {
        trait_type: 'Chain',
        value: 'Base (8453)',
      },
      {
        trait_type: 'Edition',
        value: `${id}/1000`,
      },
      {
        trait_type: 'Type',
        value: 'Entangled L1-L2',
      },
      {
        trait_type: 'Artist',
        value: 'Kinwiz.base.eth',
      },
    ],
  };

  return Response.json(metadata, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600', // Cache 1 hora
    },
  });
}
