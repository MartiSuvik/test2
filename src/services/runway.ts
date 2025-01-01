import type { VideoConfig } from '../types/video';

const RUNWAY_API_KEY = import.meta.env.VITE_RUNWAY_API_KEY;

export async function generateVideo(imageUrl: string, config: VideoConfig): Promise<string> {
  // Create a proxy URL to handle CORS
  const proxyUrl = '/api/runway/generate';
  
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: RUNWAY_API_KEY,
      imageUrl,
      config
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate video');
  }

  const result = await response.json();
  return result.id;
}

export async function checkGenerationStatus(id: string): Promise<any> {
  // Create a proxy URL to handle CORS
  const proxyUrl = `/api/runway/status/${id}`;
  
  const response = await fetch(proxyUrl, {
    headers: {
      'Authorization': `Bearer ${RUNWAY_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to check generation status');
  }

  return response.json();
}