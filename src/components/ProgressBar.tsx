import React from 'react';
import { Loader2 } from 'lucide-react';
import type { ProgressStage } from '../hooks/useProgress';

interface ProgressBarProps {
  stage: ProgressStage;
  progress: number;
  error?: string;
  onRetry?: () => void;
}

export function ProgressBar({ stage, progress, error, onRetry }: ProgressBarProps) {
  const stageLabels = {
    upload: 'Uploading image...',
    init: 'Initializing video generation...',
    generate: 'Generating video...',
    prepare: 'Preparing final video...',
    complete: 'Video generation complete!',
    error: 'Error occurred'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{stageLabels[stage]}</span>
        <span>{Math.round(progress)}%</span>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Try Again
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {stage !== 'complete' && (
            <div className="flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          )}
        </>
      )}
    </div>
  );
}