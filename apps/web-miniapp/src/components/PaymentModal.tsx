'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const PRICE_USDT = 49;
const PRICE_BTC = '0.00049'; // ~49 USD at ~100k rate

// USDT → зелёный, TON/BTC → синий/оранжевый
const USDT_COLOR = '#26a17b';
const TON_COLOR  = '#0098EA';
const BTC_COLOR  = '#F7931A';

const WALLETS = [
  {
    id: 'usdt-trc20',
    label: 'USDT',
    network: 'TRC-20 (TRON)',
    address: 'TXB4oU2KPCbFQz9FdFvzfnyazscuuXh4BY',
    amount: `${PRICE_USDT} USDT`,
    color: USDT_COLOR,
    badge: 'Рекомендуем · низкая комиссия',
  },
  {
    id: 'usdt-bep20',
    label: 'USDT',
    network: 'BEP-20 (BSC)',
    address: '0x80730ea994388605ea0ec9af1682b2d6356568ec',
    amount: `${PRICE_USDT} USDT`,
    color: USDT_COLOR,
    badge: '',
  },
  {
    id: 'usdt-erc20',
    label: 'USDT',
    network: 'ERC-20 (Ethereum)',
    address: '0x80730ea994388605ea0ec9af1682b2d6356568ec',
    amount: `${PRICE_USDT} USDT`,
    color: USDT_COLOR,
    badge: 'Высокая комиссия',
  },
  {
    id: 'usdt-ton',
    label: 'USDT',
    network: 'USDT TON',
    address: 'UQAZCnsnp-pQWIx0DH8Yk_F9-lPiWCSmxzyY9ZYUU0Mrv3lp',
    amount: `${PRICE_USDT} USDT`,
    color: USDT_COLOR,
    badge: '',
  },
  {
    id: 'ton',
    label: 'TON',
    network: 'TON',
    address: 'UQAZCnsnp-pQWIx0DH8Yk_F9-lPiWCSmxzyY9ZYUU0Mrv3lp',
    amount: 'эквивалент 49 USD',
    color: TON_COLOR,
    badge: '',
  },
  {
    id: 'btc',
    label: 'BTC',
    network: 'Bitcoin',
    address: '1JHhXvuJBvFkLr74ipVnCbYv6Kt8LSuhLV',
    amount: `${PRICE_BTC} BTC`,
    color: BTC_COLOR,
    badge: '',
  },
];

interface PaymentModalProps {
  onClose: () => void;
  courseId: string;
}

type Step = 'select' | 'address' | 'sent';

export function PaymentModal({ onClose }: PaymentModalProps) {
  const [step, setStep] = useState<Step>('select');
  const [selected, setSelected] = useState<typeof WALLETS[0] | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectWallet = (wallet: typeof WALLETS[0]) => {
    setSelected(wallet);
    setStep('address');
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
              <h2 className="text-lg font-black" style={{ color: '#e2e8f0' }}>
                {step === 'select' ? 'Выбери сеть оплаты' : step === 'address' ? 'Отправь крипту' : 'Заявка отправлена'}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                {step === 'select' ? 'Доступны 6 вариантов' : step === 'address' ? `${selected?.label} · ${selected?.network}` : 'Ожидаем подтверждения'}
              </p>
            </div>
            <button
              onClick={step === 'address' ? () => setStep('select') : onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}
            >
              {step === 'address' ? '←' : '✕'}
            </button>
          </div>

          {/* Amount badge */}
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
            <div className="px-2 py-1 rounded-lg text-xs font-black" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
              −67%
            </div>
          </div>

          {/* STEP: SELECT NETWORK */}
          {step === 'select' && (
            <div className="flex flex-col gap-2">
              {WALLETS.map(w => (
                <button
                  key={w.id}
                  onClick={() => handleSelectWallet(w)}
                  className="w-full rounded-2xl p-4 flex items-center justify-between text-left active:scale-[0.98] transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: `${w.color}25`, color: w.color, border: `1px solid ${w.color}40` }}
                    >
                      {w.label}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#e2e8f0' }}>{w.network}</p>
                      {w.badge && (
                        <p className="text-[11px] mt-0.5" style={{ color: w.badge.includes('Рекоменд') ? '#34d399' : '#f59e0b' }}>
                          {w.badge}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-bold" style={{ color: w.color }}>{w.amount}</p>
                </button>
              ))}
            </div>
          )}

          {/* STEP: SHOW ADDRESS */}
          {step === 'address' && selected && (
            <div className="flex flex-col gap-4">
              <div
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                  Адрес кошелька
                </p>
                <div
                  className="rounded-xl p-3 break-all text-xs font-mono leading-relaxed"
                  style={{ background: 'rgba(0,0,0,0.30)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {selected.address}
                </div>
                <button
                  onClick={() => handleCopy(selected.address)}
                  className="w-full py-3 rounded-xl font-bold text-sm active:scale-[0.98] transition-all"
                  style={{
                    background: copied ? 'rgba(52,211,153,0.15)' : `${selected.color}25`,
                    color: copied ? '#34d399' : selected.color,
                    border: `1px solid ${copied ? 'rgba(52,211,153,0.35)' : selected.color + '40'}`,
                  }}
                >
                  {copied ? '✓ Скопировано!' : 'Скопировать адрес'}
                </button>
              </div>

              <div
                className="rounded-2xl p-4 flex flex-col gap-2"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.20)' }}
              >
                <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>Отправь точную сумму</p>
                <p className="text-2xl font-black" style={{ color: '#e2e8f0' }}>{selected.amount}</p>
                <p className="text-xs" style={{ color: 'rgba(220,228,255,0.45)' }}>
                  Сеть: {selected.network}. Отправляй только {selected.label} в этой сети — иначе средства потеряются.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                {[
                  'Скопируй адрес выше',
                  `Отправь ровно ${selected.amount} в сети ${selected.network}`,
                  'Нажми кнопку ниже — мы проверим и откроем VIP',
                ].map((t, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div
                      className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black mt-0.5"
                      style={{ background: 'rgba(245,158,11,0.20)', color: '#f59e0b' }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(220,228,255,0.75)' }}>{t}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep('sent')}
                className="w-full py-4 rounded-2xl font-black tracking-wide active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  color: '#1a1000',
                  boxShadow: '0 4px 20px rgba(245,158,11,0.40)',
                }}
              >
                Я отправил оплату →
              </button>
            </div>
          )}

          {/* STEP: SENT */}
          {step === 'sent' && (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                style={{ background: 'rgba(52,211,153,0.12)', border: '2px solid rgba(52,211,153,0.35)' }}
              >
                ✓
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black" style={{ color: '#e2e8f0' }}>Ждём перевод!</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(220,228,255,0.65)' }}>
                  Как только получим оплату — вручную откроем тебе VIP-доступ.
                  Обычно это занимает до 24 часов.
                </p>
              </div>

              <div
                className="w-full rounded-2xl p-4 flex flex-col gap-2 text-left"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Чтобы ускорить</p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(220,228,255,0.75)' }}>
                  Напиши нам в Telegram: <span className="font-bold" style={{ color: '#f59e0b' }}>@nero_learning_support</span>
                  <br />
                  Укажи свой username и сеть через которую платил.
                </p>
              </div>

              <button
                onClick={onClose}
                className="mt-2 px-8 py-3 rounded-2xl font-bold text-sm"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                Закрыть
              </button>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.getElementById('app-container') ?? document.body,
  );
}
