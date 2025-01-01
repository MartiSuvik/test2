import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { VideoConfig as VideoConfigType } from '../types/video';
import { GenerateButton } from './GenerateButton';
import { useVideoGeneration } from '../hooks/useVideoGeneration';

interface VideoConfigProps {
  config: VideoConfigType;
  onChange: (config: VideoConfigType) => void;
  onBack: () => void;
  imageFile: File;
}

export function VideoConfig({ config, onChange, onBack, imageFile }: VideoConfigProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const { generate, progress } = useVideoGeneration();

  React.useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleGenerate = async () => {
    try {
      await generate(imageFile, config);
    } catch (error) {
      console.error('Failed to generate video:', error);
      // You might want to show an error message to the user here
    }
  };

  const isGenerating = progress.state === 'uploading' || progress.state === 'processing';

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Image Upload
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="aspect-video relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
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

          <GenerateButton
            onGenerate={handleGenerate}
            loading={isGenerating}
            disabled={!imageFile}
          />

          {progress.state === 'error' && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {progress.error}
            </div>
          )}

          {progress.state === 'completed' && progress.videoUrl && (
            <div className="mt-4 p-4 bg-green-50 text-green-600 rounded-lg">
              Video generated successfully! 
              <a 
                href={progress.videoUrl}
                download
                className="ml-2 text-blue-600 hover:underline"
              >
                Download video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}