'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { apiClient } from '@/services/api';

const PRICE_USDT = 49;

interface PaymentModalProps {
  onClose: () => void;
  courseId: string;
}

type Step = 'info' | 'waiting' | 'success' | 'error';

export function PaymentModal({ onClose, courseId }: PaymentModalProps) {
  const [step, setStep] = useState<Step>('info');
  const [mounted, setMounted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const startPolling = () => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await apiClient.get<{ status: string }>(`/payments/status/${courseId}`);
        if (res.data.status === 'completed') {
          clearInterval(pollRef.current!);
          const vip = JSON.parse(localStorage.getItem('na_vip') || '[]');
          if (!vip.includes(courseId)) vip.push(courseId);
          localStorage.setItem('na_vip', JSON.stringify(vip));
          window.dispatchEvent(new Event('vip-status-changed'));
          setStep('success');
        }
      } catch {
        // продолжаем поллинг
      }
    }, 10_000);
  };

  const ensureAuth = async (): Promise<string | null> => {
    const savedToken = localStorage.getItem('auth_token');
    const twa = (window as any).Telegram?.WebApp;
    const initData: string = twa?.initData ?? '';

    if (!initData) {
      return savedToken;
    }

    try {
      const res = await apiClient.post<{ token: string }>('/auth/login', { initData });
      const token = res.data.token;
      localStorage.setItem('auth_token', token);
      return token;
    } catch {
      return savedToken;
    }
  };

  const handlePay = async () => {
    try {
      const token = await ensureAuth();
      if (!token) {
        const twa = (window as any).Telegram?.WebApp;
        const hasTg = !!twa;
        const initDataLen = twa?.initData?.length ?? 0;
        setErrorMsg(`TG SDK: ${hasTg ? 'да' : 'нет'}. initData длина: ${initDataLen}. Версия: ${twa?.version ?? 'нет'}`);
        setStep('error');
        return;
      }

      // Явно ставим токен в заголовок для этого запроса
      const res = await apiClient.post<{ payUrl: string }>(
        `/payments/cryptopay/invoice/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const { payUrl } = res.data;

      // Открываем @CryptoPay через Telegram WebApp или браузер
      const twa = (window as any).Telegram?.WebApp;
      if (twa?.openLink) {
        twa.openLink(payUrl);
      } else {
        window.open(payUrl, '_blank');
      }

      setStep('waiting');
      startPolling();
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message ?? 'Не удалось создать счёт. Попробуй снова.');
      setStep('error');
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-t-3xl flex flex-col"
        style={{
          background: 'rgba(12,16,48,0.98)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderBottom: 'none',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: 40, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        <div className="p-5 flex flex-col gap-4 pb-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black" style={{ color: '#e2e8f0' }}>Оплата курса</h2>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Через @CryptoBot · USDT</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}
            >
              ✕
            </button>
          </div>

          {/* Amount */}
          <div
            className="rounded-2xl p-4 flex items-center justify-between"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.30)' }}
          >
            <div>
              <p className="text-xs" style={{ color: 'rgba(220,228,255,0.55)' }}>Сумма к оплате</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-3xl font-black" style={{ color: '#f59e0b' }}>{PRICE_USDT} USDT</p>
                <p className="text-base line-through" style={{ color: 'rgba(220,228,255,0.30)' }}>149 USDT</p>
              </div>
            </div>
            <div
              className="px-2 py-1 rounded-lg text-xs font-black"
              style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}
            >
              −67%
            </div>
          </div>

          {step === 'info' && (
            <>
              {/* How it works */}
              <div
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Как это работает</p>
                <div className="flex flex-col gap-2">
                  {[
                    { n: '1', text: 'Нажми кнопку ниже — откроется @CryptoBot в Telegram' },
                    { n: '2', text: 'Оплати 49 USDT прямо в боте (любой кошелёк)' },
                    { n: '3', text: 'VIP активируется автоматически — мы пришлём сообщение' },
                  ].map(({ n, text }) => (
                    <div key={n} className="flex gap-3 items-start">
                      <div
                        className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black mt-0.5"
                        style={{ background: 'rgba(245,158,11,0.20)', color: '#f59e0b' }}
                      >
                        {n}
                      </div>
                      <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(220,228,255,0.75)' }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="flex flex-col gap-1.5">
                {[
                  'VIP-доступ навсегда — разовая оплата, без подписки',
                  'Все модули курса без ограничений',
                  'AI-ассистент Nero без ограничений',
                  'Сертификат об окончании',
                  'Поддержка куратора',
                ].map(b => (
                  <div key={b} className="flex gap-2 items-center">
                    <span style={{ color: '#34d399', fontSize: 13 }}>✓</span>
                    <p className="text-[13px]" style={{ color: 'rgba(220,228,255,0.65)' }}>{b}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePay}
                className="w-full py-4 rounded-2xl font-black tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  color: '#1a1000',
                  boxShadow: '0 4px 20px rgba(245,158,11,0.40)',
                }}
              >
                <span>Оплатить через @CryptoBot</span>
                <span>→</span>
              </button>

              <p className="text-center text-[11px]" style={{ color: 'rgba(220,228,255,0.35)' }}>
                Безопасно · Официальный сервис Telegram · VIP навсегда
              </p>
            </>
          )}

          {step === 'waiting' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div
                className="w-16 h-16 rounded-full animate-spin"
                style={{ border: '3px solid rgba(245,158,11,0.20)', borderTopColor: '#f59e0b' }}
              />
              <div>
                <p className="text-lg font-black" style={{ color: '#e2e8f0' }}>Ожидаем оплату</p>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: '#475569' }}>
                  После оплаты в @CryptoBot VIP активируется автоматически.<br />
                  Мы пришлём сообщение в Telegram.
                </p>
              </div>
              <div
                className="rounded-xl px-3 py-2 w-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-[11px]" style={{ color: 'rgba(220,228,255,0.45)' }}>
                  Можешь закрыть это окно — оплата отслеживается автоматически
                </p>
              </div>
              <button onClick={onClose} className="text-sm" style={{ color: '#475569' }}>Закрыть</button>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                style={{ background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.40)' }}
              >
                ✓
              </div>
              <div>
                <h3 className="text-xl font-black" style={{ color: '#34d399' }}>VIP активирован!</h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: 'rgba(220,228,255,0.70)' }}>
                  Оплата подтверждена. Все модули курса теперь открыты.
                </p>
              </div>
              <button
                onClick={() => { onClose(); window.location.reload(); }}
                className="mt-2 px-8 py-3 rounded-2xl font-bold text-sm"
                style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.35)' }}
              >
                Начать учиться →
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.40)' }}
              >
                ✕
              </div>
              <div>
                <p className="text-lg font-black" style={{ color: '#ef4444' }}>Ошибка</p>
                <p className="text-sm mt-2" style={{ color: '#475569' }}>{errorMsg}</p>
              </div>
              <button
                onClick={() => setStep('info')}
                className="px-6 py-2 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0' }}
              >
                Попробовать снова
              </button>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.getElementById('app-container') ?? document.body,
  );
}
