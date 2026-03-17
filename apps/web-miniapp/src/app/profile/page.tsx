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
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.18)' }}
    >
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
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs"
          style={{ background: 'rgba(239,68,68,0.10)', color: '#f87171' }}
        >
          ✕
        </button>
      </div>
      <div
        className="text-sm leading-relaxed cursor-pointer"
        style={{ color: '#94a3b8', whiteSpace: 'pre-wrap' }}
        onClick={() => setExpanded(v => !v)}
      >
        {expanded ? note.text : note.text.slice(0, 120) + (note.text.length > 120 ? '…' : '')}
      </div>
      {note.text.length > 120 && (
        <button onClick={() => setExpanded(v => !v)} className="text-xs self-start" style={{ color: '#6366f1' }}>
          {expanded ? 'Свернуть ▲' : 'Читать полностью ▼'}
        </button>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(getAllNotes());
  }, []);

  const handleDelete = (courseId: string, lessonId: string) => {
    deleteNote(courseId, lessonId);
    setNotes(prev => prev.filter(n => !(n.courseId === courseId && n.lessonId === lessonId)));
  };

  return (
    <div className="flex flex-col p-4 pt-10 pb-24 gap-4">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-0.5">
          Профиль
        </h1>
        <p className="text-xs" style={{ color: 'rgba(220,228,255,0.55)' }}>Nero Academy</p>
      </div>

      {/* Notes window */}
      <div
        className="rounded-2xl flex flex-col gap-3 p-4"
        style={{
          background: 'rgba(14,18,50,0.65)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold" style={{ color: '#e2e8f0' }}>✏️ Мои заметки</h2>
          {notes.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(245,158,11,0.18)', color: '#f59e0b' }}
            >
              {notes.length}
            </span>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="text-4xl opacity-30">✏️</span>
            <p className="font-semibold text-sm" style={{ color: '#e2e8f0' }}>Заметок пока нет</p>
            <p className="text-xs" style={{ color: '#475569' }}>
              Открой любой урок и запиши свои мысли — они появятся здесь
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
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

    </div>
  );
}
