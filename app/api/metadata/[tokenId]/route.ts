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
  
  // Calculate entangled Ethereum Mfer ID (same logic as frontend)
  const calculateEthMferId = (tokenIdNum: number): number => {
    // Use tokenId as base for determining eth mfer ID
    // This creates a deterministic but pseudo-random mapping
    const hash = (tokenIdNum * 1337 + 42) % 10000; // Simple hash function
    return hash === 0 ? 1 : hash; // Ensure it's between 1-9999
  };
  
  const ethMferId = calculateEthMferId(id);

  const metadata = {
    name: `Mfer-0'-Base #${id}/1000`,
    description:
      `Your mark is recorded. This NFT is entangled with Ethereum Mfer #${ethMferId} from the original 2021 collection. Part of the Mfer-0'-Base collection on Base chain. Evolution documented, not imitation.`,
    image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kingallery.netlify.app'}/api/generate-image/${id}`,
    external_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kingallery.netlify.app'}/gallery?tokenId=${id}`,
    animation_url: `https://ipfs.io/ipfs/bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq`,
    background_color: "000000",
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
      {
        trait_type: 'Entangled With',
        value: `Ethereum Mfer #${ethMferId}`,
      },
      {
        trait_type: 'Original Chain',
        value: 'Ethereum Mainnet',
      },
      {
        trait_type: 'Evolution Layer',
        value: 'Base',
      },
      {
        trait_type: 'Entanglement Status',
        value: 'Active',
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
