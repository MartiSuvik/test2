import { useState, useCallback } from 'react';
import { uploadImage } from '../services/storage';
import { saveVideoToHistory } from '../services/history';
import type { VideoConfig, GenerationStatus } from '../types/video';
import { useAuth } from './useAuth';

const GENERATION_TIMEOUT = 300000; // 5 minutes
const POLLING_INTERVAL = 2000; // 2 seconds

export function useVideoGeneration() {
  const { user } = useAuth();
  const [status, setStatus] = useState<GenerationStatus>({ state: 'idle' });

  const checkGenerationStatus = async (taskId: string) => {
    const response = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-11-06'
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check generation status');
    }

    const data = await response.json();
    return {
      status: data.status,
      output: data.output?.[0]
    };
  };

  const waitForCompletion = async (taskId: string): Promise<string> => {
    let attempts = 0;
    const maxAttempts = Math.floor(GENERATION_TIMEOUT / POLLING_INTERVAL);

    while (attempts < maxAttempts) {
      const { status: taskStatus, output } = await checkGenerationStatus(taskId);
      
      if (taskStatus === 'SUCCEEDED' && output) {
        return output;
      }
      
      if (taskStatus === 'FAILED') {
        throw new Error('Video generation failed');
      }

      const progress = Math.min(90, (attempts / maxAttempts) * 100);
      setStatus({ state: 'processing', progress });

      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
      attempts++;
    }

    throw new Error('Generation timed out');
  };

  const generate = useCallback(async (file: File, config: VideoConfig) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      // Upload phase
      setStatus({ state: 'uploading', progress: 0 });
      const { url } = await uploadImage(file, user.uid, (progress) => {
        setStatus({ state: 'uploading', progress });
      });

      // Initialize generation
      setStatus({ state: 'processing', progress: 0 });
      const response = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_RUNWAY_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Runway-Version': '2024-11-06'
        },
        body: JSON.stringify({
          promptImage: url,
          seed: Math.floor(Math.random() * 4294967295),
          model: 'gen3a_turbo',
          promptText: 'Generate a video',
          watermark: false,
          duration: config.duration,
          ratio: config.aspectRatio === '16:9' ? '1280:768' : '768:1280'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start video generation');
      }

      const { id } = await response.json();
      if (!id) {
        throw new Error('No task ID received');
      }

      // Wait for completion
      const videoUrl = await waitForCompletion(id);
      
      // Save to history
      await saveVideoToHistory(user.uid, videoUrl, config);
      
      setStatus({ 
        state: 'completed',
        progress: 100,
        videoUrl 
      });

      return { videoUrl };
    } catch (error) {
      console.error('Video generation error:', error);
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