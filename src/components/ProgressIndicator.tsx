import React from 'react';
import { Loader2 } from 'lucide-react';
import type { UploadProgress } from '../types/video';

interface ProgressIndicatorProps {
  progress: UploadProgress;
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          {progress.state === 'uploading' && 'Uploading...'}
          {progress.state === 'processing' && 'Processing...'}
          {progress.state === 'completed' && 'Complete!'}
          {progress.state === 'error' && 'Error'}
        </span>
        {progress.state !== 'error' && (
          <span>{Math.round(progress.progress)}%</span>
        )}
      </div>

      {progress.state === 'error' ? (
        <div className="text-red-600 text-sm">{progress.error}</div>
      ) : (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      )}

      {(progress.state === 'uploading' || progress.state === 'processing') && (
        <div className="flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
      )}
    </div>
  );
}