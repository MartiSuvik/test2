import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface DropzoneProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export function Dropzone({ onImageSelect, disabled }: DropzoneProps) {
  const { loading, error, uploadImage, clearError } = useImageUpload();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      try {
        const processedFile = await uploadImage(acceptedFiles[0]);
        onImageSelect(processedFile);
      } catch (err) {
        // Error is handled by useImageUpload
      }
    }
  }, [onImageSelect, uploadImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    disabled: disabled || loading,
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
        ) : (
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
        )}
        <p className="mt-2 text-sm text-gray-600">
          {loading
            ? "Processing image..."
            : isDragActive
            ? "Drop your image here..."
            : "Drag 'n' drop an image here, or click to select"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={clearError}
            className="text-sm text-red-700 hover:text-red-800 font-medium mt-1"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}