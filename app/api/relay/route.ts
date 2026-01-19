import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY!;
const KINGALLERY_ADDRESS = process.env.NEXT_PUBLIC_KINGALLERY_ADDRESS!;
const USDC_ADDRESS = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

const abi = [
  {
    inputs: [
      { internalType: 'address', name: 'artistContract', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'string', name: 'paymentId', type: 'string' },
    ],
    name: 'processPayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export async function POST(request: NextRequest) {
  try {
    if (!RELAYER_PRIVATE_KEY || !KINGALLERY_ADDRESS) {
      return NextResponse.json({ 
        success: false, 
        error: 'Relayer configuration missing (Private Key or Contract Address)' 
      }, { status: 500 });
    }

    const { artistContract, to, amount, paymentId } = await request.json();

    if (!artistContract || !to || !amount || !paymentId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
    const wallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(KINGALLERY_ADDRESS, abi, wallet);

    const tx = await contract.processPayment(artistContract, to, amount, paymentId);
    await tx.wait();

    return NextResponse.json({ success: true, txHash: tx.hash });
  } catch (error: any) {
    console.error('Relay Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}