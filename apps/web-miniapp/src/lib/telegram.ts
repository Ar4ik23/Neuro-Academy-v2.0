/**
 * Centralized Telegram WebApp SDK helpers.
 * Safe for SSR — all functions return null/false on the server.
 * Works both in browser (script stub) and Telegram Mini App WebView (native injection).
 */

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: Record<string, unknown>;
  version: string;
  platform: string;
  colorScheme: string;
  isExpanded: boolean;
  viewportHeight: number;
  ready(): void;
  expand(): void;
  close(): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  BackButton: { show(): void; hide(): void; onClick(fn: () => void): void };
  HapticFeedback: { impactOccurred(style: 'light' | 'medium' | 'heavy'): void };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

/** Returns Telegram.WebApp or null (safe for SSR). */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp ?? null;
}

/** Returns initData string (empty string if not in Mini App). */
export function getTelegramInitData(): string {
  return getTelegramWebApp()?.initData ?? '';
}

/**
 * Returns true only when the app is opened inside Telegram as a Mini App
 * (initData is non-empty — populated by Telegram natively).
 */
export function isTelegramMiniApp(): boolean {
  const twa = getTelegramWebApp();
  return !!twa && twa.initData.length > 0;
}

/**
 * Polls until window.Telegram.WebApp is available or timeout expires.
 * Useful for handling race conditions between script load and React mount.
 * Max wait: 3 seconds (covers Next.js hydration + beforeInteractive script).
 */
export function waitForTelegramSDK(maxMs = 3000, intervalMs = 100): Promise<TelegramWebApp | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(null); return; }

    const twa = getTelegramWebApp();
    if (twa) { resolve(twa); return; }

    const start = Date.now();
    const id = setInterval(() => {
      const twa = getTelegramWebApp();
      if (twa) { clearInterval(id); resolve(twa); return; }
      if (Date.now() - start >= maxMs) { clearInterval(id); resolve(null); }
    }, intervalMs);
  });
}

/** Diagnostic snapshot — use in error handling and debug pages. */
export function getTelegramDiagnostics(): Record<string, string> {
  if (typeof window === 'undefined') return { env: 'SSR' };
  const twa = getTelegramWebApp();
  return {
    'window.Telegram':  String(typeof window.Telegram),
    'WebApp':           String(typeof twa),
    'initData.length':  String(twa?.initData?.length ?? 0),
    'version':          twa?.version          ?? '(нет)',
    'platform':         twa?.platform         ?? '(нет)',
    'colorScheme':      twa?.colorScheme      ?? '(нет)',
    'isExpanded':       String(twa?.isExpanded ?? '(нет)'),
    'isMiniApp':        String(isTelegramMiniApp()),
    'auth_token':       localStorage.getItem('auth_token') ? 'есть' : 'нет',
    'url':              window.location.href,
    'userAgent':        navigator.userAgent.slice(0, 100),
  };
}
