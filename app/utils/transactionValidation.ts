/**
 * Validações críticas de transação para MagicMintButton
 * Implementa TransactionState completo e error handling robusto
 */

export type TransactionState = 
  | {
      status: 'idle';
    }
  | {
      status: 'pending';
      hash: string;
      estimatedGas?: string;
    }
  | {
      status: 'success';
      hash: string;
      blockNumber?: number;
      timestamp?: number;
    }
  | {
      status: 'error';
      hash?: string;
      error: Error;
      errorCode?: string;
      isRetryable: boolean;
    };

/**
 * Mapeia erros comuns de transação para mensagens amigáveis
 */
export function mapTransactionError(error: any): {
  message: string;
  isRetryable: boolean;
  code: string;
} {
  const errorMsg = error?.message || error?.reason || 'Erro desconhecido';
  
  // User rejections
  if (
    errorMsg.includes('User rejected') || 
    errorMsg.includes('user rejected') ||
    errorMsg.includes('User denied')
  ) {
    return {
      message: '❌ Você rejeitou a transação na wallet. Tente novamente!',
      isRetryable: true,
      code: 'USER_REJECTED',
    };
  }
  
  // Insufficient funds
  if (errorMsg.includes('insufficient funds') || errorMsg.includes('insufficient balance')) {
    return {
      message: '❌ Saldo insuficiente para pagar o gas. Adicione mais ETH na Base!',
      isRetryable: false,
      code: 'INSUFFICIENT_FUNDS',
    };
  }
  
  // Execution reverted
  if (errorMsg.includes('execution reverted')) {
    return {
      message: '❌ Transação reverteu no contrato. Verifique se está tudo certo e tente novamente.',
      isRetryable: true,
      code: 'EXECUTION_REVERTED',
    };
  }
  
  // Contract configuration errors
  if (errorMsg.includes('Only gallery') || errorMsg.includes('Gallery payee not set')) {
    return {
      message: '❌ Erro: Contrato não está configurado corretamente. Contate o suporte.',
      isRetryable: false,
      code: 'CONTRACT_CONFIG_ERROR',
    };
  }
  
  // Network errors
  if (
    errorMsg.includes('network') || 
    errorMsg.includes('RPC') ||
    errorMsg.includes('ECONNREFUSED')
  ) {
    return {
      message: '⚠️ Erro de conexão de rede. Verifique sua internet e tente novamente.',
      isRetryable: true,
      code: 'NETWORK_ERROR',
    };
  }
  
  // Nonce errors (usually retryable with wait)
  if (errorMsg.includes('nonce') || errorMsg.includes('pending transaction')) {
    return {
      message: '⏳ Transação anterior ainda está processando. Aguarde alguns segundos.',
      isRetryable: true,
      code: 'NONCE_ERROR',
    };
  }
  
  // Out of gas
  if (errorMsg.includes('out of gas') || errorMsg.includes('exceeds gas')) {
    return {
      message: '⛽ Gas insuficiente. Aumente o limite de gas na sua wallet.',
      isRetryable: true,
      code: 'OUT_OF_GAS',
    };
  }
  
  // Timeout (network issue)
  if (errorMsg.includes('timeout') || errorMsg.includes('time out')) {
    return {
      message: '⏱️ Timeout da transação. Sua wallet pode estar lenta. Tente novamente.',
      isRetryable: true,
      code: 'TIMEOUT',
    };
  }
  
  // Default: tratamos como retryable por segurança
  return {
    message: `❌ Erro: ${errorMsg.substring(0, 100)}... Tente novamente.`,
    isRetryable: true,
    code: 'UNKNOWN_ERROR',
  };
}

/**
 * Valida se a transação é segura para enviar
 */
export function validateTransactionInput(input: {
  to: string;
  value: bigint;
  data: string;
  chainId: number;
}): { valid: boolean; error?: string } {
  // Validar endereço
  if (!input.to || !input.to.startsWith('0x') || input.to.length !== 42) {
    return { valid: false, error: 'Endereço do contrato inválido' };
  }

  // Validar value
  if (input.value < BigInt(0)) {
    return { valid: false, error: 'Valor não pode ser negativo' };
  }

  // Validar data (call data não pode estar vazio para função payAndMint)
  if (!input.data || input.data === '0x') {
    return { valid: false, error: 'Dados da chamada estão vazios' };
  }

  // Validar chainId (deve ser Base = 8453)
  if (input.chainId !== 8453) {
    return { valid: false, error: `Chain incorreta (${input.chainId}). Use Base (8453).` };
  }

  return { valid: true };
}

/**
 * Monitora timeout de transação
 */
export function createTransactionTimeout(seconds: number): AbortSignal {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, seconds * 1000);

  // Limpar timeout quando a transação terminar
  const originalAbort = controller.abort.bind(controller);
  controller.abort = function() {
    clearTimeout(timeoutId);
    return originalAbort();
  };

  return controller.signal;
}
