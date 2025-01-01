export interface ConversionStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
}

export interface UploadResponse {
  id: string;
  status: 'pending';
}