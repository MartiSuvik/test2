import type { VideoConfig } from '../types/video';

interface GenerationResponse {
  taskId: string;
  status: string;
}

interface StatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
}

export async function startGeneration(imageUrl: string, config: VideoConfig): Promise<GenerationResponse> {
  const response = await fetch('/.netlify/functions/runway', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl, config }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to start generation');
  }

  return response.json();
}

export async function checkStatus(taskId: string): Promise<StatusResponse> {
  const response = await fetch(`/.netlify/functions/runway/status/${taskId}`);

  if (!response.ok) {
    throw new Error('Failed to check status');
  }

  return response.json();
}
