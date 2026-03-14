import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/api';

export const useNotes = (lessonId?: string) => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const data = await apiClient.get<any[]>(`/notes/lesson/${lessonId}`);
      setNotes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  const addNote = async (text: string, highlightedText?: string) => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const response = await apiClient.post<any>('/notes', {
        lessonId,
        text,
        highlightedText,
      });
      setNotes(prev => [response, ...prev]);
      return response;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await apiClient.delete(`/notes/${noteId}`);
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (lessonId) {
      fetchNotes();
    }
  }, [lessonId, fetchNotes]);

  return { notes, loading, error, addNote, deleteNote, refresh: fetchNotes };
};
