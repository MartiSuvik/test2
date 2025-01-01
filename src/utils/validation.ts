export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FORMATS = ['image/jpeg', 'image/png'];

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateImage(file: File): void {
  if (!ALLOWED_FORMATS.includes(file.type)) {
    throw new ValidationError('Please upload a JPEG or PNG image');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError('Image size must be less than 10MB');
  }
}