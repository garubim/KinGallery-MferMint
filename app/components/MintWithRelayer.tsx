'use client';

import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { parseUnits } from 'viem';
import { useRelayer } from '../hooks/useRelayer';

export default function MintWithRelayer() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { processPayment, isProcessing, error } = useRelayer();
  
  const [amount, setAmount] = useState('1');
  const [paymentId, setPaymentId] = useState('');
  const [txHash, setTxHash] = useState('');
  const [status, setStatus] = useState<'idle' | 'approving' | 'minting' | 'success' | 'error'>('idle');

  const artistContract = process.env.NEXT_PUBLIC_MFERMINT_CONTRACT || '';
  const usdcContract = process.env.NEXT_PUBLIC_USDC_CONTRACT || '';
  const kingalleryContract = process.env.NEXT_PUBLIC_KINGALLERY_CONTRACT || '';

  const handleMint = async () => {
    if (!isConnected || !address) {
      alert('Por favor, conecte sua carteira');
      return;
    }

    if (!paymentId) {
      alert('Por favor, insira um Payment ID único');
      return;
    }

    try {
      setStatus('approving');
      
      // 1. Aprovar USDC para o contrato KinGallery
      if (walletClient) {
        const usdcAmount = parseUnits(amount, 6); // USDC has 6 decimals
        
        const approveTx = await walletClient.writeContract({
          address: usdcContract as `0x${string}`,
          abi: [
            {
              name: 'approve',
              type: 'function',
              stateMutability: 'nonpayable',
              inputs: [
                { name: 'spender', type: 'address' },
                { name: 'amount', type: 'uint256' }
              ],
              outputs: [{ type: 'bool' }]
            }
          ],
          functionName: 'approve',
          args: [kingalleryContract as `0x${string}`, usdcAmount],
        });

        console.log('✅ USDC aprovado:', approveTx);
      }

      // 2. Transferir USDC para o contrato KinGallery
      setStatus('minting');
      if (walletClient) {
        const usdcAmount = parseUnits(amount, 6);
        
        const transferTx = await walletClient.writeContract({
          address: usdcContract as `0x${string}`,
          abi: [
            {
              name: 'transfer',
              type: 'function',
              stateMutability: 'nonpayable',
              inputs: [
                { name: 'to', type: 'address' },
                { name: 'amount', type: 'uint256' }
              ],
              outputs: [{ type: 'bool' }]
            }
          ],
          functionName: 'transfer',
          args: [kingalleryContract as `0x${string}`, usdcAmount],
        });

        console.log('✅ USDC transferido:', transferTx);
      }

      // 3. Chamar o relayer para processar o pagamento
      const result = await processPayment({
        artistContract,
        to: address,
        amount: parseFloat(amount),
        paymentId,
      });

      if (result.success && result.txHash) {
        setTxHash(result.txHash);
        setStatus('success');
        console.log('✅ Mint completo!', result);
      }
    } catch (err) {
      console.error('❌ Erro no mint:', err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Mint com Relayer (USDC)</h2>
      
      {!isConnected ? (
        <p className="text-gray-600">Conecte sua carteira para continuar</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Valor em USDC
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="1.00"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Payment ID (único)
            </label>
            <input
              type="text"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="payment-123"
            />
          </div>

          <button
            onClick={handleMint}
            disabled={isProcessing || status === 'approving' || status === 'minting'}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {status === 'approving' && '⏳ Aprovando USDC...'}
            {status === 'minting' && '⏳ Processando mint...'}
            {status === 'idle' && 'Mint NFT'}
            {status === 'success' && '✅ Mint completo!'}
            {status === 'error' && '❌ Erro no mint'}
          </button>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {txHash && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
              <p className="font-semibold">Transação confirmada!</p>
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all"
              >
                Ver no BaseScan →
              </a>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>KinGallery:</strong> {kingalleryContract}</p>
            <p><strong>MferMint:</strong> {artistContract}</p>
            <p><strong>Sua carteira:</strong> {address}</p>
          </div>
        </div>
      )}
    </div>
  );
}
