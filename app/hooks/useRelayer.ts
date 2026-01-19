// Hook para interagir com o servidor relayer
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface ProcessPaymentParams {
  artistContract: string;
  to: string;
  amount: number;
  paymentId: string;
}

interface ProcessPaymentResponse {
  success: boolean;
  txHash?: string;
  basescanUrl?: string;
  error?: string;
}

export function useRelayer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  const relayerUrl = process.env.NEXT_PUBLIC_RELAYER_URL || 'http://localhost:3000';

  const processPayment = async (params: ProcessPaymentParams): Promise<ProcessPaymentResponse> => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`${relayerUrl}/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process payment');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const checkHealth = async () => {
    try {
      const response = await fetch(`${relayerUrl}/health`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Relayer health check failed:', err);
      return null;
    }
  };

  return {
    processPayment,
    checkHealth,
    isProcessing,
    error,
    relayerUrl,
  };
}
