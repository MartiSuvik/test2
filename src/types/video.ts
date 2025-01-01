export interface VideoConfig {
  duration: 5 | 10;
  aspectRatio: '16:9' | '9:16';
}

export interface VideoGenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
}

export interface UploadProgress {
  progress: number;
  state: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  videoUrl?: string;
}