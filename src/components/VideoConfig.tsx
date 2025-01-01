import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Dropzone } from './Dropzone';
import { VideoPlayer } from './VideoPlayer';
import { GenerationOverlay } from './GenerationOverlay';
import type { VideoConfig as VideoConfigType } from '../types/video';
import { GenerateButton } from './GenerateButton';
import { useVideoGeneration } from '../hooks/useVideoGeneration';

interface VideoConfigProps {
  config: VideoConfigType;
  onChange: (config: VideoConfigType) => void;
  onBack: () => void;
  imageFile: File | null;
  onImageSelect: (file: File) => void;
}

export function VideoConfig({ config, onChange, onBack, imageFile, onImageSelect }: VideoConfigProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const { generate, status } = useVideoGeneration();

  React.useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleGenerate = async () => {
    if (!imageFile) return;
    try {
      await generate(imageFile, config);
    } catch (error) {
      console.error('Failed to generate video:', error);
    }
  };

  const isGenerating = status.state === 'uploading' || status.state === 'processing';

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Effects
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {!imageFile ? (
          <div className="p-6">
            <Dropzone onImageSelect={onImageSelect} />
          </div>
        ) : (
          <>
            <div className="aspect-video relative">
              {status.state === 'completed' ? (
                <VideoPlayer 
                  videoUrl={status.videoUrl}
                  fileName={`video-${Date.now()}.mp4`}
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="flex gap-3">
                  {[5, 10].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => onChange({ ...config, duration: duration as 5 | 10 })}
                      disabled={isGenerating}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${config.duration === duration
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                      disabled={isGenerating}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${config.aspectRatio === ratio.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              {status.state !== 'completed' && (
                <GenerateButton
                  onGenerate={handleGenerate}
                  loading={isGenerating}
                  disabled={!imageFile || isGenerating}
                />
              )}
            </div>
          </>
        )}
      </div>

      <GenerationOverlay status={status} />
    </div>
  );
}
