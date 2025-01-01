import type { VideoConfig } from './video';

export interface HistoryEntry {
  id: string;
  imageUrl: string;
  videoUrl: string;
  createdAt: string;
  config: VideoConfig;
  status: 'completed' | 'failed';
  error?: string;
}

export interface PaginatedHistory {
  entries: HistoryEntry[];
  lastVisible: unknown | null;
  hasMore: boolean;
}

export interface HistoryQueryOptions {
  limit?: number;
  startAfter?: unknown;
}
