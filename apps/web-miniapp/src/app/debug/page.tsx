'use client';

import { useEffect, useState } from 'react';
import { getTelegramDiagnostics, waitForTelegramSDK } from '@/lib/telegram';

export default function DebugPage() {
  const [diag, setDiag] = useState<Record<string, string>>({});
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    // Show immediate snapshot
    setDiag(getTelegramDiagnostics());

    // Then wait up to 3 s for SDK and refresh
    waitForTelegramSDK(3000).then(() => {
      setDiag(getTelegramDiagnostics());
      setWaited(true);
    });
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: 'monospace', fontSize: 12, color: '#fff', background: '#0a0e2a', minHeight: '100vh' }}>
      <h2 style={{ color: '#f59e0b', marginBottom: 4, fontSize: 16 }}>Debug — Telegram SDK</h2>
      <p style={{ color: '#475569', marginBottom: 16, fontSize: 11 }}>
        {waited ? 'SDK ожидание завершено (3 с)' : 'Ждём SDK...'}
      </p>

      {Object.entries(diag).map(([k, v]) => (
        <div key={k} style={{ marginBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 }}>
          <div style={{ color: '#94a3b8', marginBottom: 2 }}>{k}</div>
          <div style={{ color: v === 'нет' || v === '0' ? '#ef4444' : '#e2e8f0', wordBreak: 'break-all' }}>{v}</div>
        </div>
      ))}

      <button
        onClick={() => setDiag(getTelegramDiagnostics())}
        style={{ marginTop: 16, background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14 }}
      >
        Обновить
      </button>
    </div>
  );
}
