export interface VideoHistoryItem {
  id: string;
  userId: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  config: {
    duration: number;
    aspectRatio: string;
  };
}
