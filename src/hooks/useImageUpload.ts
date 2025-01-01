import { useState, useCallback } from 'react';
import { validateImage, resizeImage, ImageError } from '../utils/imageProcessing';

interface UseImageUploadResult {
  loading: boolean;
  error: string | null;
  uploadImage: (file: File) => Promise<File>;
  clearError: () => void;
}

export function useImageUpload(): UseImageUploadResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const uploadImage = useCallback(async (file: File): Promise<File> => {
    setLoading(true);
    setError(null);

    try {
      await validateImage(file);
      const resizedBlob = await resizeImage(file);
      
      // Create a new File from the blob
      const resizedFile = new File([resizedBlob], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });

      return resizedFile;
    } catch (err) {
      const message = err instanceof ImageError ? err.message : 'Failed to process image';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, uploadImage, clearError };
}