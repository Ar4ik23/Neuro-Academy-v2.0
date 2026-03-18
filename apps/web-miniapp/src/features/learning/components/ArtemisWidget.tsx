'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ArtemisWidgetProps {
  lessonContext: string;
  prefill?: string;
  onPrefillUsed?: () => void;
  isVip?: boolean;
}

export function ArtemisWidget({ lessonContext, prefill, onPrefillUsed, isVip = true }: ArtemisWidgetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Open and prefill when selection asks Artemius
  useEffect(() => {
    if (prefill) {
      setOpen(true);
      setInput(prefill);
      onPrefillUsed?.();
    }
  }, [prefill]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/artemius', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: lessonContext }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ошибка соединения. Попробуй ещё раз.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating button — fixed, right side, respects centered 480px container */}
      {!open && (
        <button
          onClick={() => {
            if (!isVip) {
              localStorage.setItem('open_vip', '1');
              router.push('/profile');
              return;
            }
            setOpen(true);
          }}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: 'max(16px, calc((100vw - 480px) / 2 + 16px))',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: isVip
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              : 'rgba(20,26,60,0.85)',
            border: isVip ? 'none' : '1.5px solid rgba(180,200,255,0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: isVip
              ? '0 4px 16px rgba(99,102,241,0.5)'
              : '0 2px 8px rgba(0,0,0,0.4)',
            zIndex: 1000,
            opacity: isVip ? 1 : 0.70,
          }}
        >
          {isVip ? '🤖' : '🔒'}
        </button>
      )}

      {/* Chat panel — fixed, within 480px container bounds */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '72px',
            left: 'max(8px, calc((100vw - 480px) / 2 + 8px))',
            right: 'max(8px, calc((100vw - 480px) / 2 + 8px))',
            height: '420px',
            background: '#1e1b2e',
            borderRadius: '16px',
            border: '1px solid rgba(99,102,241,0.35)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(99,102,241,0.12)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🤖</span>
              <span style={{ color: '#a5b4fc', fontWeight: 600, fontSize: '14px' }}>Nero</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: '18px',
                lineHeight: 1,
                padding: '2px 6px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '13px',
                marginTop: '40px',
              }}>
                Привет! Задай вопрос по теме урока 👋
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'rgba(255,255,255,0.07)',
                  color: '#fff',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                color: 'rgba(165,180,252,0.7)',
                fontSize: '13px',
              }}>
                Думаю...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 12px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Спроси что-нибудь..."
              rows={1}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                padding: '8px 10px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                padding: '8px 12px',
                fontSize: '16px',
                transition: 'background 0.2s',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
