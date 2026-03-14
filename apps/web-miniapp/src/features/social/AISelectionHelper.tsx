"use client";

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import { AIResponseDto } from '@neuro-academy/types';

export const AISelectionHelper: React.FC = () => {
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const selectedText = window.getSelection()?.toString().trim();
      if (selectedText && selectedText.length > 3) {
        setSelection({ text: selectedText, x: e.clientX, y: e.clientY });
      } else {
        setSelection(null);
        setResponse(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleAskAI = async () => {
    if (!selection) return;
    setLoading(true);
    try {
      const res = await apiClient.post<AIResponseDto>('/ai/explain', {
        highlightedText: selection.text,
        contextText: document.body.innerText.substring(0, 1000), // simplistic context
        lessonId: 'current-lesson-id' // would need actual id
      });
      setResponse(res.response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!selection) return null;

  return (
    <div 
      className="fixed z-[999] animate-enter"
      style={{ top: selection.y + 10, left: Math.min(selection.x, window.innerWidth - 320) }}
    >
      <div className="glass-card premium-border rounded-2xl p-4 w-72 shadow-2xl">
        {!response ? (
          <button 
            onClick={handleAskAI}
            className="w-full py-2 bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <span>✨</span> {loading ? 'Thinking...' : 'Explain with AI'}
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AI EXPLANATION</span>
            <p className="text-xs text-slate-300 leading-relaxed italic">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};
