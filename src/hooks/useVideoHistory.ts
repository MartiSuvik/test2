import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getUserHistory } from '../services/history';
import type { VideoHistoryItem } from '../types/history';

export function useVideoHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      
      try {
        setLoading(true);
        const items = await getUserHistory(user.uid);
        setHistory(items);
      } catch (err) {
        setError('Failed to load history');
        console.error('History error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [user]);

  return { history, loading, error };
}
