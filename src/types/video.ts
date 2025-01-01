export interface VideoConfig {
  duration: 5 | 10;
  aspectRatio: '16:9' | '9:16';
}

export type GenerationStatus = 
  | { state: 'idle' }
  | { state: 'uploading'; progress: number }
  | { state: 'processing'; progress: number }
  | { state: 'completed'; progress: number; videoUrl: string }
  | { state: 'error'; error: string };
