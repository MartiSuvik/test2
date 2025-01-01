import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getUserGenerationHistory,
  deleteHistoryEntry,
  updateHistoryEntry
} from '../services/database/history';
import type { HistoryEntry, PaginatedHistory, HistoryQueryOptions } from '../types/history';

export function useGenerationHistory(initialOptions: HistoryQueryOptions = {}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastVisible, setLastVisible] = useState<unknown | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadHistory = useCallback(async (options: HistoryQueryOptions = {}) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await getUserGenerationHistory(user.uid, options);
      
      setHistory(prev => options.startAfter ? [...prev, ...result.entries] : result.entries);
      setLastVisible(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      setError('Failed to load history');
      console.error('History error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || !lastVisible) return;
    
    loadHistory({
      startAfter: lastVisible,
      limit: initialOptions.limit
    });
  }, [hasMore, loading, lastVisible, loadHistory, initialOptions.limit]);

  const deleteEntry = useCallback(async (entryId: string) => {
    if (!user) return;

    try {
      await deleteHistoryEntry(user.uid, entryId);
      setHistory(prev => prev.filter(entry => entry.id !== entryId));
    } catch (err) {
      console.error('Delete error:', err);
      throw err;
    }
  }, [user]);

  const updateEntry = useCallback(async (
    entryId: string,
    newData: Partial<Omit<HistoryEntry, 'id' | 'userId' | 'createdAt'>>
  ) => {
    if (!user) return;

    try {
      await updateHistoryEntry(user.uid, entryId, newData);
      setHistory(prev => prev.map(entry => 
        entry.id === entryId ? { ...entry, ...newData } : entry
      ));
    } catch (err) {
      console.error('Update error:', err);
      throw err;
    }
  }, [user]);

  useEffect(() => {
    loadHistory(initialOptions);
  }, [loadHistory, initialOptions]);

  return {
    history,
    loading,
    error,
    hasMore,
    loadMore,
    deleteEntry,
    updateEntry,
    refresh: () => loadHistory(initialOptions)
  };
}