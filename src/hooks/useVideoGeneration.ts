import { useState, useCallback } from 'react';
import type { VideoConfig, UploadProgress } from '../types/video';
import { uploadImage } from '../services/storage';
import { useAuth } from './useAuth';

export function useVideoGeneration() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UploadProgress>({
    progress: 0,
    state: 'idle',
  });

  const generate = useCallback(
    async (file: File, config: VideoConfig) => {
      if (!user) {
        throw new Error('User must be authenticated');
      }

      try {
        // Upload to Firebase
        setProgress({ progress: 0, state: 'uploading' });
        const { url } = await uploadImage(file, user.uid, (progress) => {
          setProgress({ progress, state: 'uploading' });
        });

        // Start video generation
        setProgress({ progress: 0, state: 'processing' });
        
        const response = await fetch('/.netlify/functions/runway', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: url,
            config
          }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to generate video');
        }
        
        if (result.videoUrl) {
          setProgress({ 
            progress: 100, 
            state: 'completed',
            videoUrl: result.videoUrl 
          });
          return result;
        } else {
          throw new Error('No video URL in response');
        }
      } catch (error) {
        console.error('Video generation error:', error);
        setProgress({
          progress: 0,
          state: 'error',
          error: error instanceof Error ? error.message : 'An error occurred',
        });
        throw error;
      }
    },
    [user]
  );

  return {
    progress,
    generate,
  };
}