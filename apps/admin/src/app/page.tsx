"use client";

import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const COURSE_ID = 'ai-model-2';

interface Notification {
  id: string;
  username: string;
  telegramId?: string;
  network: string;
  courseId: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [grantingId, setGrantingId] = useState<string | null>(null);
  const [manualUsername, setManualUsername] = useState('');
  const [manualStatus, setManualStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [manualMsg, setManualMsg] = useState('');
  const [savedSecret, setSavedSecret] = useState('');

  const fetchNotifications = useCallback(async (s: string) => {
    try {
      const res = await fetch(`${API_URL}/payments/admin/pending`, {
        headers: { 'x-admin-secret': s },
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchNotifications(savedSecret);
    const interval = setInterval(() => fetchNotifications(savedSecret), 15000);
    return () => clearInterval(interval);
  }, [authed, savedSecret, fetchNotifications]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) {
      setSavedSecret(secret.trim());
      setAuthed(true);
    }
  };

  const handleGrantVip = async (username: string, notificationId?: string) => {
    const id = notificationId || username;
    setGrantingId(id);
    try {
      const notification = notifications.find(n => n.id === notificationId);
      const res = await fetch(`${API_URL}/payments/admin/grant-vip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': savedSecret },
        body: JSON.stringify({
          username,
          telegramId: notification?.telegramId,
          courseId: COURSE_ID,
          notificationId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Ошибка ${res.status}`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err: any) {
      alert(err.message || 'Ошибка при выдаче VIP');
    }
    setGrantingId(null);
  };

  const handleManualGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUsername.trim()) return;
    setManualStatus('loading');
    setManualMsg('');
    try {
      const res = await fetch(`${API_URL}/payments/admin/grant-vip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': savedSecret },
        body: JSON.stringify({ username: manualUsername.trim(), courseId: COURSE_ID }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Ошибка ${res.status}`);
      setManualStatus('ok');
      setManualMsg(`VIP выдан для @${manualUsername.trim()}`);
      setManualUsername('');
    } catch (err: any) {
      setManualStatus('error');
      setManualMsg(err.message || 'Неизвестная ошибка');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
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
          <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-colors">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Neuro Academy · обновляется каждые 15 сек</p>
        </div>
        <button
          onClick={() => { setAuthed(false); setSavedSecret(''); setSecret(''); }}
          className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors text-sm"
        >
          Выйти
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">

        {/* Заявки на VIP */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Заявки на VIP</h2>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-xs font-black flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
              <button
                onClick={() => fetchNotifications(savedSecret)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Обновить
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-600">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm">Новых заявок нет</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className="rounded-xl p-4 flex items-center justify-between gap-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">@{n.username}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {n.network} · {new Date(n.createdAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {n.telegramId && (
                      <p className="text-xs mt-0.5" style={{ color: '#34d399' }}>ID: {n.telegramId}</p>
                    )}
                    {!n.telegramId && (
                      <p className="text-xs mt-0.5" style={{ color: '#f59e0b' }}>⚠ нет Telegram ID</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleGrantVip(n.username, n.id)}
                    disabled={grantingId === n.id}
                    className="shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                    style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.30)' }}
                  >
                    {grantingId === n.id ? '...' : 'Выдать VIP'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Выдать вручную */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-1">Выдать вручную</h2>
          <p className="text-slate-500 text-sm mb-5">Введи @username пользователя напрямую</p>
          <form onSubmit={handleManualGrant} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="@username"
              value={manualUsername}
              onChange={e => setManualUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={manualStatus === 'loading' || !manualUsername.trim()}
              className="w-full py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white' }}
            >
              {manualStatus === 'loading' ? 'Выдаём...' : 'Выдать VIP →'}
            </button>
          </form>
          {manualMsg && (
            <div
              className="mt-3 rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                background: manualStatus === 'ok' ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)',
                color: manualStatus === 'ok' ? '#34d399' : '#f87171',
                border: `1px solid ${manualStatus === 'ok' ? 'rgba(52,211,153,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}
            >
              {manualStatus === 'ok' ? '✓ ' : '✕ '}{manualMsg}
            </div>
          )}

          <div className="mt-5 border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-600">
              Пользователь должен был хотя бы раз открыть приложение через Telegram — тогда его username сохранился в базе.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
