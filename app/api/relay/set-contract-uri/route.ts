import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      proxyAddress,
      coinAddress,
      newURI,
      ownerAddress,
      signature,
      message,
    } = await request.json();

    // Validar campos obrigatórios
    if (!proxyAddress || !coinAddress || !newURI || !ownerAddress || !signature || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    console.log('✅ Request received');
    console.log('  Owner:', ownerAddress);
    console.log('  Message:', message);
    console.log('  Signature:', signature.substring(0, 20) + '...');

    // Chamar seu relayer server local
    const relayerUrl = process.env.RELAYER_SERVER_URL || 'http://localhost:3001';
    
    console.log('📤 Calling relayer:', relayerUrl);
    console.log('  Proxy:', proxyAddress);
    console.log('  Coin:', coinAddress);
    console.log('  New URI:', newURI);
    console.log('  Owner:', ownerAddress);

    const response = await fetch(`${relayerUrl}/set-contract-uri`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proxyAddress,
        coinAddress,
        newURI,
        userAddress: ownerAddress,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Relayer error response:', errorText);
      throw new Error(`Relayer error: ${response.statusText}`);
    }

    const result = await response.json();

    console.log('✅ Transação enviada com sucesso:', result.txHash);

    return NextResponse.json({
      success: true,
      txHash: result.txHash,
      message: 'Transação enviada com sucesso',
    });
  } catch (error) {
    console.error('Relay API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

