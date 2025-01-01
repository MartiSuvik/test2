import React from 'react';
import { Loader2 } from 'lucide-react';
import type { VideoConfig } from '../types/video';

interface GenerateButtonProps {
  onGenerate: () => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

export function GenerateButton({ onGenerate, disabled, loading }: GenerateButtonProps) {
  return (
    <button
      onClick={onGenerate}
      disabled={disabled || loading}
      className="w-full mt-6 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {loading ? 'Generating Video...' : 'Generate Video'}
    </button>
  );
}