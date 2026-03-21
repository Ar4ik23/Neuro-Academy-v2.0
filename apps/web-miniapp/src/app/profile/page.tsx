'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getAllNotes, deleteNote, saveNote } from '@/store/notes';
import { useVipStatus } from '@/hooks/useVipStatus';
import { PaymentModal } from '@/components/PaymentModal';
import { COURSE_ID } from '@/data/course-map';
import { apiClient } from '@/services/api';
import { getExamState } from '@/store/examProgress';
import { getCourseProgress } from '@/store/courseProgress';
import type { Note } from '@/store/notes';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) +
    ' · ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

// ── Stats Widget ─────────────────────────────────────────────────────────────
function StatsWidget({ isVip }: { isVip: boolean }) {
  const [lessonsCount, setLessonsCount] = useState(0);
  const [modulesCount, setModulesCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);
  const [examPassed, setExamPassed] = useState(false);

  useEffect(() => {
    const notes = getAllNotes();
    setNotesCount(notes.length);

    const exam = getExamState(COURSE_ID);
    setExamPassed(exam.passed);

    getCourseProgress(COURSE_ID).then(p => {
      if (p) {
        setLessonsCount(p.completedLessonIds.length);
      }
    });

    // Записываем сегодняшний день и считаем уникальные дни
    const today = new Date().toISOString().slice(0, 10);
    const days: string[] = JSON.parse(localStorage.getItem('na_active_days') || '[]');
    if (!days.includes(today)) days.push(today);
    localStorage.setItem('na_active_days', JSON.stringify(days));
    setModulesCount(days.length);
  }, []);

  const stats = [
    { icon: '📚', label: 'Уроков пройдено', value: lessonsCount, color: '#818cf8' },
    { icon: '🔥', label: 'Дней в фокусе', value: modulesCount, color: '#f97316' },
    { icon: '✏️', label: 'Заметок записано', value: notesCount, color: '#f59e0b' },
    { icon: '🏆', label: 'Экзамен', value: examPassed ? 'Сдан' : '—', color: examPassed ? '#34d399' : 'rgba(190,200,235,0.40)' },
  ];

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(14,18,50,0.70)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>

      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <p className="text-sm font-black" style={{ color: '#e2e8f0' }}>Моя статистика</p>
          <p className="text-[10px]" style={{ color: 'rgba(220,228,255,0.40)' }}>Прогресс по курсу</p>
        </div>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
          <span className="text-sm">📊</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px mx-4 mb-4 overflow-hidden rounded-xl"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        {stats.map(({ icon, label, value, color }, i) => (
          <div key={label}
            className="flex flex-col gap-1 p-3"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
            <span className="text-base leading-none">{icon}</span>
            <p className="text-lg font-black leading-tight mt-1" style={{ color }}>{value}</p>
            <p className="text-[10px] leading-tight" style={{ color: 'rgba(190,200,235,0.45)' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── VIP Widget ──────────────────────────────────────────────────────────────
function VipWidget({ isVip, onBuy }: { isVip: boolean; onBuy: () => void }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('open_vip') === '1') {
      localStorage.removeItem('open_vip');
      setExpanded(true);
    }
  }, []);

  if (isVip) {
    return (
      <div className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.30)' }}>
        <span className="text-2xl">👑</span>
        <div>
          <p className="text-sm font-black" style={{ color: '#f59e0b' }}>VIP доступ активен</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(220,228,255,0.55)' }}>Все модули открыты · Навсегда</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(14,18,50,0.70)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
      <button className="w-full flex items-center justify-between p-4" onClick={() => setExpanded(v => !v)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <span className="text-sm">👑</span>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'rgba(190,200,235,0.45)' }}>Текущий статус</p>
            <p className="text-sm font-semibold" style={{ color: 'rgba(220,228,255,0.85)' }}>Бесплатный</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!expanded && <span className="text-[11px] font-semibold" style={{ color: '#f59e0b' }}>Узнать про VIP →</span>}
          <span className={`text-[#475569] text-xs transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▾</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div style={{ height: 3, background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)', borderRadius: 99, marginTop: 12 }} />
          <p className="text-xs font-black tracking-widest uppercase" style={{ color: '#f59e0b' }}>Что входит в VIP</p>
          <div className="flex flex-col gap-2">
            {[
              { icon: '🎬', text: 'Модули 1–5 с видео и практикой' },
              { icon: '🤖', text: 'AI-ассистент Nero без ограничений' },
              { icon: '🎁', text: 'Бесплатные сервисы и промокоды' },
              { icon: '🏆', text: 'Сертификат об окончании курса' },
              { icon: '💬', text: 'Поддержка куратора' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <span className="text-base">{icon}</span>
                <p className="text-[13px]" style={{ color: 'rgba(220,228,255,0.75)' }}>{text}</p>
              </div>
            ))}
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black" style={{ color: '#f59e0b' }}>$49</span>
            <span className="text-base line-through" style={{ color: 'rgba(220,228,255,0.30)' }}>$149</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>−67%</span>
          </div>
          <p className="text-[11px]" style={{ color: 'rgba(52,211,153,0.70)' }}>✓ Разовая оплата — VIP навсегда, без подписки</p>
          <button onClick={onBuy}
            className="w-full py-3 rounded-xl font-black text-sm tracking-wide active:scale-[0.98] transition-all"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#1a1000', boxShadow: '0 4px 16px rgba(245,158,11,0.35)' }}>
            👑 Купить VIP — $49 навсегда
          </button>
        </div>
      )}
    </div>
  );
}

// ── AI Nero chat ─────────────────────────────────────────────────────────────
interface ChatMsg { role: 'user' | 'ai'; text: string }

const INITIAL_MESSAGES: ChatMsg[] = [
  { role: 'ai', text: 'Привет! Я Nero — твой AI-ассистент. Спрашивай про курс, уроки или всё что интересует 🤖' },
];

function NeroChatContent({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await apiClient.post<{ response: string }>('/ai/explain', { contextText: '', prompt: text });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Ошибка. Попробуй ещё раз.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.35)' }}>
          <span className="text-sm">🤖</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-black" style={{ color: '#e2e8f0' }}>AI-ассистент Nero</p>
          <p className="text-[10px]" style={{ color: 'rgba(220,228,255,0.40)' }}>Спрашивай про курс и не только</p>
        </div>
        {onClose && (
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}>
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="rounded-2xl px-3 py-2 text-[13px] leading-relaxed max-w-[80%]"
              style={m.role === 'user'
                ? { background: 'rgba(99,102,241,0.25)', color: '#e2e8f0', borderBottomRightRadius: 6 }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(220,228,255,0.85)', borderBottomLeftRadius: 6 }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <span className="text-xs" style={{ color: '#6366f1' }}>Nero печатает…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Спроси Nero..."
          className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }}
        />
        <button
          disabled={!input.trim() || loading}
          onClick={send}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-all"
          style={{ background: 'rgba(99,102,241,0.30)', color: '#818cf8' }}>
          →
        </button>
      </div>
    </>
  );
}

function NeroWidget({ isVip }: { isVip: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [supportFullscreen, setSupportFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(14,18,50,0.70)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>

        {/* Header — кликабельный тогл */}
        <button className="w-full flex items-center gap-3 p-4" onClick={() => setExpanded(v => !v)}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.35)' }}>
            <span className="text-sm">🤖</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-black" style={{ color: '#e2e8f0' }}>AI-ассистент Nero</p>
            <p className="text-[10px]" style={{ color: isVip ? 'rgba(99,102,241,0.80)' : 'rgba(220,228,255,0.40)' }}>
              {isVip ? '● Активен' : 'Доступно с VIP'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!expanded && <span className="text-[11px] font-semibold" style={{ color: '#818cf8' }}>Подробнее →</span>}
            <span className={`text-[#475569] text-xs transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▾</span>
          </div>
        </button>

        {/* Body */}
        {expanded && (
          <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {!isVip ? (
              <div className="p-4 flex flex-col gap-3">
                <p className="text-[11px] font-black tracking-widest uppercase" style={{ color: 'rgba(190,200,235,0.40)' }}>Что умеет Nero</p>
                {[
                  { icon: '🗺️', title: 'Сопровождение по курсу', desc: 'Nero ведёт тебя от первого урока до финала — шаг за шагом' },
                  { icon: '💡', title: 'Объяснение каждого урока', desc: 'Не понял тему? Nero разберёт её простыми словами с примерами' },
                  { icon: '📋', title: 'Инструкции по шагам', desc: 'Пошаговые руководства для выполнения практических заданий' },
                  { icon: '📝', title: 'Задания и домашняя работа', desc: 'Nero проверит, даст подсказку и поможет довести работу до результата' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.20)' }}>
                      <span className="text-sm">{icon}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold leading-tight" style={{ color: 'rgba(220,228,255,0.85)' }}>{title}</p>
                      <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: 'rgba(220,228,255,0.40)' }}>{desc}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-1 rounded-xl px-3 py-2 text-center"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <p className="text-[11px]" style={{ color: 'rgba(220,228,255,0.35)' }}>🔒 Доступно с VIP · Разовая оплата — навсегда</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-4">
                <button onClick={() => setFullscreen(true)}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl active:scale-[0.98] transition-all"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🤖</span>
                    <span className="text-[13px] font-semibold" style={{ color: '#818cf8' }}>Открыть чат с Nero</span>
                  </div>
                  <span className="text-xs" style={{ color: '#818cf8' }}>⤢</span>
                </button>
                <button onClick={() => setSupportFullscreen(true)}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl active:scale-[0.98] transition-all"
                  style={{ background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.20)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎓</span>
                    <span className="text-[13px] font-semibold" style={{ color: '#34d399' }}>Написать куратору</span>
                  </div>
                  <span className="text-xs" style={{ color: '#34d399' }}>⤢</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen portals */}
      {mounted && supportFullscreen && isVip && createPortal(
        <div className="absolute inset-0 z-[150] flex flex-col"
          style={{ background: 'rgba(8,11,34,0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <SupportChatContent onClose={() => setSupportFullscreen(false)} />
        </div>,
        document.getElementById('app-container') ?? document.body,
      )}
      {mounted && fullscreen && isVip && createPortal(
        <div className="absolute inset-0 z-[150] flex flex-col"
          style={{ background: 'rgba(8,11,34,0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <NeroChatContent onClose={() => setFullscreen(false)} />
        </div>,
        document.getElementById('app-container') ?? document.body,
      )}
    </>
  );
}

// ── Support Widget ───────────────────────────────────────────────────────────
interface SupportMsg { role: 'user' | 'support'; text: string }

const SUPPORT_PREVIEW: SupportMsg[] = [
  { role: 'support', text: 'Привет! Чем могу помочь? 👋' },
  { role: 'user', text: 'Как открыть доступ к модулю 3?' },
  { role: 'support', text: 'После покупки VIP все модули открываются автоматически 🚀' },
];

function SupportChatContent({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<SupportMsg[]>([
    { role: 'support', text: 'Привет! Я куратор курса. Задавай любые вопросы по обучению — отвечу как можно быстрее 👋' },
  ]);
  const [input, setInput] = useState('');
  const [sent, setSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setSent(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'support',
        text: 'Получил твой вопрос! Куратор ответит в течение нескольких часов. Если срочно — напиши в Telegram боту напрямую.',
      }]);
    }, 800);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="relative">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.30)' }}>
            <span className="text-base">🎓</span>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
            style={{ background: '#34d399', borderColor: 'rgba(8,11,34,0.98)' }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-black" style={{ color: '#e2e8f0' }}>Поддержка куратора</p>
          <p className="text-[10px]" style={{ color: '#34d399' }}>● Онлайн</p>
        </div>
        {onClose && (
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}>
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
            {m.role === 'support' && (
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.20)' }}>
                <span className="text-[10px]">🎓</span>
              </div>
            )}
            <div className="rounded-2xl px-3 py-2 text-[13px] leading-relaxed max-w-[78%]"
              style={m.role === 'user'
                ? { background: 'rgba(52,211,153,0.20)', color: '#e2e8f0', borderBottomRightRadius: 6 }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(220,228,255,0.85)', borderBottomLeftRadius: 6 }}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Написать куратору..."
          className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }}
        />
        <button
          disabled={!input.trim()}
          onClick={send}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-all"
          style={{ background: 'rgba(52,211,153,0.20)', color: '#34d399' }}>
          →
        </button>
      </div>
    </>
  );
}

function SupportWidget({ isVip, onBuy }: { isVip: boolean; onBuy: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(14,18,50,0.70)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>

        {/* Header — кликабельный тогл */}
        <button className="w-full flex items-center gap-3 p-4" onClick={() => setExpanded(v => !v)}>
          <div className="relative">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.30)' }}>
              <span className="text-sm">🎓</span>
            </div>
            {isVip && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2"
                style={{ background: '#34d399', borderColor: 'rgba(14,18,50,0.70)' }} />
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-black" style={{ color: '#e2e8f0' }}>Поддержка куратора</p>
            <p className="text-[10px]" style={{ color: isVip ? '#34d399' : 'rgba(220,228,255,0.40)' }}>
              {isVip ? '● Онлайн' : 'Доступно с VIP'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!expanded && <span className="text-[11px] font-semibold" style={{ color: '#34d399' }}>Подробнее →</span>}
            <span className={`text-[#475569] text-xs transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▾</span>
          </div>
        </button>

        {/* Body */}
        {expanded && (
          <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {!isVip ? (
              <div className="p-4 flex flex-col gap-3">
                <p className="text-[11px] font-black tracking-widest uppercase" style={{ color: 'rgba(190,200,235,0.40)' }}>Что даёт поддержка</p>

                {/* Blurred preview */}
                <div className="flex flex-col gap-2 rounded-xl p-3 relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none' }}>
                    {SUPPORT_PREVIEW.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-1.5`}>
                        <div className="rounded-2xl px-3 py-1.5 text-[12px]"
                          style={m.role === 'user'
                            ? { background: 'rgba(52,211,153,0.20)', color: '#e2e8f0', maxWidth: '78%' }
                            : { background: 'rgba(255,255,255,0.08)', color: 'rgba(220,228,255,0.85)', maxWidth: '78%' }}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(8,11,34,0.70)', color: 'rgba(220,228,255,0.50)', backdropFilter: 'blur(4px)' }}>
                      🔒 Заблокировано
                    </p>
                  </div>
                </div>

                {[
                  { icon: '💬', title: 'Живой чат с куратором', desc: 'Задавай вопросы по курсу и получай ответы лично от куратора' },
                  { icon: '🧭', title: 'Помощь на любом этапе', desc: 'Застрял на задании? Куратор разберёт с тобой шаг за шагом' },
                  { icon: '⚡', title: 'Быстрые ответы', desc: 'Среднее время ответа — несколько часов в рабочее время' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.18)' }}>
                      <span className="text-sm">{icon}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold leading-tight" style={{ color: 'rgba(220,228,255,0.85)' }}>{title}</p>
                      <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: 'rgba(220,228,255,0.40)' }}>{desc}</p>
                    </div>
                  </div>
                ))}

                <div className="mt-1 rounded-xl px-3 py-2 text-center"
                  style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.12)' }}>
                  <p className="text-[11px]" style={{ color: 'rgba(220,228,255,0.35)' }}>🔒 Доступно с VIP · Разовая оплата — навсегда</p>
                </div>
              </div>
            ) : (
              <button onClick={() => setFullscreen(true)}
                className="flex items-center justify-between p-4 w-full">
                <span className="text-xs font-semibold px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                  Написать куратору →
                </span>
                <button onClick={e => { e.stopPropagation(); setFullscreen(true); }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs"
                  style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                  ⤢
                </button>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen portal */}
      {mounted && fullscreen && isVip && createPortal(
        <div className="absolute inset-0 z-[150] flex flex-col"
          style={{ background: 'rgba(8,11,34,0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <SupportChatContent onClose={() => setFullscreen(false)} />
        </div>,
        document.getElementById('app-container') ?? document.body,
      )}
    </>
  );
}

// ── Notes Widget ─────────────────────────────────────────────────────────────
function NotesContent({ notes, onDelete, onAdd, onClose }: {
  notes: Note[];
  onDelete: (courseId: string, lessonId: string) => void;
  onAdd: (text: string) => void;
  onClose?: () => void;
}) {
  const [newNote, setNewNote] = useState('');

  const handleAdd = () => {
    const text = newNote.trim();
    if (!text) return;
    onAdd(text);
    setNewNote('');
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <span className="text-sm">✏️</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-black" style={{ color: '#e2e8f0' }}>Мои заметки</p>
          <p className="text-[10px]" style={{ color: 'rgba(220,228,255,0.40)' }}>{notes.length > 0 ? `${notes.length} заметок` : 'Пока пусто'}</p>
        </div>
        {onClose && (
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}>
            ✕
          </button>
        )}
      </div>

      {/* New note */}
      <div className="p-3 border-b flex gap-2 shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <textarea
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          placeholder="Написать заметку..."
          rows={2}
          className="flex-1 rounded-xl px-3 py-2 text-sm outline-none resize-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }}
        />
        <button onClick={handleAdd} disabled={!newNote.trim()}
          className="px-3 rounded-xl text-xs font-bold self-end py-2 active:scale-95 transition-all"
          style={{ background: newNote.trim() ? 'rgba(245,158,11,0.20)' : 'rgba(255,255,255,0.05)', color: newNote.trim() ? '#f59e0b' : '#475569', border: `1px solid ${newNote.trim() ? 'rgba(245,158,11,0.30)' : 'rgba(255,255,255,0.06)'}` }}>
          +
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-3">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <span className="text-3xl opacity-20">✏️</span>
            <p className="text-xs" style={{ color: '#475569' }}>Напиши свою первую заметку выше</p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.courseId + note.lessonId}
              className="rounded-xl p-3 flex flex-col gap-1 shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold truncate" style={{ color: '#f59e0b' }}>{note.moduleTitle}</p>
                  <p className="text-[10px]" style={{ color: '#475569' }}>{formatDate(note.savedAt)}</p>
                </div>
                <button onClick={() => onDelete(note.courseId, note.lessonId)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs"
                  style={{ background: 'rgba(239,68,68,0.10)', color: '#f87171' }}>
                  ✕
                </button>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: '#94a3b8', whiteSpace: 'pre-wrap' }}>{note.text}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function NotesWidget() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNotes(getAllNotes());
  }, []);

  const handleDelete = (courseId: string, lessonId: string) => {
    deleteNote(courseId, lessonId);
    setNotes(getAllNotes());
  };

  const handleAdd = (text: string) => {
    const note: Note = {
      courseId: COURSE_ID,
      lessonId: `manual-${Date.now()}`,
      moduleTitle: 'Личная заметка',
      lessonTitle: 'Общая',
      text,
      savedAt: new Date().toISOString(),
    };
    saveNote(note);
    setNotes(getAllNotes());
  };

  return (
    <>
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(14,18,50,0.70)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>

        {/* Compact header */}
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <span className="text-sm">✏️</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-black" style={{ color: '#e2e8f0' }}>Мои заметки</p>
            <p className="text-[10px]" style={{ color: 'rgba(220,228,255,0.40)' }}>{notes.length > 0 ? `${notes.length} заметок` : 'Пока пусто'}</p>
          </div>
          <button onClick={() => setFullscreen(true)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
            ⤢
          </button>
        </div>

        {/* Last note preview or empty state */}
        <button onClick={() => setFullscreen(true)} className="w-full text-left p-4">
          {notes.length > 0 ? (
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold" style={{ color: '#f59e0b' }}>
                {notes[notes.length - 1].moduleTitle} · {formatDate(notes[notes.length - 1].savedAt)}
              </p>
              <p className="text-[13px] leading-snug line-clamp-2"
                style={{ color: 'rgba(220,228,255,0.65)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {notes[notes.length - 1].text}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2" style={{ color: 'rgba(220,228,255,0.30)' }}>
              <span className="text-sm">✏️</span>
              <span className="text-sm">Написать первую заметку...</span>
            </div>
          )}
        </button>
      </div>

      {/* Fullscreen portal */}
      {mounted && fullscreen && createPortal(
        <div className="absolute inset-0 z-[150] flex flex-col"
          style={{ background: 'rgba(8,11,34,0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <NotesContent
            notes={notes}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onClose={() => setFullscreen(false)}
          />
        </div>,
        document.getElementById('app-container') ?? document.body,
      )}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const courseId = COURSE_ID;
  const isVip = useVipStatus(courseId);
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="flex flex-col p-4 pt-10 pb-24 gap-4 md:p-8 md:pt-10 lg:p-10">

      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-0.5">
          Профиль
        </h1>
        <p className="text-xs" style={{ color: 'rgba(220,228,255,0.55)' }}>Franklin Learning</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VipWidget isVip={isVip} onBuy={() => setShowPayment(true)} />
        <StatsWidget isVip={isVip} />
        <NotesWidget />
        <NeroWidget isVip={isVip} />
      </div>

      {showPayment && (
        <PaymentModal courseId={courseId} onClose={() => setShowPayment(false)} />
      )}

    </div>
  );
}
