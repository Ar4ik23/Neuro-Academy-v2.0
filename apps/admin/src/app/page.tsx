"use client";

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const COURSE_ID = 'ai-model-2';

export default function AdminDashboard() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [telegramId, setTelegramId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) setAuthed(true);
  };

  const handleGrantVip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramId.trim()) return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/payments/admin/grant-vip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ telegramId: telegramId.trim(), courseId: COURSE_ID }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Ошибка ${res.status}`);
      }
      setStatus('ok');
      setMessage(`VIP выдан для telegramId: ${telegramId}`);
      setTelegramId('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Неизвестная ошибка');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          <div>
            <h1 className="text-2xl font-black text-white">Admin Panel</h1>
            <p className="text-slate-500 text-sm mt-1">Neuro Academy</p>
          </div>
          <input
            type="password"
            placeholder="Admin Secret"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-white">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Neuro Academy · Курс: AI-model 2.0</p>
        </div>
        <button
          onClick={() => { setAuthed(false); setSecret(''); }}
          className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors text-sm"
        >
          Выйти
        </button>
      </header>

      {/* VIP Grant Form */}
      <div className="max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-1">Выдать VIP-доступ</h2>
          <p className="text-slate-500 text-sm mb-5">
            Введи Telegram ID пользователя. Найти можно через бота{' '}
            <span className="text-indigo-400">@userinfobot</span>
          </p>

          <form onSubmit={handleGrantVip} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Telegram ID (например: 123456789)"
              value={telegramId}
              onChange={e => setTelegramId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !telegramId.trim()}
              className="w-full py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white' }}
            >
              {status === 'loading' ? 'Выдаём...' : 'Выдать VIP →'}
            </button>
          </form>

          {message && (
            <div
              className="mt-4 rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                background: status === 'ok' ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)',
                color: status === 'ok' ? '#34d399' : '#f87171',
                border: `1px solid ${status === 'ok' ? 'rgba(52,211,153,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}
            >
              {status === 'ok' ? '✓ ' : '✕ '}{message}
            </div>
          )}
        </div>

        <div className="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Как найти Telegram ID</h3>
          <ol className="flex flex-col gap-2 text-sm text-slate-400">
            <li className="flex gap-2"><span className="text-indigo-400 font-bold">1.</span> Пользователь пишет боту <span className="text-white">@userinfobot</span> в Telegram</li>
            <li className="flex gap-2"><span className="text-indigo-400 font-bold">2.</span> Бот отвечает с числовым ID</li>
            <li className="flex gap-2"><span className="text-indigo-400 font-bold">3.</span> Вставляй это число сюда</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
