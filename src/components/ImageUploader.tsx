import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Dropzone } from './Dropzone';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  onBack: () => void;
}

export function ImageUploader({ onFileSelect, onBack }: ImageUploaderProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Effects
      </button>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Dropzone onImageSelect={onFileSelect} />
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Supported formats: JPG, PNG</p>
          <p>Maximum file size: 10MB</p>
          <p>Output resolution: 720p</p>
          <p>Output format: MP4</p>
        </div>
      </div>
    </div>
  );
}