import React from 'react';
import { Loader2 } from 'lucide-react';
import type { GenerationStatus } from '../types/video';

interface GenerationOverlayProps {
  status: GenerationStatus;
}

export function GenerationOverlay({ status }: GenerationOverlayProps) {
  if (status.state === 'idle') return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {status.state === 'uploading' && 'Uploading image...'}
              {status.state === 'processing' && 'Generating your video...'}
              {status.state === 'error' && 'Generation failed'}
            </h3>
            
            {status.state !== 'error' && (
              <p className="text-sm text-gray-500 mt-1">
                This may take a few minutes
              </p>
            )}
          </div>

          {status.state === 'error' && (
            <div className="text-red-600 text-sm">
              {status.error}
            </div>
          )}

          {(status.state === 'uploading' || status.state === 'processing') && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${status.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
