'use client';

import { useState, useEffect } from 'react';
import { getAllNotes, deleteNote } from '@/store/notes';
import type { Note } from '@/store/notes';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function NoteCard({ note, onDelete }: { note: Note; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2 transition-all"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.18)' }}
    >
      {/* meta */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: '#f59e0b' }}>
            {note.moduleTitle}
          </p>
          <p className="text-sm font-semibold truncate" style={{ color: '#e2e8f0' }}>
            {note.lessonTitle}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
            {formatDate(note.savedAt)}
          </p>
        </div>
        <button
          onClick={onDelete}
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs transition-all"
          style={{ background: 'rgba(239,68,68,0.10)', color: '#f87171' }}
        >
          ✕
        </button>
      </div>

      {/* text */}
      <div
        className="text-sm leading-relaxed cursor-pointer"
        style={{ color: '#94a3b8', whiteSpace: 'pre-wrap' }}
        onClick={() => setExpanded(v => !v)}
      >
        {expanded ? note.text : note.text.slice(0, 120) + (note.text.length > 120 ? '…' : '')}
      </div>
      {note.text.length > 120 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-xs self-start"
          style={{ color: '#6366f1' }}
        >
          {expanded ? 'Свернуть ▲' : 'Читать полностью ▼'}
        </button>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const [tab,   setTab]   = useState<'profile' | 'notes'>('profile');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (tab === 'notes') setNotes(getAllNotes());
  }, [tab]);

  const handleDelete = (courseId: string, lessonId: string) => {
    deleteNote(courseId, lessonId);
    setNotes(prev => prev.filter(n => !(n.courseId === courseId && n.lessonId === lessonId)));
  };

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ background: '#0b0f1a' }}>

      {/* ── Header ── */}
      <div className="px-4 pt-10 pb-4">
        <h1 className="text-xl font-bold" style={{ color: '#e2e8f0' }}>Профиль</h1>
      </div>

      {/* ── Tabs ── */}
      <div className="px-4 mb-4">
        <div
          className="flex rounded-2xl p-1 gap-1"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {(['profile', 'notes'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={tab === t ? {
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: '#ffffff',
                boxShadow: '0 0 16px rgba(99,102,241,0.30)',
              } : {
                color: '#475569',
              }}
            >
              {t === 'profile' ? '👤 Профиль' : '✏️ Заметки'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      {tab === 'profile' && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
            style={{ background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.30)' }}
          >
            🧑‍🎓
          </div>
          <p className="text-lg font-bold" style={{ color: '#e2e8f0' }}>Студент</p>
          <p className="text-sm" style={{ color: '#475569' }}>Neuro-Academy 2.0</p>
          <div
            className="w-full rounded-2xl p-4 mt-4 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-xs" style={{ color: '#475569' }}>Полный профиль появится после подключения аккаунта</p>
          </div>
        </div>
      )}

      {tab === 'notes' && (
        <div className="flex-1 px-4">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 pt-20 text-center">
              <span className="text-5xl">✏️</span>
              <p className="font-semibold" style={{ color: '#e2e8f0' }}>Заметок пока нет</p>
              <p className="text-sm" style={{ color: '#475569' }}>
                Открой любой урок и запиши свои мысли — они появятся здесь
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs mb-1" style={{ color: '#475569' }}>
                {notes.length} {notes.length === 1 ? 'заметка' : notes.length < 5 ? 'заметки' : 'заметок'}
              </p>
              {notes.map(note => (
                <NoteCard
                  key={note.courseId + note.lessonId}
                  note={note}
                  onDelete={() => handleDelete(note.courseId, note.lessonId)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
