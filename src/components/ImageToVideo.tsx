import React, { useState } from 'react';
import { Dropzone } from './Dropzone';
import { ConversionStatus } from './ConversionStatus';
import { useVideoGeneration } from '../hooks/useVideoGeneration';
import type { VideoConfig } from '../types/video';

interface ImageToVideoProps {
  config: VideoConfig;
  onChange: (config: VideoConfig) => void;
  onBack: () => void;
  imageFile: File;
}

export function ImageToVideo({ config, onChange, onBack, imageFile }: ImageToVideoProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { generate, progress } = useVideoGeneration();

  const handleGenerate = async () => {
    if (!selectedFile) return;
    try {
      await generate(selectedFile, config);
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <Dropzone
          onImageSelect={(file) => setSelectedFile(file)}
        />
      ) : (
        <div className="space-y-6">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
          />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <div className="flex gap-3">
                {[5, 10].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => onChange({ ...config, duration: duration as 5 | 10 })}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${config.duration === duration
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {duration} seconds
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aspect Ratio
              </label>
              <div className="flex gap-3">
                {[
                  { label: 'Landscape (16:9)', value: '16:9' },
                  { label: 'Portrait (9:16)', value: '9:16' },
                ].map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() =>
                      onChange({ ...config, aspectRatio: ratio.value as '16:9' | '9:16' })
                    }
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${config.aspectRatio === ratio.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={progress.state === 'uploading' || progress.state === 'processing'}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {progress.state === 'uploading' || progress.state === 'processing'
                ? 'Generating...'
                : 'Generate Video'}
            </button>
          </div>

          <ConversionStatus status={{
            status: progress.state === 'completed' ? 'completed' : 
                    progress.state === 'error' ? 'failed' :
                    progress.state === 'idle' ? 'pending' : 'processing',
            videoUrl: progress.videoUrl,
            error: progress.error
          }} />
        </div>
      )}
    </div>
  );
}