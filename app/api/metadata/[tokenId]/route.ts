export async function GET(
  request: Request,
  { params }: { params: { tokenId: string } }
) {
  const { tokenId } = params;

  // Validar que tokenId é um número válido
  if (!tokenId || isNaN(Number(tokenId))) {
    return Response.json(
      { error: 'Invalid tokenId' },
      { status: 400 }
    );
  }

  const metadata = {
    name: `MferBk0 #${tokenId}`,
    description:
      "This is not art; it's a ritual! A perpetual motion mood ring for the entire cryptosphere.",
    image: 'ipfs://bafybeiaevaflz35fjr4qhrrcaejbxqiie5v3itvgqmabtstwbpfe7vlodq',
    attributes: [
      {
        trait_type: 'Collection',
        value: 'MferBk0-Base',
      },
      {
        trait_type: 'Chain',
        value: 'Base',
      },
      {
        trait_type: 'Edition',
        value: tokenId,
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
