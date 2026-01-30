'use client';

import { useAutoSignOnConnect } from '@/app/hooks/useAutoSignOnConnect';

/**
 * Invisible component that manages automatic signing on wallet connect
 * Rendered inside the RootProvider so it's always available
 */
export function SignatureManager() {
  useAutoSignOnConnect();
  return null;
}
