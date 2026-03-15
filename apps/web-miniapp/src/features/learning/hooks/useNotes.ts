import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/api';
import type { NoteDto } from '@neuro-academy/types';

export const useNotes = (lessonId?: string) => {
  const [notes, setNotes] = useState<NoteDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      // API: GET /notes?lessonId=...
      const { data } = await apiClient.get<NoteDto[]>('/notes', { params: { lessonId } });
      setNotes(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  const addNote = async (text: string, highlightedText?: string) => {
    if (!lessonId) return;
    try {
      const { data } = await apiClient.post<NoteDto>('/notes', { lessonId, text, highlightedText });
      setNotes((prev) => [data, ...prev]);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add note');
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await apiClient.delete(`/notes/${noteId}`);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  useEffect(() => {
    if (lessonId) fetchNotes();
  }, [lessonId, fetchNotes]);

  return { notes, loading, error, addNote, deleteNote, refresh: fetchNotes };
};
