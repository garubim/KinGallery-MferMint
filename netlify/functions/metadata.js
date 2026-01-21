export default async (req) => {
  try {
    // Pega o tokenId da URL: /api/metadata?id=1
    const url = new URL(req.url);
    const tokenId = url.searchParams.get('id');

    // Validação
    if (!tokenId || isNaN(Number(tokenId))) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid tokenId' }),
      };
    }

    // Metadata dinâmica
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
      body: JSON.stringify(metadata),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
