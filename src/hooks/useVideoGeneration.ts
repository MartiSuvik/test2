import { useState, useCallback } from 'react';
import { generateVideo, checkGenerationStatus } from '../services/runway';
import { uploadImage } from '../services/storage';
import type { VideoConfig, GenerationStatus } from '../types/video';
import { useAuth } from './useAuth';

const GENERATION_TIMEOUT = 300000; // 5 minutes

export function useVideoGeneration() {
  const { user } = useAuth();
  const [status, setStatus] = useState<GenerationStatus>({ state: 'idle' });

  const generate = useCallback(async (file: File, config: VideoConfig) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      // Start upload
      setStatus({ state: 'uploading', progress: 0 });
      const { url } = await uploadImage(file, user.uid, (progress) => {
        setStatus({ state: 'uploading', progress });
      });

      // Start processing
      setStatus({ state: 'processing', progress: 0 });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), GENERATION_TIMEOUT);

      try {
        const response = await fetch('/.netlify/functions/runway', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: url, config }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to generate video');
        }

        const result = await response.json();
        
        if (result.videoUrl) {
          setStatus({ 
            state: 'completed',
            progress: 100,
            videoUrl: result.videoUrl 
          });
          return result;
        } else {
          throw new Error('No video URL in response');
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      setStatus({
        state: 'error',
        error: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    }
  }, [user]);

  return {
    status,
    generate,
  };
}
