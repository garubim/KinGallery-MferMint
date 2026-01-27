'use client';

import { useAutoSignOnConnect } from '@/app/hooks/useAutoSignOnConnect';

/**
 * Componente invisível que gerencia a assinatura automática ao conectar wallet
 * Renderizado dentro do RootProvider para estar sempre disponível
 */
export function SignatureManager() {
  useAutoSignOnConnect();
  return null;
}
