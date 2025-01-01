import { useState, useCallback } from 'react';

const MAX_DIMENSION = 1000;
const VALID_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class ImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageError';
  }
}

export async function validateImage(file: File): Promise<void> {
  if (!VALID_TYPES.includes(file.type)) {
    throw new ImageError('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ImageError('File size too large. Maximum size is 10MB.');
  }
}

export function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      const aspectRatio = width / height;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          width = MAX_DIMENSION;
          height = Math.round(width / aspectRatio);
        } else {
          height = MAX_DIMENSION;
          width = Math.round(height * aspectRatio);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new ImageError('Failed to create canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new ImageError('Failed to convert canvas to blob'));
          }
        },
        file.type,
        0.9
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageError('Failed to load image'));
    };

    img.src = url;
  });
}