'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';

const MANIFEST_URL = typeof window !== 'undefined'
  ? `${window.location.origin}/tonconnect-manifest.json`
  : 'https://nero-academy.app/tonconnect-manifest.json';

export function TonProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      {children}
    </TonConnectUIProvider>
  );
}
